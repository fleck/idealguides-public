import Button from "app/core/components/Button"
import Layout from "app/core/layouts/Layout"
import {
  replacementsSchema,
  selectorsSchema,
} from "packages/indexer/src/IndexerSchema"

import db from "db"
import { IndexerForm } from "../../../app/indexers/IndexerForm"
import { Loading } from "../../../app/core/components/Loading"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { NotFoundError } from "blitz"
import { trpc, withTRPC } from "utils/trpc"
import { NextPageWithLayout } from "app/NextPageWithLayout"
import { useRouter } from "next/router"

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  if (typeof query["id"] !== "string") throw new NotFoundError()

  const indexer = await db.indexer.findFirst({
    where: { id: Number(query["id"]) },
  })

  if (!indexer) throw new NotFoundError()

  const parsedSelectors = selectorsSchema.safeParse(indexer.selectors)

  const selectors = parsedSelectors.success ? parsedSelectors.data : []

  const parsedReplacements = replacementsSchema.safeParse(indexer.replacements)

  const replacements = parsedReplacements.success ? parsedReplacements.data : []

  const potentialNextIndexers = await db.indexer.findMany({
    where: { hostname: indexer.hostname },
  })

  return {
    props: {
      indexer: { ...indexer, replacements, selectors },
      potentialNextIndexers,
    },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const EditIndexer: NextPageWithLayout<Props> = withTRPC(
  ({ indexer, potentialNextIndexers }: Props) => {
    const { mutate, error, isLoading } =
      trpc.createOrUpdateIndexer.useMutation()

    const router = useRouter()

    return (
      <>
        {error?.message}
        <IndexerForm
          indexer={indexer}
          potentialNextIndexers={potentialNextIndexers}
          onSubmit={(event) => {
            event.preventDefault()

            const formData = new FormData(event.currentTarget)

            // We need to remove any files from the form data
            // because they are not supported by URLSearchParams
            const entries = [...formData.entries()].flatMap(([key, value]) =>
              value instanceof File ? [] : [[key, value]],
            )

            import("qs")
              .then(({ parse }) => {
                const updatedIndexer = parse(
                  new URLSearchParams(entries).toString(),
                )

                mutate(updatedIndexer, {
                  onSuccess: () => router.push({ pathname: "/indexers" }),
                })
              })
              .catch(console.error)
          }}
        >
          <Button type="submit" color="lime">
            {isLoading && <Loading />}
            Update Indexer
          </Button>
        </IndexerForm>
      </>
    )
  },
)

EditIndexer.getLayout = (page: JSX.Element) => (
  <Layout title={"Create New Indexer"}>{page}</Layout>
)

export default EditIndexer
