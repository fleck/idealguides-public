import db, { Cache } from "db"
import { HomePageItems } from "./getHomePageItems"
import { RecursiveChildren } from "./getItemByUrl"

export async function getFromCache(url?: string) {
  return (await db.cache.findFirst({
    where: { key: url },
  })) as (Omit<Cache, "value"> & { value: RecursiveChildren | HomePageItems }) | null
}
