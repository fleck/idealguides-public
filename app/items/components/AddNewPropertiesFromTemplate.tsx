import { DocumentDuplicateIcon, XCircleIcon } from "@heroicons/react/outline"
import Button from "app/core/components/Button"
import EditButton from "app/core/components/EditButton"
import { TextInput } from "app/core/components/FormElements"
import ct from "class-types.macro"
import debounce from "lodash/debounce"
import React, { Dispatch, SetStateAction, useReducer } from "react"
import { useState } from "react"
import { withTRPC, trpc } from "utils/trpc"
import { ChildOrRootItem } from "../queries/getRootItem"
import { useSocket } from "./useSocket"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { label } from "./label"

type Props = {
  item: ChildOrRootItem
  setItem: Dispatch<SetStateAction<ChildOrRootItem>>
}

export default withTRPC(function AddNewPropertiesFromTemplate({
  item,
  setItem,
}: Props) {
  const user = useCurrentUser()

  const [editing, setEditing] = useState(false)

  // We use a a one way toggle here to open a websocket and listen for changes
  // made to properties.
  const [listenForChanges, enableListeningForChanges] = useReducer(
    () => true,
    false,
  )

  useSocket({ user, setItem, enabled: listenForChanges })

  const [url, setUrl] = useState("")

  const { data: propertyTemplates = [], error } =
    trpc.propertyTemplates.useQuery({ url }, { retry: false })

  const { error: mutationError, mutate } =
    trpc.createPropertiesFromTemplate.useMutation()

  if (!editing) {
    return (
      <EditButton
        aria-label={label}
        title={label}
        className={ct("mx-auto", "my-2")}
        color="amber"
        onClick={() => setEditing(true)}
      >
        <DocumentDuplicateIcon className={ct("h-4", "w-4")} />
      </EditButton>
    )
  }

  return (
    <>
      {mutationError && (
        <div className={ct("text-red-700")}>{mutationError.toString()}</div>
      )}

      {error && <div className={ct("text-red-700")}>{error.toString()}</div>}

      {url.length > 2 && !propertyTemplates.length && (
        <>No property templates found</>
      )}

      <EditButton
        className={ct("mr-2", "h-7", "w-7", "flex-shrink-0")}
        onClick={() => setEditing(false)}
        color="gray"
        title="Cancel adding property template"
        aria-label={`Cancel adding property template`}
      >
        <XCircleIcon />
      </EditButton>

      <form>
        <TextInput
          label="URL"
          placeholder="url"
          onChange={debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            setUrl(event.target.value)
          }, 500)}
        />
      </form>

      {Boolean(propertyTemplates.length) && (
        <div>
          {propertyTemplates.map((propertyTemplate) => (
            <React.Fragment key={propertyTemplate.id.toString()}>
              Template Name: {propertyTemplate.name}{" "}
              <div>
                {propertyTemplate.properties.length > 0 ? (
                  <>
                    Properties that will be added:{" "}
                    {propertyTemplate.properties.map((property) => (
                      <div key={property.id.toString()}>
                        {property.datum.name}
                      </div>
                    ))}
                  </>
                ) : (
                  <>This template has no properties</>
                )}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault()

                  if (
                    propertyTemplate.properties.some(
                      (property) => property.datum.indexerId,
                    )
                  ) {
                    enableListeningForChanges()
                  }

                  mutate(
                    {
                      propertyTemplateId: propertyTemplate.id,
                      itemId: item.id,
                      url,
                    },
                    {
                      onSuccess: (properties) => {
                        setItem((item) => ({
                          ...item,
                          properties: [...item.properties, ...properties],
                        }))

                        setEditing(false)
                      },
                    },
                  )
                }}
              >
                {propertyTemplate.properties.length > 0 && (
                  <Button color="lime">Add the properties above</Button>
                )}
              </form>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
})
