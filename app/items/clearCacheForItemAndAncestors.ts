import db, { Item } from "db"
import { getFeaturedPageIds } from "./getFeaturedPageIds"
import { purgeCdnCache } from "../../pages/api/clearAllCache"
import { handleKnownErrors } from "./handleKnownErrors"

export const findItemByIdAndClearCache = async (itemId: number) => {
  const itemToClear = await db.item.findFirst({ where: { id: itemId } })

  if (!itemToClear) return

  await clearCacheForItemAndAncestors(itemToClear)
}
const clearHomePageCache = async () => {
  await db.cache.delete({ where: { key: "/" } }).catch(handleKnownErrors)
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

  await db.cache.delete({ where: { key: item.url } }).catch(handleKnownErrors)

  await purgeCdnCache({ where: { items: { some: { id: { in: [item.id] } } } } })

  const newlyClearedItemIds = [...alreadyClearedItemIds, item.id]

  const parents = await db.child.findMany({
    where: { item_id: item.id },
    include: { parent: true },
  })

  for (const { parent } of parents) {
    await clearCacheForItemAndAncestors(
      parent,
      newlyClearedItemIds,
      cachedFeaturedPageIds,
    )
  }
}
