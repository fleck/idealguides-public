import Layout from "app/core/layouts/Layout"
import Item from "app/items/components/Item"
import { useState } from "react"
import type { RootItem } from "app/items/queries/getItemByUrl"
import { newItem } from "app/core/components/newItem"

import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  let name = context.query?.name

  if (typeof name !== "string") {
    name = ""
  }

  return { props: { name } }
}

const NewItemPage = ({ name }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [item, setItem] = useState<RootItem>({ ...newItem, name })
  const router = useRouter()

  const [globalEditMode] = useState(true)

  return (
    <>
      <h1>Create New Item</h1>

      <Item
        onSave={(savedItem) => router.push(Routes.ShowItemPage({ itemUrl: savedItem.url }))}
        {...{ globalEditMode, item, setItem }}
      />
    </>
  )
}

// NewItemPage.authenticate = true
NewItemPage.getLayout = (page: any) => <Layout title={"Create New Item"}>{page}</Layout>

export default NewItemPage
