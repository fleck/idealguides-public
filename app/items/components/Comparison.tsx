/* eslint-disable @next/next/no-img-element */
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/outline"
import { Align } from "@prisma/client"
import EditButton from "app/core/components/EditButton"
import { urlFor } from "app/file/url"
import { newProperty } from "app/properties/models/newProperty"
import ct from "class-types.macro"
import Link from "next/link"
import React, { lazy, Suspense, useState } from "react"
import type { ChildItem } from "../queries/getRootItem"
import { createNewColumn } from "./AddColumn"
import { PropertyValue } from "./PropertyValue"
import { validHeightAndWidth } from "./validHeightAndWidth"
import { File } from "db"
import { persisted } from "./persisted"
import calculate from "app/properties/models/calculate"
import { linkStyles } from "./linkStyles"

const AddColumn = lazy(() => import("./AddColumn"))
const EditComparisonHeader = lazy(() => import("./ColumnHeaderEditor"))
const EditItemInCell = lazy(() => import("./EditItemInCell"))
const EditProperty = lazy(() => import("./EditProperty"))

type Props = {
  item: ChildItem
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  editing: boolean
}

export const Comparison = ({ item, editing, setItem }: Props) => {
  const [artificialColumn] = useState(
    createNewColumn({
      itemId: item.id,
      align: item.comparisonColumns[0]?.align || Align.LEFT,
      subject: true,
    }),
  )

  const [sort, setSort] = useState<{
    columnName: string
    direction: "ASC" | "DESC"
  }>({
    columnName: "",
    direction: "ASC",
  })

  if (!editing && (!item.comparisonColumns.length || !item.children.length))
    return null

  const comparisonColumnsWithSubject = item.comparisonColumns.some(
    (column) => column.subject,
  )
    ? item.comparisonColumns
    : [artificialColumn, ...item.comparisonColumns]

  const sortedChildren = !sort.columnName
    ? item.children
    : item.children.concat().sort((a, b) => {
        const firstRawProperty = a.item.properties.find(
          (p) => p.datum.name === sort.columnName,
        )

        const firstPropertyValue = Number(
          firstRawProperty?.datum.dynamic
            ? calculate(firstRawProperty.datum.text, a.item)
            : firstRawProperty?.datum.text,
        )

        const secondRawProperty = b.item.properties.find(
          (p) => p.datum.name === sort.columnName,
        )

        const secondPropertyValue = Number(
          secondRawProperty?.datum.dynamic
            ? calculate(secondRawProperty.datum.text, b.item)
            : secondRawProperty?.datum.text,
        )

        if (
          Number.isNaN(firstPropertyValue) &&
          Number.isNaN(secondPropertyValue)
        )
          return 0

        if (isNaN(firstPropertyValue)) return 1

        if (isNaN(secondPropertyValue)) return -1

        if (sort.direction === "ASC")
          return firstPropertyValue - secondPropertyValue

        if (sort.direction === "DESC")
          return secondPropertyValue - firstPropertyValue

        return 0
      })

  return (
    <table>
      <thead>
        <tr>
          {editing && (
            <th>
              <Suspense fallback={null}>
                <AddColumn setItem={setItem} item={item} />
              </Suspense>
            </th>
          )}
          {comparisonColumnsWithSubject.map((comparisonColumn) => (
            <th
              key={comparisonColumn.id.toString()}
              className={ct(
                classFor(comparisonColumn.align),
                "sticky",
                "top-0",
                "bg-gray-50",
              )}
            >
              {editing && (
                <Suspense fallback={null}>
                  <EditComparisonHeader
                    comparisonColumn={comparisonColumn}
                    item={item}
                    setItem={setItem}
                  />
                </Suspense>
              )}
              <button
                onClick={() => {
                  setSort({
                    columnName: comparisonColumn.name,
                    direction: sort.direction === "ASC" ? "DESC" : "ASC",
                  })
                }}
              >
                {comparisonColumn.name}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedChildren.map((child) => (
          <tr key={child.id} className={ct("odd:bg-white", "even:bg-gray-50")}>
            {editing && <th />}
            {comparisonColumnsWithSubject.map((comparisonColumn) => (
              <td
                key={comparisonColumn.id.toString()}
                className={ct(classFor(comparisonColumn.align))}
              >
                <Cell
                  editingItem={editing}
                  setParentItem={setItem}
                  comparisonColumn={comparisonColumn}
                  child={child}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type CellProps = {
  child: Exclude<ChildItem["children"], undefined>[number]
  comparisonColumn: ChildItem["comparisonColumns"][number]
  editingItem: boolean
  setParentItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

const Cell = ({
  child,
  comparisonColumn,
  editingItem,
  setParentItem,
}: CellProps) => {
  const [item, setItem] = useState(child.item)

  const property = item.properties.find(
    (pr) => pr.datum.name === comparisonColumn.name,
  )

  const [editMode, setEditMode] = useState(
    comparisonColumn.subject && !persisted(item),
  )

  if (comparisonColumn.subject) {
    if (editMode) {
      return (
        <Suspense fallback={null}>
          <EditItemInCell
            item={item}
            setItem={setItem}
            child={child}
            setParentItem={setParentItem}
            setEditMode={setEditMode}
          />
        </Suspense>
      )
    }

    if (item.standalone) {
      return (
        <Link href={{ pathname: "/[itemUrl]", query: { itemUrl: item.url } }}>
          <a className={linkStyles}>{item.name}</a>
        </Link>
      )
    }

    return <>{item.name}</>
  }

  if (property) {
    const { dynamic, image } = property.datum

    if (editMode) {
      return (
        <Suspense fallback={null}>
          <EditButton
            color="gray"
            onClick={() => setEditMode(false)}
            className={ct("h-[1.625rem]")}
            aria-label={`Edit Property ${property.datum.name}`}
          >
            <PencilIcon className={ct("h-4", "w-4")} />
          </EditButton>
          <EditProperty
            property={property}
            item={item}
            setItem={setItem}
            dynamic={dynamic}
            properties={item.properties}
          />
        </Suspense>
      )
    }

    if (image && validHeightAndWidth(image)) {
      if (item.standalone) {
        return (
          <Link
            href={{
              pathname: "/[itemUrl]",
              query: { itemUrl: item.url },
            }}
          >
            <a>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                align={comparisonColumn.align}
                image={image}
                property={property}
              />
            </a>
          </Link>
        )
      } else {
        return (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image
            align={comparisonColumn.align}
            image={image}
            property={property}
          />
        )
      }
    }

    return (
      <span
        onClick={(event) => {
          if (editingItem) {
            event.preventDefault()
            setEditMode(true)
          }
        }}
        role={editingItem ? "button" : undefined}
      >
        <PropertyValue datum={property.datum} item={item} />
      </span>
    )
  }

  return (
    <>
      {editingItem && (
        <Suspense fallback={null}>
          <div className={ct("col-span-4", "block", "px-2", "pt-3")}>
            <EditButton
              className={ct("mx-auto", "my-2")}
              onClick={() => {
                setItem((prevItem) => {
                  const propertyToAdd = newProperty()

                  return {
                    ...prevItem,
                    properties: [
                      ...prevItem.properties,
                      {
                        ...propertyToAdd,
                        datum: {
                          ...propertyToAdd.datum,
                          name: comparisonColumn.name,
                        },
                      },
                    ],
                  }
                })

                setEditMode(true)
              }}
              color="amber"
            >
              <PlusCircleIcon className={ct("h-4", "w-4")} />
            </EditButton>
          </div>
        </Suspense>
      )}
    </>
  )
}

type ImageProps = {
  image: File & {
    metadata: {
      width: number
      height: number
    }
  }
  property: ChildItem["properties"][number]
  align: Align
}

function classFor(align: Align) {
  let alignment: ClassTypes = "text-left"

  if (align === "CENTER") {
    alignment = "text-center"
  } else if (align === "RIGHT") {
    alignment = "text-right"
  }

  return alignment
}

function Image({ image, property, align }: ImageProps) {
  const maxHeight = 96

  const width = (image.metadata.width / image.metadata.height) * maxHeight

  let alignment: ClassTypes = ""

  if (align === "CENTER") {
    alignment = "mx-auto"
  } else if (align === "RIGHT") {
    alignment = "ml-auto"
  }

  return (
    <picture>
      <source type="image/avif" srcSet={urlFor(image, "searchResultAvif")} />
      <source type="image/webp" srcSet={urlFor(image, "searchResultWebp")} />
      <img
        alt={image.description}
        src={urlFor(image, "searchResult")}
        width={width}
        height={maxHeight}
        className={ct("rounded-md", alignment)}
        aria-labelledby={property.id.toString() + "-name"}
        loading="lazy"
      />
    </picture>
  )
}
