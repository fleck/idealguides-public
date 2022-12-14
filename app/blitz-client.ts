import { AuthClientPlugin } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"
import { BlitzRpcPlugin } from "@blitzjs/rpc"

export const { withBlitz } = setupBlitzClient({
  plugins: [
    AuthClientPlugin({
      cookiePrefix: "myAppName-cookie-prefix",
    }),
    BlitzRpcPlugin({
      reactQueryOptions: {
        queries: {
          staleTime: 7000,
        },
      },
    }),
  ],
})
