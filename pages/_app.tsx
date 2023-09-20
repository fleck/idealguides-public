import "app/polyfills"
import {
  ErrorFallbackProps,
  ErrorComponent,
  ErrorBoundary,
} from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import type { AppProps } from "next/app"
import React, { JSXElementConstructor, Suspense } from "react"
import { withBlitz } from "app/blitz-client"
import type { ReactElement } from "react"
import type { NextPage } from "next"

type NextPageWithLayout = NextPage & {
  getLayout?: (
    page: ReactElement,
  ) => ReactElement<unknown, string | JSXElementConstructor<unknown>> | null
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

import "app/core/styles/index.css"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <Suspense fallback="Loading...">
        <Component {...pageProps} />
      </Suspense>
    </ErrorBoundary>,
  )
}

export default withBlitz(MyApp)
