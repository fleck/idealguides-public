const dev = process.env.NODE_ENV !== "production"

import { sendResponse } from "next/dist/server/image-optimizer"

const originalSendResponse = sendResponse

const patchedSendResponse: typeof originalSendResponse = function (
  req,
  res,
  url,
  extension,
  buffer,
  _isStatic,
  xCache,
  contentSecurityPolicy,
  maxAge,
  isDev,
) {
  originalSendResponse(
    req,
    res,
    url,
    extension,
    buffer,
    !dev,
    xCache,
    contentSecurityPolicy,
    maxAge,
    isDev,
  )
}

// Monkey patching this method 🙈
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
require("next/dist/server/image-optimizer").sendResponse = patchedSendResponse
