import lodashSum from "lodash/sum"
import lodashMin from "lodash/min"
import lodashMax from "lodash/max"
import { RootItem } from "../../items/queries/getItemByUrl"

/**
 * Arguments passed to this function should be used the the eval call.
 */
const noopToPreventTypeScriptErrorsAndDeadCodeElimination = (..._args: any[]) => {}

const propertyWrapper = (properties: RootItem["properties"]) => {
  const memP = (...args: string[]): string[] | (string | number | undefined) => {
    const propertiesMatchingArguments = properties.filter((property) =>
      args.includes(property.datum.name),
    )

    const flatProperties = propertiesMatchingArguments.flatMap((p) =>
      p.datum.dynamic ? calculatePrivate(p.datum.text, properties) : p.datum.text,
    )

    if (args.length > 1) {
      return flatProperties
    }

    const asNumber = Number(flatProperties[0])

    return Number.isNaN(asNumber) ? flatProperties[0] : asNumber
  }

  return memP
}

const groupWrapper = (properties: RootItem["properties"]) => {
  const memG = (...args: string[]): (string | number)[] => {
    const propertiesMatchingArguments = properties.filter((property) =>
      args.includes(property.datum.group),
    )

    const flatProperties = propertiesMatchingArguments.flatMap((p) =>
      p.datum.dynamic ? calculatePrivate(p.datum.text, properties) : p.datum.text,
    )

    return flatProperties.map((property) => {
      const asNumber = Number(property)

      return Number.isNaN(asNumber) ? property : asNumber
    })
  }

  memG.toString = () => " g requires at least one group name as an argument "

  return memG
}

type PossibleValues = ReturnType<typeof propertyWrapper>

const min = (...args: PossibleValues[]) => lodashMin(args.flat())

const max = (...args: PossibleValues[]) => lodashMax(args.flat())

const sum = (...args: PossibleValues[]) => lodashSum(args.flat().map((arg) => Number(arg)))

function calculatePrivate(text: string | null, properties: RootItem["properties"]) {
  const p = propertyWrapper(properties)

  const g = groupWrapper(properties)

  try {
    return String(eval(text || ""))
  } catch (e) {
    noopToPreventTypeScriptErrorsAndDeadCodeElimination(min, max, sum, p, g)
    return "Error"
  }
}

export default function calculate(text: string | null, properties: RootItem["properties"]) {
  const p = propertyWrapper(properties)

  const g = groupWrapper(properties)

  try {
    return { value: String(eval(text || "")) }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e, value: "Error" }
    } else {
      noopToPreventTypeScriptErrorsAndDeadCodeElimination(p, g)
      throw e
    }
  }
}
