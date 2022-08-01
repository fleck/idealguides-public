import { resolver } from "@blitzjs/rpc"
import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"

import db from "db"

import { CreateDatum } from "./Datum"

export default resolver.pipe(resolver.zod(CreateDatum), resolver.authorize(), async (input) => {
  const { itemId, featured, position, digitsAfterDecimal, fileId, indexerId, ...otherInputs } =
    input

  const datum = await db.property.create({
    data: {
      datum: {
        create: {
          ...otherInputs,
          digitsAfterDecimal: digitsAfterDecimal ? Number(digitsAfterDecimal) : null,
          indexerId: indexerId ? Number(indexerId) : null,
          fileId: fileId ? Number(fileId) : null,
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
})
