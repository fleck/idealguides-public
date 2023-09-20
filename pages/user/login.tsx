import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import { useRouter } from "next/router"

export const getServerSideProps = () => {
  return { props: {} }
}

const LoginPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={() => {
          router
            .push(
              // We actually don't know that .next is a valid route, but making TS happy here...
              router.query.next
                ? (decodeURIComponent(router.query.next as string) as "/")
                : "/",
            )
            .catch(console.error)
        }}
      />
    </div>
  )
}

LoginPage.getLayout = (page: JSX.Element) => (
  <Layout title="Log In">{page}</Layout>
)

export default LoginPage
