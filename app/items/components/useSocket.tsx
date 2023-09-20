import { useState } from "react"
import type { ChildItem } from "../queries/getRootItem"
import useWebSocket from "react-use-websocket"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { z } from "zod"

type IndexerProps = {
  user?: ReturnType<typeof useCurrentUser>
  setItem?: React.Dispatch<React.SetStateAction<ChildItem>>
  enabled: boolean
}

const datumValidator = z.object({
  updatedData: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      url: z.string(),
      text: z.string(),
      updated_at: z.coerce.date(),
      group: z.string(),
      dynamic: z.boolean(),
      digitsAfterDecimal: z.number().nullable(),
      prefix: z.string(),
      postfix: z.string(),
      global: z.boolean(),
      indexError: z.string(),
      indexerId: z.number().nullable(),
      affiliateLink: z.string(),
      force_digits_after_decimal: z.boolean(),
      last_index_response: z.string(),
      fileId: z.number().nullable(),
    }),
  ),
})

export const useSocket = ({ user, setItem, enabled = true }: IndexerProps) => {
  const [error, setError] = useState<Error>()

  useWebSocket(
    `${window.location.protocol.endsWith("s:") ? "wss" : "ws"}://${
      window.location.host
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    }/api/users/dataUpdates/${user?.id}`,
    {
      onMessage: ({ data }) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const result = datumValidator.safeParse(JSON.parse(data))

          if (result.success) {
            setItem?.((prevItem) => ({
              ...prevItem,
              properties: prevItem.properties.map((prevProperty) => {
                const updatedDatum = result.data.updatedData.find(
                  (datum) => datum.id === prevProperty.datum.id,
                )
                if (updatedDatum) {
                  return {
                    ...prevProperty,
                    datum: { ...prevProperty.datum, ...updatedDatum },
                  }
                }
                return prevProperty
              }),
            }))
          } else {
            setError(result.error)
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error)
          }
        }
      },
    },
    Boolean(setItem && user) && enabled,
  )

  return { error }
}
