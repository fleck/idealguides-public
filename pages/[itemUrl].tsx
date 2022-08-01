import React, { useEffect, useState } from "react"

import Layout from "app/core/layouts/Layout"
import getItemByUrl, { RootItem } from "app/items/queries/getItemByUrl"
import ct from "class-types.macro"
import Properties from "app/items/components/Properties"
import { useHotkeys } from "react-hotkeys-hook"

import Item from "app/items/components/Item"
import { newProperty } from "app/properties/models/newProperty"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { NotFoundError } from "blitz"
import Head from "next/head"
import { cache } from "../app/cache"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    query: { itemUrl },
    res,
  } = ctx

  if (typeof itemUrl !== "string") throw new NotFoundError()

  const item = await getItemByUrl({ url: itemUrl })

  if (!item) {
    res.statusCode = 404
  }

  cache({ ...ctx, for: [365, "days"], ...(item && { items: [item] }) }).catch(console.warn)

  return { props: { item } }
}

const HasItem = (props: { item: RootItem }) => {
  const [item, setItem] = useState(props.item)

  useEffect(() => {
    setItem(props.item)
  }, [props.item])

  const [globalEditMode, setGlobalEditMode] = useState(false)

  useHotkeys("cmd+i", () => setGlobalEditMode((prev) => !prev))

  const properties = item.properties.filter((property) => !property.featured)

  const featuredProperties = item.properties.filter((property) => property.featured)

  return (
    <Layout
      navItems={[
        { text: "View", active: true },
        { onClick: () => setGlobalEditMode((previousEditMode) => !previousEditMode), text: "Edit" },
      ]}
    >
      <Head>
        <title>Item {item.name}</title>
      </Head>

      {(featuredProperties.length > 0 || globalEditMode) && (
        <Properties
          properties={featuredProperties}
          title="Featured Properties"
          className={ct("my-3", "sm:float-right")}
          propertyTemplate={{ ...newProperty, featured: true }}
          {...{ globalEditMode, item, setItem }}
        />
      )}

      <Item {...{ globalEditMode, item, setItem }} style={{ marginLeft: 0 }} />

      {(properties.length > 0 || globalEditMode) && (
        <Properties
          title="Properties"
          className={ct("my-3")}
          {...{ globalEditMode, item, setItem, properties }}
        />
      )}
    </Layout>
  )
}

const ShowItemPage = ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!item) return <Layout>We can&apos;t find the page you&apos;re looking for</Layout>

  return <HasItem {...{ item }} />
}

export default ShowItemPage
