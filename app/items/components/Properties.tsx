/* eslint-disable @next/next/no-img-element */
import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"

import React, { useState, lazy, Suspense } from "react"
import { PencilIcon } from "@heroicons/react/outline"

import type { RootItem, Unionize } from "../queries/getItemByUrl"

import calculate from "../../properties/models/calculate"
import { File } from "db"
import { urlFor } from "app/file/url"

import { group } from "../../properties/models/group"
import { DeepReadonly } from "../queries/TypeUtilities"

const EditGroup = lazy(() => import("./EditGroup"))

const EditProperty = lazy(() => import("./EditProperty"))

const AddNewProperty = lazy(() => import("./AddNewProperty"))

export const validHeightAndWidth = (
  image: Unionize<File, Date | bigint, string>,
): image is File & { metadata: { width: number; height: number } } =>
  typeof image.metadata === "object" &&
  image.metadata !== null &&
  "width" in image.metadata &&
  typeof image.metadata.width === "number" &&
  "height" in image.metadata &&
  typeof image.metadata.height === "number"

const Property = ({
  property,
  globalEditMode,
  item,
  setItem,
  properties,
  propertiesInGroup,
  className = "",
}: { property: RootItem["properties"][number] } & {
  globalEditMode: boolean
  item: RootItem
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
  properties: RootItem["properties"]
  propertiesInGroup: RootItem["properties"]
  className?: ClassTypes
}) => {
  const [editMode, setEditMode] = useState(BigInt(property.id) < 1)
  const {
    name = "",
    text = "",
    dynamic,
    image,
    postfix,
    prefix,
    digitsAfterDecimal,
  } = property.datum

  return (
    <div
      key={property.id.toString()}
      className={ct(
        "grid",
        "gap-4",
        "py-4",
        "px-6",
        "py-5",
        className,
        globalEditMode ? "grid-cols-4" : "grid-cols-3",
      )}
    >
      {globalEditMode && (
        <div className={ct("flex")}>
          <EditButton
            color={editMode ? "gray" : "amber"}
            onClick={() => setEditMode((prevEditMode) => !prevEditMode)}
            className={ct("h-[1.625rem]")}
            aria-label={`Edit Property ${property.datum.name}`}
          >
            <PencilIcon className={ct("h-4", "w-4")} />
          </EditButton>
        </div>
      )}
      {editMode ? (
        <Suspense fallback={null}>
          <EditProperty {...{ property, item, setItem, dynamic, properties, propertiesInGroup }} />
        </Suspense>
      ) : image && validHeightAndWidth(image) ? (
        <>
          <div className="block relative w-full col-span-3 aspect-w-10 aspect-h-7 overflow-hidden">
            <picture>
              <source type="image/avif" srcSet={urlFor(image, "searchResultAvif")} />
              <source type="image/webp" srcSet={urlFor(image, "searchResultWebp")} />
              <img
                alt={image.description}
                src={urlFor(image)}
                width={image.metadata.width}
                height={image.metadata.height}
                className={ct("mx-auto", "rounded-md")}
                aria-labelledby={property.id.toString() + name + "-name"}
                loading="lazy"
              />
            </picture>
          </div>
          <div className="mt-4 col-span-3 mx-auto flex items-start justify-between">
            <h2
              id={property.id.toString() + name + "-name"}
              className={ct("flex", "items-center", "text-sm", "font-medium", "text-gray-500")}
            >
              {name}
            </h2>
          </div>
        </>
      ) : (
        <>
          <dt className={ct("flex", "items-center", "text-sm", "font-medium", "text-gray-500")}>
            {name}{" "}
          </dt>
          <dd className="text-sm text-gray-900 col-span-2 items-center flex">
            <PropertyValue {...{ prefix, digitsAfterDecimal, dynamic, text, item, postfix }} />
          </dd>
        </>
      )}
    </div>
  )
}

export function PropertyValue({
  prefix,
  digitsAfterDecimal,
  dynamic,
  text,
  item,
  postfix,
}: {
  prefix: string | null
  digitsAfterDecimal: number | null
  dynamic: boolean
  text: string
  item: RootItem
  postfix: string | null
}) {
  return (
    <>
      {Boolean(prefix) && prefix}
      {typeof digitsAfterDecimal === "number"
        ? Number(dynamic && text ? calculate(text, item.properties).value : text).toFixed(
            digitsAfterDecimal,
          )
        : dynamic && text
        ? calculate(text, item.properties).value
        : text}
      {Boolean(postfix) && postfix}
    </>
  )
}

type Props = DeepReadonly<{
  globalEditMode: boolean
  item: RootItem
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
  properties: RootItem["properties"]
  title: string
  className?: ClassTypes
  propertyTemplate?: RootItem["properties"][number]
}>

/** https://tailwindui.com/components/application-ui/data-display/description-lists#component-e1b5917b21bbe76a73a96c5ca876225f */
export default function Properties({
  globalEditMode,
  item,
  setItem,
  properties,
  title,
  className = "",
  propertyTemplate,
}: Props) {
  const propertiesInGroups = group(properties)

  const groups = propertiesInGroups.map(([group]) => group)

  return (
    <div
      className={ct(
        "mr-1",
        "overflow-hidden",
        "bg-white",
        "shadow",
        "sm:w-[26rem]",
        "sm:rounded-lg",
        className,
      )}
    >
      {title && (
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {propertiesInGroups
            .map(([group, propertiesInGroup], index) => [
              group ? (
                <GroupHeading
                  key={group}
                  {...{
                    group,
                    index,
                    globalEditMode,
                    groups: groups,
                    propertiesInGroup,
                    properties,
                    setItem,
                  }}
                />
              ) : (
                globalEditMode &&
                groups.length > 1 && (
                  <GroupHeading
                    key="ungrouped"
                    {...{
                      groupName: "Ungrouped Properties",
                      group,
                      index,
                      globalEditMode,
                      groups: groups,
                      propertiesInGroup,
                      properties,
                      setItem,
                    }}
                  />
                )
              ),
              propertiesInGroup.map((property) => (
                <Property
                  key={property.id.toString()}
                  className={index % 2 ? "bg-gray-100" : ""}
                  {...{ globalEditMode, property, item, setItem, properties, propertiesInGroup }}
                />
              )),
            ])
            .flat(2)}
        </dl>
        {globalEditMode && (
          <Suspense fallback={<div>loading</div>}>
            <AddNewProperty aria-label={`Add ${title}`} {...{ setItem, propertyTemplate }} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

type GroupHeadingProps = DeepReadonly<{
  groupName?: string
  group: string
  index: number
  globalEditMode: boolean
  groups: string[]
  properties: RootItem["properties"]
  propertiesInGroup: RootItem["properties"][number][]
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
}>

function GroupHeading({
  group,
  index,
  globalEditMode,
  groups,
  groupName = group?.toString() || "null",
  propertiesInGroup,
  properties,
  setItem,
}: GroupHeadingProps) {
  return (
    <div
      key={groupName}
      className={ct(
        "flex",
        "space-x-2",
        "py-4",
        "px-6",
        "py-5",
        "font-semibold",
        index % 2 ? "bg-gray-100" : "",
      )}
    >
      <span>{groupName}</span>
      {globalEditMode && (
        <Suspense fallback={null}>
          <EditGroup
            {...{
              groups,
              group,
              groupName,
              properties,
              propertiesInGroup,
              setItem,
            }}
          />
        </Suspense>
      )}
    </div>
  )
}
