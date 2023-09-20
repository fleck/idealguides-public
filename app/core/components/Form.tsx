import ct from "class-types.macro"
import { ReactNode, PropsWithoutRef } from "react"
import {
  Form as FinalForm,
  FormProps as FinalFormProps,
} from "react-final-form"
import * as z from "zod"
import Button from "./Button"
export { FORM_ERROR } from "final-form"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  mutators?: FinalFormProps<z.infer<S>>["mutators"]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Form<S extends z.ZodType<any, any> = never>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  mutators,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      mutators={mutators}
      validate={(values) => {
        if (!schema) return
        try {
          schema.parse(values)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitError }) => (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit} className={ct("space-y-8")} {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          {submitText && (
            <Button type="submit" color="lime">
              {submitText}
            </Button>
          )}
        </form>
      )}
    />
  )
}

export default Form
