import { RootItem } from "../../items/queries/getItemByUrl"

export const group = (props: RootItem["properties"]) => {
  const properties = new Map<string, RootItem["properties"]>()

  for (const property of props) {
    const existingGroup = properties.get(property.datum.group)

    properties.set(property.datum.group, [...(existingGroup || []), property])
  }

  return [...properties]
}

export type PropertiesInGroups = ReturnType<typeof group>
