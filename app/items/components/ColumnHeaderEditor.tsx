import { useMutation } from "@blitzjs/rpc"
import React, { useState } from "react"
import ct from "class-types.macro"
import upsertComparisonColumn from "app/comparisonColumns/mutations/upsertComparisonColumn"
import { comparisonColumnSchema } from "app/comparisonColumns/schema"

import capitalize from "lodash/capitalize"
import { Align, ComparisonColumn } from "@prisma/client"

import { ChildItem } from "../queries/getRootItem"

import * as z from "zod"
import EditButton from "app/core/components/EditButton"
import {
  PencilIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid"
import Button from "app/core/components/Button"
import deleteComparisonColumn from "app/comparisonColumns/mutations/deleteComparisonColumn"
import updateOrder from "app/comparisonColumns/mutations/updateOrder"
import { UseMutationFunction } from "../TypeUtilities"
import { Form } from "app/core/components/TypedForm"
import { persisted } from "./persisted"

export type Props = {
  item: ChildItem
  comparisonColumn: ChildItem["comparisonColumns"][number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

export default function EditComparisonHeader({
  comparisonColumn,
  item,
  setItem,
}: Props) {
  const [editingColumn, setEditingColumn] = useState(
    BigInt(comparisonColumn.id) < 0 && !comparisonColumn.subject,
  )

  const [upsertColumnMutation] = useMutation(upsertComparisonColumn)

  const [deleteColumnMutation] = useMutation(deleteComparisonColumn)

  const [updateOrderMutation, { error: orderError }] = useMutation(updateOrder)

  if (!editingColumn) {
    return (
      <>
        <EditButton
          className={ct("mx-auto", "my-2")}
          onClick={() => setEditingColumn((prevEditing) => !prevEditing)}
          color="amber"
          title="Add new column"
          aria-label="Add new column"
        >
          <PencilIcon className={ct("h-4", "w-4")} />
        </EditButton>
      </>
    )
  }

  return (
    <>
      <EditButton
        className={ct("mx-auto", "my-2")}
        onClick={() => setEditingColumn((prevEditing) => !prevEditing)}
        color="gray"
        title="Cancel Edit"
        aria-label="Cancel Edit"
      >
        <PencilIcon className={ct("h-4", "w-4")} />
      </EditButton>

      {item.comparisonColumns[0] !== comparisonColumn && (
        <button
          className={ct(
            "inline-block",
            "w-[1.125rem]",
            "cursor-pointer",
            "border-none",
            "py-0.5",
          )}
          onClick={() =>
            moveColumn({
              item,
              comparisonColumn,
              setItem,
              position: -1,
              updateOrderMutation,
            })
          }
        >
          <ArrowLeftIcon />
        </button>
      )}

      {item.comparisonColumns.at(-1) !== comparisonColumn && (
        <button
          className={ct(
            "inline-block",
            "w-[1.125rem]",
            "cursor-pointer",
            "border-none",
            "py-0.5",
          )}
          onClick={() =>
            moveColumn({
              item,
              comparisonColumn,
              setItem,
              position: 1,
              updateOrderMutation,
            })
          }
        >
          <ArrowRightIcon />
        </button>
      )}

      {orderError instanceof Error && <div>{orderError.message}</div>}

      <Form<z.output<typeof comparisonColumnSchema>>
        onSubmit={(event) => {
          event.preventDefault()

          const formData = new FormData(event.currentTarget)

          // We need to remove any files from the form data
          // because they are not supported by URLSearchParams
          const entries = [...formData.entries()].flatMap(([key, value]) =>
            value instanceof File ? [] : [[key, value]],
          )

          import("qs")
            .then(async ({ parse }) => {
              const parsed = parse(new URLSearchParams(entries).toString())

              const result = comparisonColumnSchema.safeParse(parsed)

              if (result.success) {
                const latestColumn = await upsertColumnMutation({
                  ...result.data,
                  itemId: item.id,
                })

                updateComparisonColumn({
                  setItem,
                  comparisonColumn,
                  values: latestColumn,
                })
              } else {
                console.log(result.error)
              }
            })
            .catch(console.error)
        }}
        onChange={(event) => {
          const formData = new FormData(event.currentTarget)

          // We need to remove any files from the form data
          // because they are not supported by URLSearchParams
          const entries = [...formData.entries()].flatMap(([key, value]) =>
            value instanceof File ? [] : [[key, value]],
          )

          import("qs")
            .then(({ parse }) => {
              const parsed = parse(new URLSearchParams(entries).toString())

              const result = comparisonColumnSchema.safeParse(parsed)

              if (result.success) {
                console.log(result.data)
                updateComparisonColumn({
                  setItem,
                  comparisonColumn,
                  values: result.data,
                })
              }
            })
            .catch(console.error)
        }}
      >
        {({ SelectInput, DownshiftInput, Checkbox, Input }) => (
          <>
            <Input
              type="hidden"
              name="id"
              defaultValue={comparisonColumn.id.toString()}
            />
            <Input
              type="hidden"
              name="itemId"
              defaultValue={comparisonColumn.itemId}
            />
            <SelectInput
              defaultValue={comparisonColumn.align}
              className={ct(
                "inline-block",
                "rounded-md",
                "border-gray-300",
                "py-0.5",
                "pr-10",
                "pl-1",
                "text-base",
                "focus:border-indigo-500",
                "focus:outline-none",
                "focus:ring-indigo-500",
                "sm:text-sm",
              )}
              label="align"
              name="align"
            >
              {Object.keys(Align).map((itemType) => (
                <option value={itemType} key={itemType}>
                  {capitalize(itemType)}
                </option>
              ))}
            </SelectInput>

            <DownshiftInput
              items={[
                ...new Set(
                  item.children
                    ?.flatMap((child) => child.item.properties)
                    .map((property) => property.datum.name),
                ),
              ]}
              label="name"
              name="name"
              initialInputValue={comparisonColumn.name}
            />

            <Checkbox
              name="subject"
              label="subject"
              defaultChecked={comparisonColumn.subject}
            />

            <Button color="lime">
              {persisted(comparisonColumn) ? "Update Column" : "Create Column"}
            </Button>
          </>
        )}
      </Form>

      <Button
        onClick={() => {
          setItem((prevItem) => ({
            ...prevItem,
            comparisonColumns: [
              ...prevItem.comparisonColumns.filter(
                (comparisonColumnSibling) =>
                  comparisonColumnSibling.id !== comparisonColumn.id,
              ),
            ],
          }))

          if (persisted(comparisonColumn)) {
            deleteColumnMutation(comparisonColumn).catch(console.error)
          }
        }}
        type="submit"
        color="red"
      >
        Delete
      </Button>
    </>
  )
}

function moveColumn({
  item,
  comparisonColumn,
  setItem,
  position,
  updateOrderMutation,
}: Props & {
  position: -1 | 1
  updateOrderMutation: UseMutationFunction<typeof updateOrder>
}) {
  const { comparisonColumns } = item

  const currentIndexOfColumn = comparisonColumns.indexOf(comparisonColumn)

  const columnsInNewOrder = comparisonColumns.filter(
    (column) => column.id !== comparisonColumn.id,
  )

  columnsInNewOrder.splice(currentIndexOfColumn + position, 0, comparisonColumn)

  const columnsWithNewPosition = columnsInNewOrder.map((column, index) => ({
    ...column,
    position: index,
    itemId: item.id,
  }))

  setItem((item) => ({ ...item, comparisonColumns: columnsWithNewPosition }))

  updateOrderMutation(columnsWithNewPosition).catch(console.error)
}

function updateComparisonColumn({
  setItem,
  comparisonColumn,
  values: { id, ...values },
}: {
  values: ComparisonColumn | z.infer<typeof comparisonColumnSchema>
  comparisonColumn: ChildItem["comparisonColumns"][number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}) {
  setItem((prevItem) => ({
    ...prevItem,
    comparisonColumns: [
      ...prevItem.comparisonColumns.map((comparisonColumnSibling) =>
        comparisonColumnSibling.id === comparisonColumn.id
          ? {
              ...comparisonColumnSibling,
              ...values,
              id: id ? BigInt(id) : comparisonColumnSibling.id,
            }
          : comparisonColumnSibling,
      ),
    ],
  }))
}
