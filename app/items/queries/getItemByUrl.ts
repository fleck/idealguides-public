import db from "db"

import type { Item, Child, Prisma } from "db"
import { getFromCache } from "./getFromCache"
import { DeepReadonly } from "./TypeUtilities"

const nested = (level: number): Prisma.ItemArgs => ({
  include: {
    children: {
      orderBy: { position: "asc" },
      include: { item: level - 1 ? nested(level - 1) : true },
    },
    properties: { include: { datum: true } },
    comparisonColumns: { orderBy: { position: "asc" } },
  },
})

const rootItem = async (url: string) =>
  db.item.findFirst({
    where: { url },
    include: {
      ...nested(5).include,
      properties: {
        orderBy: { position: "asc" },
        include: { datum: { include: { image: true, indexer: true } } },
      },
      comparisonColumns: { orderBy: { position: "asc" } },
    },
  })

type BaseItem = NonNullable<Awaited<ReturnType<typeof rootItem>>>

export type RecursiveChildren =
  | BaseItem & {
      children?: (Child & {
        item: RecursiveChildren
      })[]
    }

export default async function getItemByUrl({ url }: Pick<Item, "url">) {
  let item: RecursiveChildren | null

  const cachedItem = await getFromCache(url)

  if (cachedItem?.value && "comparisonColumns" in cachedItem.value) {
    return cachedItem.value
  }

  item = await rootItem(url)

  if (item) {
    // item contains Date types which TypeScript/Prisma won't allow, but they successfully get serialized to strings.
    const itemToCache: Omit<
      typeof item,
      "created_at" | "properties" | "comparisonColumns" | "children" | "updated_at"
    > = item

    db.cache
      .create({
        data: {
          key: url,
          value: itemToCache,
        },
      })
      .catch(console.error)
  }

  return item as Unionize<DeepReadonly<typeof item>, Date | bigint, string>
}

export type RootItem = Unionize<
  DeepReadonly<NonNullable<Awaited<ReturnType<typeof getItemByUrl>>>>,
  Date | bigint,
  string
>

export type Unionize<T, Search, TypeToAdd> = T extends Search
  ? T extends Search
    ? T | TypeToAdd
    : T
  : {
      [P in keyof T]: Unionize<T[P], Search, TypeToAdd>
    }
