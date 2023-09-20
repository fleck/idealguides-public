import { Align } from "@prisma/client"
import { bigint } from "app/propertyTemplates/bigint"
import * as z from "zod"

export const comparisonColumnSchema = z.object({
  id: bigint,
  itemId: z.coerce.number(),
  name: z.string(),
  position: z.number().nullable().optional(),
  subject: z.coerce.boolean(),
  align: z.enum(Object.keys(Align) as [Align]),
})
