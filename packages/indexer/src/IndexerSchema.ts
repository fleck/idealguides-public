import type { IndexerType } from "../../../db"
import * as z from "zod"

/**
 * The literal and type IndexerType is used in the main repo and this package.
 * But, including the literal in both projects is a bit of a pain. So we are
 * duplicating the literal here, but checking that it matches.
 */
const IndexerLiteral = {
  CSS: "CSS",
  XPATH: "XPATH",
  JSON: "JSON",
  TEXT: "TEXT",
} as const

// eslint-disable-next-line @typescript-eslint/no-empty-function
;(function checkIfIndexerTypesMatch(_: typeof IndexerType) {})(IndexerLiteral)

export const selectorsSchema = z.array(z.object({ selector: z.string() }))

export const replacementsSchema = z.array(
  z.object({ search: z.string(), replacement: z.string().optional() }),
)

export const IndexerCreate = z.object({
  id: z.coerce.number(),
  name: z.string(),
  hostname: z.string(),
  pathExtension: z.string().optional(),
  decimalPlaces: z.coerce.number().nullable().optional(),
  selector: z.string().optional(),
  cookie: z.string().optional(),
  indexType: z.enum(Object.keys(IndexerLiteral) as [IndexerType]),
  apiId: z.coerce
    .number()
    .optional()
    .transform((value) => (Number(value) > 0 ? value : undefined)),
  nextIndexerId: z.coerce
    .number()
    .optional()
    .transform((value) => (Number(value) > 0 ? value : null)),
  selectorToClick: z.string().optional(),
  decodeUrl: z.boolean().optional(),
  keepOldValue: z.coerce.boolean().optional(),
  secondsBetweenUpdates: z.coerce.number().optional(),
  selectors: selectorsSchema.optional(),
  replacements: replacementsSchema.optional(),
  slice: z.string().optional(),
})
