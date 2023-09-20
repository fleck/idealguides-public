import { createTRPCReact } from "@trpc/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import type { AppRouter } from "../server/routers/_app"
import { getAntiCSRFToken } from "@blitzjs/auth"

export const trpc = createTRPCReact<AppRouter>()

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      headers() {
        return {
          // Going to replace blitz auth in the near future
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          "anti-csrf": getAntiCSRFToken(),
        }
      },
    }),
  ],
})

export const withTRPC = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> =>
  function withTRPC(props) {
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Component {...props} />
        </QueryClientProvider>
      </trpc.Provider>
    )
  }
