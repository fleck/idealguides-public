import { disk } from "app/file/disk"
import db from "db"
import createContentDisposition from "content-disposition"
import path from "path"
import { localPath } from "pages/api/files/create"
import {
  validTransformKey,
  transformFunctions,
  Transform,
} from "../../../../../../app/file/transforms"
import crypto from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { FileNotFound } from "@slynova/flydrive"

export const variantPath = (key: string, variation: Transform) =>
  path.join(
    "variant",
    key.substring(0, 2),
    key.substring(2, 4),
    // Use the functions source as a key for the transform then it'll update if the implementation changes
    crypto
      .createHash("sha1")
      .update(
        /**
         * Use cast to ensure that our transform is a function. Introduced a bug
         * where we were calling .toString on an object, resulting in `[object Object]`
         * being the key for all variants!
         */
        (
          transformFunctions[variation].transform as (
            file: NodeJS.ReadableStream,
          ) => unknown
        ).toString(),
      )
      .digest("hex"),
  )

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { key, contentDisposition, variation } = req.query

  if (!key || key instanceof Array) {
    throw new Error("Not found")
  }

  if (typeof variation !== "string" || !validTransformKey(variation)) {
    throw new Error("Not found")
  }

  const file = await db.file.findFirst({ where: { key } })

  if (!file) throw new Error("Not found")

  const path = variantPath(file.key, variation)

  const statsPromise = disk.getStat(path).catch((error) => {
    if (error instanceof FileNotFound) {
      return
    }

    console.error(error)
  })

  const existingVariant = disk.getStream(path)

  const transform = transformFunctions[variation]

  if ("contentType" in transform) {
    res.setHeader("Content-Type", transform.contentType)
  } else if (file.contentType) {
    res.setHeader("content-type", file.contentType)
  }

  res.setHeader(
    "content-disposition",
    createContentDisposition(file.name, {
      type: contentDisposition === "attachment" ? "attachment" : "inline",
    }),
  )

  res.setHeader("Cache-Control", "public, max-age=31536000, immutable")

  const stats = await statsPromise

  if (stats) res.setHeader("Content-Length", stats.size)

  existingVariant
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .on("error", async function createVariant() {
      const originalFile = disk.getStream(localPath(file.key))

      const { data, info } = await transform
        .transform(originalFile)
        .toBuffer({ resolveWithObject: true })

      res.setHeader("Content-Length", info.size)

      res.send(data)

      await disk.put(path, data)

      originalFile.on("error", function noVariantOrOriginalFileIsFound() {
        res.statusCode = 404

        res.send("No file found")
      })
    })
    .pipe(res)
}
