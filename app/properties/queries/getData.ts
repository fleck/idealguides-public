import db from "db"
import type { RootItem } from "app/items/queries/getItemByUrl"

export const getData = (property: RootItem["properties"][number]) => {
  const data = db.datum.findMany({
    where: { url: property.datum.url },
    include: { indexer: { include: { nextIndexer: { include: { nextIndexer: true } } } } },
  })

  return data
}

export type DataToIndex = Awaited<ReturnType<typeof getData>>
