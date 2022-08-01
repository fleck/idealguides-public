import db from "db"
import { HomePageItems } from "../queries/getHomePageItems"
import { RecursiveChildren } from "../queries/getItemByUrl"

export const putItemInCache = ({
  value,
  url,
}: {
  value: HomePageItems | RecursiveChildren
  url: string
}) =>
  // @ts-expect-error item dates get property converted via implicit conversion, but TS doesn't like it.
  db.cache.create({ data: { key: url, value: value } }).catch((error) => {
    console.error(error)
  })
