import React from "react"
import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"
import { PlusCircleIcon } from "@heroicons/react/solid"
import type { RootItem } from "../queries/getItemByUrl"

type Props = {
  item: RootItem
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
}

export default function AddColumn({ setItem, item }: Props) {
  return (
    <EditButton
      className={ct("mx-auto", "my-2")}
      onClick={() =>
        setItem((prevItem) => ({
          ...prevItem,
          comparisonColumns: [
            ...prevItem.comparisonColumns,
            {
              id: BigInt(0),
              itemId: item.id,
              name: "",
              position: null,
              created_at: new Date(),
              updated_at: new Date(),
              subject: false,
              align: "LEFT",
            },
          ],
        }))
      }
      color="amber"
      title="Add new column"
      aria-label="Add new column"
    >
      <PlusCircleIcon className={ct("h-4", "w-4")} />
    </EditButton>
  )
}
