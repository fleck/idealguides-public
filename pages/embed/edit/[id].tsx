import Layout from "app/core/layouts/Layout"
import db from "db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const embed = await db.embed.findFirst({
    where: { id: Number(ctx.query.id) },
  })

  if (!embed) {
    ctx.res.statusCode = 404
  }

  return { props: { embed } }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function EditEmbed({ embed }: Props) {
  if (!embed) return <Layout>cannot find this embed</Layout>

  return <Layout>Hi</Layout>
}

import React, { useState } from "react"
import { z } from "zod"
import ct from "class-types.macro"
import { PropertyTemplate } from "app/propertyTemplates/helpers"
import { propertyTemplateSchema } from "app/propertyTemplates/propertyTemplateSchema"

import { newProperty } from "app/properties/models/newProperty"
import { Form, components } from "app/core/components/TypedForm"
import { trpc, withTRPC } from "utils/trpc"

import { Indexer } from "@prisma/client"
import { useRouter } from "next/router"
import Button from "app/core/components/Button"
import { persisted } from "app/items/components/persisted"
import { DeepReadonly } from "app/items/TypeUtilities"

type PropertyTemplateReadonly = DeepReadonly<NonNullable<PropertyTemplate>>

const marginTop = "mt-6"

type PropertyTemplateSchema = z.output<typeof propertyTemplateSchema>

const ensureError = (e: unknown) =>
  e instanceof Error ? e : new Error("Unknown error")

const EmbedForm = withTRPC(function PropertyTemplateForm({ embed }: Props) {
  const [propertyTemplateState, setPropertyTemplateState] = useState(embed)

  const router = useRouter()

  const { mutateAsync, error } =
    trpc.createOrUpdatePropertyTemplate.useMutation()

  return (
    <>
      {error && <>ERROR: {error.message}</>}
      <Form<PropertyTemplateSchema>
        method="post"
        className={ct(
          "space-y-6",
          "bg-white",
          "py-8",
          "px-4",
          "shadow",
          "sm:rounded-lg",
          "sm:px-10",
        )}
        onSubmit={(event) => {
          event.preventDefault()

          const formData = new FormData(event.currentTarget)

          // We need to remove any files from the form data
          // because they are not supported by URLSearchParams
          const entries = [...formData.entries()].flatMap(([key, value]) =>
            value instanceof File ? [] : [[key, value]],
          )

          import("qs")
            .then(async ({ parse }) => {
              const propertyTemplate = parse(
                new URLSearchParams(entries).toString(),
              )

              const newPropertyTemplate = await mutateAsync(
                propertyTemplate,
              ).catch(ensureError)

              if (newPropertyTemplate instanceof Error) return

              await router.push({
                pathname: `/property_templates/edit/[id]`,
                query: { id: newPropertyTemplate.id.toString() },
              })
            })
            .catch(console.error)
        }}
      >
        {({ TextInput, Input }) => (
          <>
            <Input type="hidden" defaultValue={embed.id.toString()} name="id" />
            <TextInput
              label="Template Name"
              name="name"
              defaultValue={propertyTemplateState.name?.toString()}
              className={ct(marginTop)}
            />

            <button
              name="addPropertyTemplate"
              value="true"
              formNoValidate
              onClick={(e) => {
                e.preventDefault()

                setPropertyTemplateState((prev) => {
                  return {
                    ...prev,
                    properties: [...prev.properties, newProperty()],
                  }
                })
              }}
            >
              Add Property
            </button>
            <div>
              <button type="submit">Save</button>
            </div>
          </>
        )}
      </Form>
    </>
  )
})

const { Input, Checkbox, SelectInput, TextInput } =
  components<PropertyTemplateSchema>()

const PropertyForm = ({
  index,
  property,
  indexers,
  setPropertyTemplateState,
}: {
  index: number
  property: FormProps["propertyTemplate"]["properties"][number]
  indexers: Indexer[]
  setPropertyTemplateState: React.Dispatch<
    React.SetStateAction<PropertyTemplateReadonly>
  >
}) => {
  const allIndexers = [
    ...indexers.filter((indexer) => indexer.id !== property.datum.indexer?.id),
    ...(property.datum.indexer ? [property.datum.indexer] : []),
  ]

  const { mutate: deleteProperty } =
    trpc.deletePropertyFromTemplate.useMutation()

  return (
    <React.Fragment>
      <Input
        type="hidden"
        name={`properties[${index}][id]`}
        defaultValue={property.id.toString()}
      />
      <Input
        type="hidden"
        name={`properties[${index}][datum][id]`}
        defaultValue={property.datum.id}
      />
      <TextInput
        label="Property Name"
        name={`properties[${index}][datum][name]`}
        defaultValue={property.datum.name}
      />

      <Checkbox
        label="Global"
        name={`properties[${index}][datum][global]`}
        defaultChecked={property.datum.global}
      />

      <Checkbox
        label="Dynamic"
        name={`properties[${index}][datum][dynamic]`}
        defaultChecked={property.datum.dynamic}
      />

      <Checkbox
        label="Featured"
        name={`properties[${index}][featured]`}
        defaultChecked={property.featured}
      />

      {allIndexers.length ? (
        <SelectInput
          name={`properties[${index}][datum][indexerId]`}
          label="Indexer"
          defaultValue={property.datum.indexerId || ""}
        >
          <option value="">Select Indexer</option>
          {allIndexers.map((indexer) => (
            <option value={indexer.id} key={indexer.id}>
              {indexer.name}
            </option>
          ))}
        </SelectInput>
      ) : (
        "No matching indexers"
      )}

      <TextInput
        defaultValue={property.datum.text}
        label="Text"
        name={`properties[${index}][datum][text]`}
      />

      <TextInput
        defaultValue={property.datum.group}
        label="Group"
        name={`properties[${index}][datum][group]`}
      />

      <TextInput
        defaultValue={property.datum.digitsAfterDecimal ?? undefined}
        label="Digits After Decimal"
        name={`properties[${index}][datum][digitsAfterDecimal]`}
        type="number"
      />

      <TextInput
        defaultValue={property.datum.prefix}
        label="Prefix"
        name={`properties[${index}][datum][prefix]`}
      />

      <TextInput
        defaultValue={property.datum.postfix}
        label="Postfix"
        name={`properties[${index}][datum][postfix]`}
      />

      <Button
        color="red"
        onClick={(event) => {
          event.preventDefault()

          setPropertyTemplateState((propertyTemplate) => {
            if (persisted(property)) {
              deleteProperty(property.id)
            }

            return {
              ...propertyTemplate,
              properties: propertyTemplate.properties.filter(
                (p) => BigInt(p.id) !== BigInt(property.id),
              ),
            }
          })
        }}
      >
        Delete
      </Button>
    </React.Fragment>
  )
}
