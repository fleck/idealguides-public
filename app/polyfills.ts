import "core-js/es/string/replace-all"
// @ts-expect-error no types are provided for this package
import { shim } from "array.prototype.at"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
shim()

/**
 * https://github.com/prisma/studio/issues/614#issuecomment-795213237
 */
declare global {
  interface BigInt {
    toJSON: () => string
  }
}
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}
