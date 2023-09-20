import fs from "fs"
import { ServerResponse } from "http"
import path from "path"

export function addLinkEntityHeaders(
  response: ServerResponse,
  links: readonly { url: string; rel: "preload"; as: "style" }[],
) {
  if (!links.length) return

  response.setHeader("Link", links.join(","))
}

type NextManifest =
  | Partial<{
      polyfillFiles: string[]
      devFiles: never[]
      ampDevFiles: never[]
      lowPriorityFiles: string[]
      rootMainFiles: never[]
      pages: Partial<{
        "/": string[]
        "/404": string[]
        "/[itemUrl]": string[]
        "/_app": string[]
        "/_error": string[]
        "/embed": string[]
        "/indexers": string[]
        "/indexers/[id]/edit": string[]
        "/indexers/new": string[]
        "/items/new": string[]
        "/property_templates/[page]": string[]
        "/property_templates/edit/[id]": string[]
        "/property_templates/new": string[]
        "/search": string[]
        "/up": string[]
        "/user": string[]
        "/user/forgot-password": string[]
        "/user/login": string[]
        "/user/signup": string[]
      }>
      ampFirstPages: never[]
    }>
  | undefined
const manifestPath = path.join(process.cwd(), ".next", "build-manifest.json")
// Read the file content as a string
const manifestContent = fs.readFileSync(manifestPath, "utf8")
// Parse the string as a JSON object
const manifest = JSON.parse(manifestContent) as NextManifest
const cssFile = manifest?.pages?.["/_app"]?.find((asset) =>
  asset.endsWith(".css"),
)
const cssPath = cssFile ? `/_next/${cssFile}` : false

export const cssPreloadLink = () => {
  return cssPath
    ? ([{ url: cssPath, rel: "preload", as: "style" }] as const)
    : []
}
