import { Heading } from "app/core/components/Heading"
import Layout from "app/core/layouts/Layout"
import db from "db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Link from "next/link"

const perPage = 4

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const page = Number(query.page) || 1

  const [embeds, count] = await Promise.all([
    db.embed.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        id: "asc",
      },
    }),
    db.embed.count(),
  ])

  const lastPage = count < 1 || Math.ceil(count / perPage) === page

  return { props: { embeds, page, lastPage } }
}

export default function EmbedManager({
  page,
  lastPage,
  embeds,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <Heading>Embeds</Heading>

      {embeds.map((embed) => (
        <div key={embed.id.toString()}>
          id: {embed.id.toString()} url: {embed.url}{" "}
          <Link
            href={{
              pathname: "/embed/edit/[id]",
              query: { id: embed.id.toString() },
            }}
          >
            <a>Edit</a>
          </Link>
        </div>
      ))}

      {page > 1 && (
        <Link
          href={{
            pathname: "/property_templates/[page]",
            query: { page: (page - 1).toString() },
          }}
        >
          <a>Previous</a>
        </Link>
      )}

      {!lastPage && (
        <Link
          href={{
            pathname: "/property_templates/[page]",
            query: { page: (page + 1).toString() },
          }}
        >
          <a>Next</a>
        </Link>
      )}
    </Layout>
  )
}
