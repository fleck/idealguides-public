import { useMutation } from "@blitzjs/rpc"
import RichTextEditor from "app/core/components/RichTextEditor"
import React from "react"
import { useProseMirror } from "use-prosemirror"
import type { RootItem } from "../queries/getItemByUrl"
import { Node } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"

import { proseMirrorOptions } from "../model/proseMirrorOptions"
import { isNewRecord } from "../../core/model/isNewRecord"
import updateChild from "app/children/mutations/updateChild"
import createChild from "app/children/mutations/createChild"
import upsertItem from "../mutations/upsertItem"
import { BareItem, bare } from "../model/bare"

const withoutItem = ({ item, ...child }: Exclude<RootItem["children"], undefined>[number]) => ({
  ...child,
})

export type OnSave = { onSave?: (item: BareItem) => void }

export default function Editor({
  item,
  setItem,
  setItemInitialState,
  dirty,
  setParentItem,
  child,
  parentItem,
  onSave,
}: {
  item: RootItem
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
  setItemInitialState: React.Dispatch<React.SetStateAction<BareItem>>
  dirty: boolean
  child?: Exclude<RootItem["children"], undefined>[number]
  setParentItem?: React.Dispatch<React.SetStateAction<RootItem>>
  parentItem?: RootItem
} & OnSave) {
  const [upsertItemMutation] = useMutation(upsertItem)

  const [updateChildMutation] = useMutation(updateChild)
  const [createChildMutation] = useMutation(createChild)

  const [contentState, setState] = useProseMirror({
    ...proseMirrorOptions,
    doc: Node.fromJSON(
      schema,
      (item.contentState || { type: "doc", content: [{ type: "paragraph" }] }) as {
        type: string
        content: {
          type: string
          content: {
            text: string
            type: string
          }[]
        }[]
      },
    ),
  })

  return (
    <RichTextEditor
      state={contentState}
      setState={(editorState) => {
        setState(editorState)

        setItem((prevItem) => ({ ...prevItem, contentState: editorState.doc.toJSON() }))
      }}
      onSave={async () => {
        try {
          let updatedItem: BareItem

          updatedItem = await upsertItemMutation(bare(item))

          setItem((prevItem) => ({ ...prevItem, ...updatedItem }))

          setItemInitialState((prevItem) => ({ ...prevItem, ...updatedItem }))

          onSave?.(updatedItem)

          if (!child) return

          let updatedChild: ReturnType<typeof withoutItem>

          if (isNewRecord(child)) {
            updatedChild = await createChildMutation({ ...child, item_id: updatedItem.id })
          } else {
            updatedChild = await updateChildMutation(child)
          }

          setParentItem?.((prevItem) => ({
            ...prevItem,
            children: prevItem.children?.map((prevChild) =>
              prevChild.id === child.id
                ? { ...prevChild, ...updatedChild, item: { ...prevChild.item, ...updatedItem } }
                : prevChild,
            ),
          }))
        } catch (error) {
          console.error(error)
        }
      }}
      {...{ dirty, setItem, item, setParentItem, child, parentItem }}
    />
  )
}
