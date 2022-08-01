import { RootItem } from "../queries/getItemByUrl"

export const bare = ({ children, properties, comparisonColumns, ...item }: RootItem) => ({
  ...item,
})

export type BareItem = ReturnType<typeof bare>
