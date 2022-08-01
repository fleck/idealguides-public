import Link from "next/link"
import { PencilIcon } from "@heroicons/react/outline"
import EditButton from "app/core/components/EditButton"
import ct from "class-types.macro"
import deepEqual from "deep-equal"
import React, { Suspense, useEffect, useRef, useState } from "react"
import type { RootItem } from "../queries/getItemByUrl"
import { BlockProps, mapContent } from "./Content"
import { XCircleIcon } from "@heroicons/react/solid"
import { Comparison } from "./Comparison"
import { bare } from "../model/bare"

import { lazy } from "react"
import type { DeepReadonly } from "../queries/TypeUtilities"
import type { OnSave } from "./Editor"
import { isNewRecord } from "../../core/model/isNewRecord"
import { Heading } from "../../core/components/Heading"
import { Routes } from "@blitzjs/next"

const Editor = lazy(() => import("./Editor"))

type Props = DeepReadonly<{
  globalEditMode: boolean
  item: RootItem
  child?: Exclude<RootItem["children"], undefined>[number]
  setItem: React.Dispatch<React.SetStateAction<RootItem>>
  setParentItem?: React.Dispatch<React.SetStateAction<RootItem>>
  parentItem?: RootItem
  style?: React.CSSProperties
}> &
  OnSave

const ChildItem = (props: Omit<Required<Props>, "setItem" | "style" | "onSave">) => {
  const [item, setItem] = useState(props.item)

  return <Item {...props} {...{ setItem, item }} />
}

export default function Item({
  globalEditMode,
  item,
  setItem,
  child,
  setParentItem,
  parentItem,
  style,
  onSave,
}: Props) {
  const [editing, setEditMode] = useState(false)

  useEffect(() => {
    if (isNewRecord(item)) {
      setEditMode(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  const [itemInitialState, setItemInitialState] = useState(bare(item))

  const [alreadyFocusedTitle, setAlreadyFocusedTitle] = useState(false)

  useEffect(() => {
    setItemInitialState(bare(item))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  const dirty = !deepEqual(bare(item), itemInitialState)

  const title = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isNewRecord(item) || alreadyFocusedTitle) return

    setAlreadyFocusedTitle(true)

    // The transition from the modal closing before this seems to interfere with the focus
    // Adding the timeout fixes the issue.
    setTimeout(() => {
      title.current?.focus()
    }, 300)
  }, [alreadyFocusedTitle, item])

  // https://tailwindui.com/components/marketing/sections/content-sections#component-3f7a35fa653498b2c62441a98df3dc08
  return (
    <section style={style} className={ct("text-lg", globalEditMode ? "ml-10" : "")}>
      <Heading className="mt-2" size={child ? "2xl" : "3xl"}>
        {(globalEditMode || editing) && (
          <EditButton
            className={ct("mr-2", "h-7", "w-7", "flex-shrink-0")}
            onClick={() => setEditMode((prevEditing) => !prevEditing)}
            color={editing ? "gray" : "amber"}
            aria-label={`Edit ${item.name}`}
          >
            {editing ? <XCircleIcon /> : <PencilIcon />}
          </EditButton>
        )}
        {editing ? (
          <input
            className={ct(
              "cursor-text",
              "whitespace-pre-wrap",
              "rounded",
              "border",
              "border-solid",
              "border-gray-300",
              "focus:placeholder-transparent",
            )}
            ref={title}
            value={item.name || ""}
            aria-label={`Title for ${isNewRecord(item) ? "new " : ""}item`}
            placeholder="Enter title for item"
            onChange={(event) => setItem((prevItem) => ({ ...prevItem, name: event.target.value }))}
            style={{ font: "inherit", letterSpacing: "inherit" }}
          />
        ) : (
          item.name
        )}
        {dirty && !editing && (
          <span className={ct("text-sm", "font-normal", "text-yellow-500")}>
            {" "}
            warning content not saved!
          </span>
        )}
      </Heading>

      <div className={ct("prose", "prose-lg", "prose-lime", "mt-6", "text-gray-500")}>
        {editing ? (
          <Suspense fallback={<div>Loading</div>}>
            <Editor
              {...{
                onSave,
                item,
                setItem,
                dirty,
                setItemInitialState,
                setParentItem,
                child,
                parentItem,
              }}
            />
          </Suspense>
        ) : Boolean(item.contentState) ? (
          mapContent(item.contentState as BlockProps)
        ) : (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        )}
      </div>

      {item.type === "PAGE" ? (
        item.children?.map((child) => (
          <ChildItem
            key={child.id}
            item={child.item}
            setParentItem={setItem}
            parentItem={item}
            {...{ globalEditMode, child }}
          />
        ))
      ) : item.type === "COMPARISON" ? (
        <Comparison {...{ item, setItem, editing }} />
      ) : (
        <List item={item} />
      )}
    </section>
  )
}

function List({ item }: { item: RootItem }) {
  return item.children?.length ? (
    <ul>
      {item.children?.map((child) => {
        if (child.item.standalone) {
          return (
            <li key={child.id}>
              <Link href={Routes.ShowItemPage({ itemUrl: child.item.url })}>{child.item.name}</Link>
            </li>
          )
        }
        return <li key={child.id}>{child.item.name}</li>
      })}
    </ul>
  ) : null
}
