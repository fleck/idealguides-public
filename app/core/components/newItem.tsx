import { RootItem } from "app/items/queries/getItemByUrl"

export const newItem: RootItem = {
  id: 0,
  name: "",
  url: "",
  content: "",
  contentState: { type: "doc", content: [{ type: "paragraph" }] },
  generic_name: "",
  type: "PAGE",
  standalone: true,
  domain_id: 1,
  properties: [],
  created_at: null,
  updated_at: null,
  comparisonColumns: [],
}
