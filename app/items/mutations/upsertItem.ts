import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

import db, { Item, ItemType } from "db"
import { resolver } from "@blitzjs/rpc"

import * as z from "zod"
import { getFeaturedPageIds } from "../getFeaturedPageIds"
import { purgeCdnCache } from "pages/api/clearAllCache"
import { v4 as uuidv4 } from "uuid"

const UpdateItem = z.object({
  id: z.number().optional(),
  name: z.string(),
  contentState: z.any(),
  url: z.string(),
  type: z.enum(Object.keys(ItemType) as [ItemType]),
  standalone: z.boolean(),
})

export const findItemByIdAndClearCache = async (itemId: number) => {
  const itemToClear = await db.item.findFirst({ where: { id: itemId } })

  if (!itemToClear) return

  await clearCacheForItemAndAncestors(itemToClear)
}

const clearHomePageCache = async () => {
  await db.cache.delete({ where: { key: "/" } }).catch((error) => {
    // We expect the delete may fail in a known way (i.e. the key doesn't exist)
    if (error instanceof PrismaClientKnownRequestError) return

    throw error
  })
}

export const clearCacheForItemAndAncestors = async (
  item: Item,
  alreadyClearedItemIds: number[] = [],
  cachedFeaturedPageIds: number[] = [],
) => {
  if (alreadyClearedItemIds.includes(item.id)) return

  if (!cachedFeaturedPageIds.length) {
    cachedFeaturedPageIds = await getFeaturedPageIds()
  }

  if (cachedFeaturedPageIds.includes(item.id)) {
    await clearHomePageCache()
  }

  await db.cache.delete({ where: { key: item.url } }).catch((error) => {
    // We expect the delete may fail in a known way (i.e. the key doesn't exist)
    if (error instanceof PrismaClientKnownRequestError) return

    throw error
  })

  await purgeCdnCache({ where: { items: { some: { id: { in: [item.id] } } } } })

  const newlyClearedItemIds = [...alreadyClearedItemIds, item.id]

  const parents = await db.child.findMany({
    where: { item_id: item.id },
    include: { parent: true },
  })

  for (const { parent } of parents) {
    await clearCacheForItemAndAncestors(parent, newlyClearedItemIds, cachedFeaturedPageIds)
  }
}

export default resolver.pipe(
  resolver.zod(UpdateItem),
  resolver.authorize(),
  async ({ id, ...data }) => {
    let { url } = data

    if (!id) {
      url = encodeURIComponent(data.name.replaceAll(" ", "-"))

      if (await db.item.findFirst({ where: { url } })) {
        url += uuidv4()
      }
    }

    const item = await db.item.upsert({
      where: { id },
      create: { ...data, contentState: data.contentState || undefined, content: "", url },
      update: { ...data },
    })

    await clearCacheForItemAndAncestors(item)

    return item
  },
)
