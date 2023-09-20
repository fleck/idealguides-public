import { Indexer, IndexerType } from "@prisma/client"

import {
  IndexerCreate,
  replacementsSchema,
  selectorsSchema,
} from "../../packages/indexer/src/IndexerSchema"

import { useState } from "react"
import type { z } from "zod"
import { Form } from "app/core/components/TypedForm"
import { trpc } from "utils/trpc"
import ct from "class-types.macro"

type Props = {
  children: React.ReactNode
  indexer: Omit<Indexer, "replacements" | "selectors"> & {
    replacements: z.output<typeof replacementsSchema>
    selectors: z.output<typeof selectorsSchema>
  }
  potentialNextIndexers?: readonly Indexer[]
} & Omit<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >,
  "children"
>

const marginBetweenInputs = "mt-5"

export function IndexerForm({
  children,
  indexer: indexerProp,
  potentialNextIndexers = [],
  ...formProps
}: Props) {
  const [indexer, setIndexer] = useState(indexerProp)

  const { data: clientSidePotentialIndexers = [] } = trpc.findIndexer.useQuery({
    hostname: indexer.hostname,
  })

  const potentialIndexers = clientSidePotentialIndexers.length
    ? clientSidePotentialIndexers
    : potentialNextIndexers

  return (
    <Form<z.output<typeof IndexerCreate>> {...formProps}>
      {({ SelectInput, TextInput, Checkbox, Input }) => (
        <>
          <Input name="id" defaultValue={indexer.id} type="hidden" />
          <TextInput
            label="name"
            name="name"
            defaultValue={indexer.name}
            className={ct(marginBetweenInputs)}
          />
          <TextInput
            name="hostname"
            label="hostname"
            onChange={(event) => {
              setIndexer((indexer) => ({
                ...indexer,
                hostname: event.target.value,
              }))
            }}
            className={ct(marginBetweenInputs)}
            defaultValue={indexer.hostname}
          />
          <TextInput
            name="pathExtension"
            label="path extension"
            defaultValue={indexer.pathExtension}
            className={ct(marginBetweenInputs)}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              setIndexer((prevIndexer) => ({
                ...prevIndexer,
                replacements: [
                  ...prevIndexer.replacements,
                  { replacement: "", search: "" },
                ],
              }))
            }}
            type="button"
          >
            Add Replacement
          </button>
          {indexer.replacements.map((replacement, index) => (
            <>
              <TextInput
                label={`Search ${index}`}
                name={`replacements[${index}][search]`}
                key={index}
                defaultValue={replacement.search}
              />
              <TextInput
                label={`Replacement ${index}`}
                name={`replacements[${index}][replacement]`}
                key={index}
                defaultValue={replacement.replacement}
              />
              <button
                onClick={() =>
                  setIndexer((prevIndexer) => ({
                    ...prevIndexer,
                    replacements: [
                      ...prevIndexer.replacements.slice(0, index),
                      ...prevIndexer.replacements.slice(index + 1),
                    ],
                  }))
                }
                style={{ cursor: "pointer" }}
                type="button"
              >
                ❌
              </button>
            </>
          ))}
          <TextInput
            name="decimalPlaces"
            label="decimal places"
            defaultValue={indexer.decimalPlaces || ""}
            className={ct(marginBetweenInputs)}
          />
          <TextInput
            name="slice"
            label="slice"
            defaultValue={indexer.slice}
            className={ct(marginBetweenInputs)}
          />

          <button
            onClick={(e) => {
              e.preventDefault()
              setIndexer((prevIndexer) => ({
                ...prevIndexer,
                replacements: [
                  ...prevIndexer.replacements,
                  { replacement: "", search: "" },
                ],
              }))
            }}
            type="button"
          >
            Add Selector
          </button>
          {indexer.selectors.map(({ selector }, index) => (
            <>
              <TextInput
                label={`Selector ${index}`}
                name={`selectors[${index}][selector]`}
                key={index}
                defaultValue={selector}
              />

              <button
                onClick={() =>
                  setIndexer((prevIndexer) => ({
                    ...prevIndexer,
                    selectors: [
                      ...prevIndexer.selectors.slice(0, index),
                      ...prevIndexer.selectors.slice(index + 1),
                    ],
                  }))
                }
                style={{ cursor: "pointer" }}
                type="button"
              >
                ❌
              </button>
            </>
          ))}

          <TextInput
            name="cookie"
            label="cookie"
            defaultValue={indexer.cookie}
            className={ct(marginBetweenInputs)}
          />

          <SelectInput
            name="indexType"
            label="index type"
            defaultValue={indexer.indexType}
            className={ct(marginBetweenInputs)}
          >
            {Object.keys(IndexerType).map((itemType) => (
              <option value={itemType} key={itemType}>
                {itemType}
              </option>
            ))}
          </SelectInput>

          <SelectInput
            name="nextIndexerId"
            label="next indexer"
            defaultValue={indexer.nextIndexerId ?? undefined}
            className={ct(marginBetweenInputs)}
          >
            <option value="">Select Next Indexer</option>
            {potentialIndexers.map((indexer) => (
              <option value={indexer.id} key={indexer.id}>
                {indexer.name} {indexer.hostname}
              </option>
            ))}
          </SelectInput>

          <TextInput
            name="selectorToClick"
            label="selector to click"
            defaultValue={indexer.selectorToClick}
            className={ct(marginBetweenInputs)}
          />

          <Checkbox
            name="decodeUrl"
            label="decode url"
            defaultChecked={indexer.decodeUrl}
            className={ct(marginBetweenInputs)}
          />
          <Checkbox
            name="keepOldValue"
            label="enabled"
            defaultChecked={indexer.keepOldValue}
            className={ct(marginBetweenInputs)}
          />
          <TextInput
            name="secondsBetweenUpdates"
            label="value"
            defaultValue={indexer.secondsBetweenUpdates}
            className={ct(marginBetweenInputs)}
          />

          {children}
        </>
      )}
    </Form>
  )
}
