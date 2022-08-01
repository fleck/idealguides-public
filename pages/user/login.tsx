import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import { useRouter } from "next/router"

export const getServerSideProps = async () => {
  return { props: {} }
}

const LoginPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={async () =>
          await router.push(
            router.query.next ? decodeURIComponent(router.query.next as string) : "/",
          )
        }
      />
    </div>
  )
}

LoginPage.getLayout = (page: any) => <Layout title="Log In">{page}</Layout>

export default LoginPage
