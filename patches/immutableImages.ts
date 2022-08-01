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
) {
  originalSendResponse(req, res, url, extension, buffer, !dev, xCache, contentSecurityPolicy)
}

require("next/dist/server/image-optimizer").sendResponse = patchedSendResponse
