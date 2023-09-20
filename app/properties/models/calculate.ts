import lodashSum from "lodash/sum"
import lodashMin from "lodash/min"
import lodashMax from "lodash/max"
import lodashSortBy from "lodash/sortBy"
import lodashMultiply from "lodash/multiply"
import lodashDivide from "lodash/divide"
import { ChildItem } from "../../items/queries/getRootItem"

type Property = ChildItem["properties"][number]

const calculateProperty = (
  property: Property,
  item: ChildItem,
): {
  valueOf: () => number
  toString: () => string
  _originalProperty: Property
} => {
  const value = property.datum.dynamic
    ? calculatePrivate(property.datum.text, item)
    : property.datum.text

  const nested =
    value != null &&
    typeof value === "object" &&
    "_originalProperty" in value &&
    value._originalProperty

  return {
    valueOf: () => Number(value),
    toString: () => String(value),
    _originalProperty: nested || property,
  }
}

type CalculatedProperty = ReturnType<typeof calculateProperty> & {
  error?: Error
}

const propertyWrapper = (item: ChildItem) => {
  const memP = (
    ...args: string[]
  ): CalculatedProperty[] | (CalculatedProperty | undefined) => {
    const propertiesMatchingArguments = item.properties.filter((property) =>
      args.includes(property.datum.name),
    )

    const flatProperties = propertiesMatchingArguments.flatMap((p) => {
      return calculateProperty(p, item)
    })

    if (args.length > 1) {
      return flatProperties
    }

    return flatProperties[0]
  }

  return memP
}

const groupWrapper = (item: ChildItem) => {
  const memG = (...args: string[]): CalculatedProperty[] => {
    const propertiesMatchingArguments = item.properties.filter((property) =>
      args.includes(property.datum.group),
    )

    return propertiesMatchingArguments.map((p) => calculateProperty(p, item))
  }

  memG.toString = () => " g requires at least one group name as an argument "

  return memG
}

type Children = NonNullable<ChildItem["children"]>

const search = (
  item: ChildItem,
  idToFind: ChildItem["id"] | string,
): Children => {
  if (BigInt(item.id) === BigInt(idToFind)) {
    return item.children || []
  }

  for (const child of item.children || []) {
    const subChildren = search(child.item, idToFind)

    if (subChildren.length > 0) {
      return subChildren
    }
  }

  return []
}

const childrenOfWrapper = (item: ChildItem) => {
  const childrenOf = (id: number | string) => {
    const children = search(item, id)

    if (children.length === 0) {
      throw new Error(`No children found for id ${id}`)
    }

    return children.flatMap((child) => child.item)
  }

  return childrenOf
}

type PossibleValues = ReturnType<ReturnType<typeof propertyWrapper>>

const min = (...args: PossibleValues[]) => lodashMin(args.flat())

const max = (...args: PossibleValues[]) => lodashMax(args.flat())

const multiply = (
  multiplier: CalculatedProperty,
  multiplicand: CalculatedProperty,
) => {
  const forwardedProperty =
    [multiplier, multiplicand].find(function theFirstPropertyWithUrl(property) {
      return property._originalProperty.datum.url
    }) || multiplier

  const value = lodashMultiply(Number(multiplier), Number(multiplicand))

  return {
    valueOf: () => value,
    toString: () => String(value),
    _originalProperty: forwardedProperty._originalProperty,
  }
}

const divide = (dividend: CalculatedProperty, divisor: CalculatedProperty) => {
  const forwardedProperty =
    [dividend, divisor].find(function theFirstPropertyWithUrl(property) {
      return property._originalProperty.datum.url
    }) || dividend

  const value = lodashDivide(Number(dividend), Number(divisor))

  return {
    valueOf: () => value,
    toString: () => String(value),
    _originalProperty: forwardedProperty._originalProperty,
  }
}

const sum = (...args: PossibleValues[]) => {
  const flatProperties = args.flatMap((property) => property || [])

  const firstProperty = flatProperties[0]

  if (!firstProperty) {
    return
  }

  const value = lodashSum(flatProperties)

  const forwardedProperty =
    flatProperties.find(function theFirstPropertyWithUrl(property) {
      return property._originalProperty.datum.url
    }) || firstProperty

  return {
    valueOf: () => value,
    toString: () => String(value),
    _originalProperty: forwardedProperty._originalProperty,
  }
}

const sort = (by: string, items: ChildItem[], index: number) => {
  const valuesOfProperties = items.flatMap((item) => {
    const matchingProperty = item.properties.find(
      (property) => property.datum.name === by,
    )

    const result =
      matchingProperty?.datum && calculateProperty(matchingProperty, item)

    return result && !isNaN(result.valueOf()) ? result : []
  })

  return lodashSortBy(valuesOfProperties).at(index)
}

const high = (by: string, items: ChildItem[]) => sort(by, items, -1)

const low = (by: string, items: ChildItem[]) => sort(by, items, 0)

const sumOf = (by: string, items: ChildItem[]) => {
  const valuesOfProperties = items.flatMap((item) => {
    const matchingProperty = item.properties.find(
      (property) => property.datum.name === by,
    )

    return matchingProperty && calculateProperty(matchingProperty, item)
  })

  return lodashSum(valuesOfProperties)
}

type ExpressionResult =
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint
  | Array<unknown>
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
  | Date
  | Record<string, never>

function calculatePrivate(
  text: string | null,
  item: ChildItem,
): ExpressionResult | CalculatedProperty {
  const p = propertyWrapper(item)

  const g = groupWrapper(item)

  const co = childrenOfWrapper(item)

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-implied-eval
    return Function(
      "low",
      "high",
      "min",
      "max",
      "sum",
      "p",
      "g",
      "co",
      "sumOf",
      "multiply",
      "divide",
      `"use strict";return (${text ?? ""});`,
    )(low, high, min, max, sum, p, g, co, sumOf, multiply, divide)
  } catch (e) {
    return "Error"
  }
}

export default function calculate(equation: string | null, item: ChildItem) {
  try {
    const value = calculatePrivate(equation, item)

    if (value && typeof value === "object" && "_originalProperty" in value) {
      return value
    }

    return {
      toString: () => String(value),
      valueOf: () => Number(value),
      _originalProperty: undefined,
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error, toString: () => "Error", valueOf: () => NaN }
    } else {
      throw error
    }
  }
}
