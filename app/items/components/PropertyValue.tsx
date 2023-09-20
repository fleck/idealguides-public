import React, { ReactNode } from "react"
import { ChildItem } from "../queries/getRootItem"
import calculate from "../../properties/models/calculate"
import { linkStyles } from "./linkStyles"

export function PropertyValue({
  item,
  datum,
}: {
  item: ChildItem
  datum: ChildItem["properties"][number]["datum"]
}) {
  const { prefix, digitsAfterDecimal, dynamic, text, postfix } = datum

  const result = (dynamic && text && calculate(text, item)) || text

  return (
    <ExternalLink
      url={
        datum.url ||
        (typeof result === "object" && result._originalProperty?.datum.url)
      }
    >
      {!!prefix && prefix}
      {typeof digitsAfterDecimal === "number"
        ? Number(result).toFixed(digitsAfterDecimal)
        : String(result)}
      {!!postfix && postfix}
    </ExternalLink>
  )
}

const ExternalLink = ({
  children,
  url = "",
}: {
  children: ReactNode
  url: string | false | undefined
}) => {
  if (!url) {
    return <>{children}</>
  }

  return (
    <a rel="nofollow" className={linkStyles} href={url}>
      {children}
    </a>
  )
}
