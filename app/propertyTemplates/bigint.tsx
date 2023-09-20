import { z } from "zod"

export const bigint = z
  .any()
  .transform((value: unknown) => {
    if (typeof value === "bigint") return value

    if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      typeof value === "number"
    ) {
      return BigInt(value)
    }
  })
  .pipe(z.bigint())
