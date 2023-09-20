import ct from "class-types.macro"
import React from "react"

const sizeMap = {
  "3xl": {
    tag: "h1",
    classes: ct("text-3xl", "font-extrabold", "sm:text-4xl"),
  },
  "2xl": { tag: "h2", classes: ct("text-2xl", "font-semibold", "sm:text-3xl") },
  xl: { tag: "h3", classes: ct("text-xl", "font-semibold", "sm:text-2xl") },
} as const

type Props = {
  size?: keyof typeof sizeMap
  children: React.ReactNode
  className?: ClassTypes
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>

export function Heading({
  size = "3xl",
  children,
  className = "",
  ...props
}: Props) {
  const Element = sizeMap[size].tag

  return (
    <Element
      className={ct(
        "flex",
        "items-center",
        "leading-8",
        "tracking-tight",
        "text-gray-900",
        sizeMap[size].classes,
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  )
}
