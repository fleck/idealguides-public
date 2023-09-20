import db from "db"
import Busboy from "@fastify/busboy"
import path from "path"
import { disk, driver } from "app/file/disk"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"
import crypto from "crypto"
import { getSession } from "@blitzjs/auth"
import { NextApiRequest, NextApiResponse } from "next"

export const localPath = (key: string) =>
  path.join(path.join(key.substring(0, 2), key.substring(2, 4)), key)

const hashIt = (file: NodeJS.ReadableStream) => {
  const createHash = crypto.createHash("sha1").setEncoding("hex")
  file.pipe(createHash)

  return new Promise<string>((resolve) => {
    file.on("end", function () {
      createHash.end()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      resolve(createHash.read())
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession(req, res)

  if (!session.$isAuthorized()) {
    res.writeHead(401, { Connection: "close" })
    res.end("Must be logged in to upload a file")
    return Promise.resolve()
  }

  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    res.writeHead(406, { Connection: "close" })
    res.end("must be multipart/form-data")
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    if (!req.headers["content-type"])
      throw new Error("content-type header is missing")

    const busboy = new Busboy({
      headers: { ...req.headers, "content-type": req.headers["content-type"] },
    })

    const key = uuidv4()

    busboy.on(
      "file",
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (_fieldName, file, filename, _encoding, mimetype) => {
        /**
         * Once blitz has a standard interface for jobs we should allow processing
         * to happen in the background.
         * if (backgroundJobsAvailable) {
         *    jobs.queue(processInBackground)
         * }
         */
        const imageProcessor = sharp()

        file.pipe(imageProcessor)

        const [hash, metadata] = await Promise.all([
          hashIt(file),
          imageProcessor.metadata(),
        ])

        const existingFile = await db.file.findFirst({ where: { hash } })

        if (existingFile) {
          res.json(existingFile)

          resolve()
        } else {
          if (!metadata.size) {
            throw new Error("File is empty")
          }

          await disk.put(localPath(key), imageProcessor)

          const file = await db.file.create({
            data: {
              key,
              hash,
              name: filename,
              contentType: mimetype,
              serviceName: driver,
              byteSize: metadata.size,
              metadata: {
                ...metadata,
                // Remove non serializable data
                exif: undefined,
                icc: undefined,
                iptc: undefined,
                xmp: undefined,
                tifftagPhotoshop: undefined,
              },
            },
          })

          res.json(file)

          resolve()
        }
      },
    )

    req.pipe(busboy)
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
