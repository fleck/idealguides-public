import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"
import React from "react"
import { PlusCircleIcon } from "@heroicons/react/solid"
import { RootItem } from "../queries/getItemByUrl"
import { newProperty } from "../../properties/models/newProperty"

type Props = {
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
  propertyTemplate?: RootItem["properties"][number]
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export default function AddNewProperty({
  setItem,
  propertyTemplate = newProperty,
  ...props
}: Props) {
  return (
    <div className={ct("col-span-4", "block", "px-2", "pt-3")}>
      <EditButton
        {...props}
        className={ct("mx-auto", "my-2")}
        onClick={() =>
          setItem((prevItem) => ({
            ...prevItem,
            properties: [...prevItem.properties, propertyTemplate],
          }))
        }
        color="amber"
      >
        <PlusCircleIcon className={ct("h-4", "w-4")} />
      </EditButton>
    </div>
  )
}
