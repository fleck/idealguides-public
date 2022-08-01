import { Routes } from "@blitzjs/next"
import Link from "next/link"
import React, { lazy, Suspense, useState } from "react"
import type { RootItem } from "../queries/getItemByUrl"

import { PropertyValue } from "./Properties"

const AddColumn = lazy(() => import("./AddColumn"))

const EditComparisonHeader = lazy(() => import("./ColumnHeaderEditor"))

const AddNewProperty = lazy(() => import("./AddNewProperty"))

type Props = {
  item: RootItem
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
  editing: boolean
}

export const Comparison = ({ item, editing, setItem }: Props) => {
  if (!editing && (!item.comparisonColumns.length || !item.children?.length)) return null

  return (
    <table>
      <thead>
        <tr>
          {editing && (
            <th>
              <Suspense fallback={null}>
                <AddColumn {...{ setItem, item }} />
              </Suspense>
            </th>
          )}

          {item.comparisonColumns.map((comparisonColumn) => (
            <th key={comparisonColumn.id.toString()}>
              {editing && (
                <Suspense fallback={null}>
                  <EditComparisonHeader {...{ comparisonColumn, item, setItem }} />
                </Suspense>
              )}
              {comparisonColumn.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {item.children?.map((child) => (
          <tr key={child.id}>
            {editing && <th />}
            {item.comparisonColumns.map((comparisonColumn) => (
              <td key={comparisonColumn.id.toString()}>
                <Column {...{ comparisonColumn, child, editingItem: editing }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type ColumnProps = {
  child: Exclude<RootItem["children"], undefined>[number]
  comparisonColumn: RootItem["comparisonColumns"][number]
  editingItem: boolean
}

const Column = ({ child, comparisonColumn, editingItem }: ColumnProps) => {
  const [item, setItem] = useState(child.item)

  if (comparisonColumn.subject) {
    if (item.standalone) {
      return <Link href={Routes.ShowItemPage({ itemUrl: item.url })}>{item.name}</Link>
    }
    return <>{item.name}</>
  }

  const property = item.properties.find((pr) => pr.datum.name === comparisonColumn.name)

  if (property) {
    return <PropertyValue {...{ item, ...property.datum }} />
  } else {
    return (
      <>
        {editingItem && (
          <Suspense fallback={null}>
            <AddNewProperty {...{ setItem }} />
          </Suspense>
        )}
      </>
    )
  }
}
