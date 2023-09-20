import {
  clearCacheForItemAndAncestors,
  findItemByIdAndClearCache,
} from "app/items/clearCacheForItemAndAncestors"
import { CreateDatum, UpdateDatum } from "app/properties/Datum"
import db from "db"
import { ItemType } from "@prisma/client"
import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import sample from "lodash/sample"
import { getData } from "../../app/properties/getData"
import type { Job } from "packages/indexer/src/types"
import { ChildItem } from "app/items/queries/getRootItem"
import { browsers } from "app/sockets"
import { propertyTemplateSchema } from "app/propertyTemplates/propertyTemplateSchema"
import { bigint } from "app/propertyTemplates/bigint"
import { IndexerCreate } from "../../packages/indexer/src/IndexerSchema"
import { persisted } from "app/items/components/persisted"
import { v4 as uuidv4 } from "uuid"

const UpdateItem = z.object({
  id: z.number().optional(),
  name: z.string(),
  genericName: z.string().optional(),
  contentState: z.any(),
  url: z.string(),
  type: z.enum(Object.keys(ItemType) as [ItemType]),
  standalone: z.boolean(),
})

const affiliateMap = new Map<string, (url: URL) => URL>()

const affiliateAmazon = (url: URL) => {
  url.searchParams.set("tag", "idealguides-20")

  return url
}

affiliateMap.set("www.amazon.com", affiliateAmazon)
affiliateMap.set("amazon.com", affiliateAmazon)

const affiliate = (plainUrl: string) => {
  // URL throws if the the url arg is invalid
  try {
    const url = new URL(plainUrl)

    const transform = affiliateMap.get(url.hostname)

    if (transform) {
      return String(transform(url))
    }
  } finally {
    return plainUrl
  }
}

export const appRouter = router({
  createProperty: publicProcedure
    .input(CreateDatum)
    .mutation(async ({ input }) => {
      const {
        itemId,
        featured,
        position,
        digitsAfterDecimal,
        fileId,
        indexerId,
        ...otherInputs
      } = input

      const datum = await db.property.create({
        data: {
          datum: {
            create: {
              ...otherInputs,
              digitsAfterDecimal: digitsAfterDecimal
                ? Number(digitsAfterDecimal)
                : null,
              indexerId: indexerId ? Number(indexerId) : null,
              fileId: fileId ? Number(fileId) : null,
              affiliateLink: otherInputs.url
                ? affiliate(otherInputs.url)
                : undefined,
            },
          },
          item: { connect: { id: itemId } },
          featured,
          position,
        },
        include: {
          datum: { include: { image: true, indexer: true } },
        },
      })

      await findItemByIdAndClearCache(itemId)

      return datum
    }),
  updateProperty: publicProcedure
    .input(UpdateDatum)
    .mutation(async ({ input, ctx }) => {
      const { itemId, featured, position, id, ...otherInputs } = input

      const property = await db.property.update({
        data: {
          datum: {
            update: {
              ...otherInputs,
              indexerId: otherInputs.indexerId
                ? Number(otherInputs.indexerId)
                : null,
              fileId: otherInputs.fileId ? Number(otherInputs.fileId) : null,
              affiliateLink: otherInputs.url
                ? affiliate(otherInputs.url)
                : undefined,
            },
          },
          item: { connect: { id: itemId } },
          featured,
          position,
        },
        include: {
          datum: { include: { image: true, indexer: true } },
        },
        where: { id: BigInt(id) },
      })

      await findItemByIdAndClearCache(itemId)

      await reIndex(property, ctx?.userId || 0)

      return property
    }),
  indexers: publicProcedure
    .input(z.object({ hostnames: z.array(z.string()) }))
    .query(async ({ input }) => {
      const indexers = await db.indexer.findMany({
        where: { hostname: { in: input.hostnames } },
      })

      return indexers
    }),
  createOrUpdatePropertyTemplate: publicProcedure
    .input(z.unknown())
    .mutation(async ({ input }) => {
      const { properties, ...propertyTemplate } =
        propertyTemplateSchema.parse(input)

      if (persisted(propertyTemplate)) {
        const [updatedPropertyTemplate] = await db.$transaction([
          db.propertyTemplate.update({
            where: { id: BigInt(propertyTemplate.id) },
            data: { ...propertyTemplate },
          }),
          ...properties.map(
            ({ datum: { id: datumId, ...datum }, ...property }) => {
              if (persisted(property)) {
                return db.property.update({
                  where: { id: BigInt(property.id) },
                  data: {
                    ...property,
                    datum: {
                      upsert: { update: { ...datum }, create: { ...datum } },
                    },
                  },
                })
              }

              return db.propertyTemplate.update({
                data: {
                  properties: {
                    create: {
                      ...property,
                      // Don't allow users to set the ID
                      id: undefined,
                      datum: {
                        connectOrCreate: {
                          where: { id: datumId },
                          create: { ...datum },
                        },
                      },
                    },
                  },
                },
                where: { id: propertyTemplate.id },
              })
            },
          ),
        ])

        return updatedPropertyTemplate
      }

      return await db.propertyTemplate.create({
        data: {
          ...propertyTemplate,
          // We don't want to allow users to set the ID
          id: undefined,
          properties: {
            connectOrCreate: properties.map(
              ({ datum: { id: datumId, ...datum }, id, ...property }) => ({
                where: { id: BigInt(id) },
                create: {
                  ...property,
                  datum: {
                    connectOrCreate: {
                      where: { id: datumId },
                      create: datum,
                    },
                  },
                },
              }),
            ),
          },
        },
      })
    }),
  propertyTemplates: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      let hostname = ""

      if (input.url.trim().length) {
        hostname = new URL(input.url).hostname
      }

      const propertyTemplates = await db.propertyTemplate.findMany({
        where: { hostnames: { has: hostname } },
        include: { properties: { include: { datum: true } } },
      })

      return propertyTemplates
    }),
  createPropertiesFromTemplate: publicProcedure
    .input(
      z.object({
        propertyTemplateId: bigint,
        itemId: z.number(),
        url: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const propertyTemplate = await db.propertyTemplate.findFirst({
        where: { id: input.propertyTemplateId },
        include: { properties: { include: { datum: true } } },
      })

      if (!propertyTemplate) {
        throw new Error(
          `Cannot find template with id ${input.propertyTemplateId}`,
        )
      }

      const properties = await Promise.all(
        propertyTemplate.properties.map(
          ({ id, datum: { id: datumId, ...datum }, ...property }) =>
            db.property.create({
              data: {
                datum: datum.global
                  ? { connect: { id: datumId } }
                  : {
                      create: {
                        ...datum,
                        indexerId: datum.indexerId ? datum.indexerId : null,
                        fileId: datum.fileId ? datum.fileId : null,
                        url: input.url,
                      },
                    },
                item: { connect: { id: input.itemId } },
                featured: property.featured,
                position: property.position,
              },
              include: {
                datum: { include: { image: true, indexer: true } },
              },
            }),
        ),
      )

      await findItemByIdAndClearCache(input.itemId)

      await Promise.all(
        properties.map((property) => reIndex(property, ctx.userId)),
      )

      return properties
    }),
  createOrUpdateIndexer: publicProcedure
    .input(z.unknown())
    .mutation(async ({ input }) => {
      const { id, ...data } = IndexerCreate.parse(input)

      const indexer = await db.indexer.upsert({
        where: { id: id },
        create: { ...data },
        update: { ...data },
      })

      return indexer
    }),
  findIndexer: publicProcedure
    .input(z.object({ hostname: z.string() }))
    .query(async ({ input }) => {
      const indexers = await db.indexer.findMany({
        where: { hostname: input.hostname },
      })

      return indexers
    }),
  deletePropertyFromTemplate: publicProcedure
    .input(z.string().or(z.bigint()))
    .mutation(async ({ input }) => {
      const datum = await db.datum.findFirst({
        where: { properties: { some: { id: BigInt(input) } } },
        select: { properties: { select: { id: true } }, id: true },
      })

      const deleted = await db.$transaction([
        db.property.delete({ where: { id: BigInt(input) } }),
        ...(datum && Number(datum?.properties?.length) === 1
          ? [db.datum.delete({ where: { id: datum.id } })]
          : []),
      ])

      return deleted
    }),
  upsertItem: publicProcedure
    .input(UpdateItem)
    .mutation(async ({ input: { id, ...data } }) => {
      let { url: formattedUrl } = data

      if (!id || !persisted({ id })) {
        formattedUrl = encodeURIComponent(data.name.replaceAll(" ", "-"))

        if (await db.item.findFirst({ where: { url: formattedUrl } })) {
          formattedUrl += uuidv4()
        }
      } else {
        const existingItem = await db.item.findFirst({
          select: { url: true },
          where: { id },
        })

        if (!existingItem) {
          throw new Error(`Can't find the item with the id: ${id}`)
        }

        if (existingItem.url !== formattedUrl) {
          formattedUrl = encodeURIComponent(formattedUrl.replaceAll(" ", "-"))

          if (await db.item.findFirst({ where: { url: formattedUrl } })) {
            formattedUrl += uuidv4()
          }
        }
      }

      const item = await db.item.upsert({
        where: { id },
        create: {
          ...data,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          contentState: data.contentState || undefined,
          content: "",
          url: formattedUrl,
        },
        update: { ...data, url: formattedUrl },
      })

      await clearCacheForItemAndAncestors(item)

      return item
    }),
  getItems: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        query: z.string(),
      }),
    )
    .query(async ({ input: { cursor, query } }) => {
      const limit = 50

      const items = await db.item.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      })

      let nextCursor

      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }

      return {
        items,
        nextCursor,
      }
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter

async function reIndex(
  property: ChildItem["properties"][number],
  userId?: number | null,
) {
  if (property.datum.indexer && property.datum.url) {
    const browser = sample([...browsers.values()])

    if (!browser) {
      throw new Error("No Browsers available to perform index")
    }

    const job: Job = {
      url: property.datum.url,
      queue: "single",
      notify: userId ? [userId] : [],
      dataToIndex: await getData(property),
    }

    browser.send(JSON.stringify(job))
  }
}
