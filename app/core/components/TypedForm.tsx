import React from "react"
import {
  Checkbox,
  DownshiftInput,
  SelectInput,
  TextInput,
} from "./FormElements"

type KeyUnion<T, P extends string = ""> = T extends []
  ? T extends (infer U)[]
    ? KeyUnionArray<U, P>
    : never
  : T extends object
  ? KeyUnionObject<T, P, true>
  : never

type KeyUnionArray<T, P extends string> = {
  [K in keyof T]: T[K] extends []
    ? KeyUnionArray<T[K], `${P}[${Exclude<K, symbol>}]`>
    : T[K] extends object
    ? KeyUnionObject<
        T[K],
        Exclude<K, symbol> extends number
          ? `${P}[${Exclude<K, symbol>}]`
          : never
      >
    : K extends number
    ? `${P}[]`
    : `${P}[${Exclude<K, symbol>}]`
}[Exclude<keyof T, keyof []>]

type KeyUnionObject<
  TheObject,
  PropertyName extends string,
  TopLevel = false,
> = {
  [Key in keyof TheObject]: TheObject[Key] extends readonly unknown[]
    ? KeyUnionArray<
        TheObject[Key],
        TopLevel extends true
          ? `${PropertyName}${Exclude<Key, symbol>}`
          : `${PropertyName}[${Exclude<Key, symbol>}]`
      >
    : //
    // NonNullable's below are used to to ensure optional array types such as
    // `optional?: { id: number, type: number }[]` are included in the union
    NonNullable<TheObject[Key]> extends object
    ? TopLevel extends true
      ? KeyUnionObject<
          NonNullable<TheObject[Key]>,
          `${PropertyName}${Exclude<Key, symbol>}`
        >
      : KeyUnionObject<
          TheObject[Key],
          `${PropertyName}[${Exclude<Key, symbol>}]`
        >
    : TopLevel extends true
    ? Key
    : `${PropertyName}[${Exclude<Key, symbol>}]`
}[TheObject extends unknown[]
  ? Exclude<keyof TheObject, keyof []>
  : keyof TheObject]

type FunctionParameter<T> = T extends (...args: infer P) => unknown ? P : never

export const createForm = <
  FormComponents extends {
    [P in keyof FormComponents]: (
      props: FunctionParameter<FormComponents[P]>[0],
    ) => ReturnType<FormComponents[P]>
  },
>({
  formComponents,
}: {
  formComponents: FormComponents
}) => {
  return {
    Form: <T, ValidNames = KeyUnion<T>>({
      children,
      ...props
    }: {
      children: (data: {
        [P in keyof FormComponents]: (
          props: FunctionParameter<FormComponents[P]>[0] & { name: ValidNames },
        ) => ReturnType<FormComponents[P]>
      }) => JSX.Element
    } & Omit<
      React.DetailedHTMLProps<
        React.FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
      >,
      "children"
    >) => {
      return (
        <form {...props}>
          {children({
            ...formComponents,
          })}
        </form>
      )
    },
    components: <
      T extends Record<string, unknown>,
      ValidNames = KeyUnion<T>,
    >(): {
      [P in keyof FormComponents]: (
        props: FunctionParameter<FormComponents[P]>[0] & { name: ValidNames },
      ) => ReturnType<FormComponents[P]>
    } => {
      return formComponents
    },
  }
}

export const { Form, components } = createForm({
  formComponents: {
    SelectInput,
    TextInput,
    Checkbox,
    DownshiftInput,
    Input: (
      props: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
    ) => <input {...props} />,
  },
})
