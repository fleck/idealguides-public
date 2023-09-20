import Layout from "app/core/layouts/Layout"

import { IndexerForm } from "../../app/indexers/IndexerForm"

import { trpc, withTRPC } from "utils/trpc"
import { NextPageWithLayout } from "../../app/NextPageWithLayout"
import { newIndexer } from "app/core/components/newIndexer"
import ct from "class-types.macro"
import { useRouter } from "next/router"

const NewIndexer: NextPageWithLayout = withTRPC(() => {
  const { mutate, error } = trpc.createOrUpdateIndexer.useMutation()

  const router = useRouter()

  return (
    <>
      <div>{error?.message}</div>
      <IndexerForm
        onSubmit={(event) => {
          event.preventDefault()

          console.log("SUBMITTING")

          const formData = new FormData(event.currentTarget)

          // We need to remove any files from the form data
          // because they are not supported by URLSearchParams
          const entries = [...formData.entries()].flatMap(([key, value]) =>
            value instanceof File ? [] : [[key, value]],
          )

          import("qs")
            .then(({ parse }) => {
              const indexer = parse(new URLSearchParams(entries).toString())

              mutate(indexer, {
                onSuccess: (newIndexer) =>
                  router.push({
                    pathname: "/indexers/[id]/edit",
                    query: { id: newIndexer.id.toString() },
                  }),
              })
            })
            .catch(console.error)
        }}
        indexer={newIndexer()}
      >
        <button className={ct("mt-5")} type="submit">
          Create
        </button>
      </IndexerForm>
    </>
  )
})

NewIndexer.getLayout = (page: JSX.Element) => (
  <Layout title={"Create New Indexer"}>{page}</Layout>
)

export default NewIndexer
