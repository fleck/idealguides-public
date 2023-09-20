import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import config from "../config"
import WS from "ws"
import { v4 as uuidv4 } from "uuid"
import fastq from "fastq"
import { BrowserContext, Page } from "puppeteer"
import * as Sentry from "@sentry/node"
import type { Result, Job } from "./types"
import { extractAndProcessData } from "./extractData"

Sentry.init({
  dsn: "https://3e05e955263046339e83f5c23f4188b6@o510275.ingest.sentry.io/5605701",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

const { PORT = "3000" } = process.env

type WebSocketWithPing = WS & { pingTimeout?: NodeJS.Timeout }

function heartbeat(this: WebSocketWithPing) {
  console.log("heartbeat")
  if (this.pingTimeout) clearTimeout(this.pingTimeout)

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate()
  }, config.heartbeat + 2000)
}

const createClient = () => {
  console.log("creating client", " env ", process.env.NODE_ENV)
  const newClient = new WS(
    `${
      process.env.NODE_ENV === "development" || process.env.APP_ENV === "test"
        ? `ws://localhost:${PORT}`
        : "wss://idealguides.com"
    }/api/indexers/${config.token}/${uuidv4()}`,
  )

  newClient.on("open", heartbeat)

  newClient.on("ping", heartbeat)

  newClient.on("close", () => {
    setTimeout(() => {
      console.log("closed, creating new connection in 5 seconds")
      client = createClient()
    }, 5000)
  })

  newClient.addEventListener("error", () => {
    console.warn("error event")
  })

  newClient.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data.toString()) as Job

    if (message.queue === "bulk") {
      jobQueue.push(message, processResult)
    } else if (message.queue === "single") {
      jobQueue.unshift(message, processResult)
    }
  })

  setTimeout(function checkIfConnectionReady() {
    if (newClient.readyState === 0) {
      newClient.terminate()
    }
  }, 5000)

  return newClient
}

let client = createClient()

const puppeteerBrowser = puppeteer
  .use(StealthPlugin())
  .launch({ headless: true })

const jobQueue = fastq(worker, 1)

const sendError = (error: { url?: string; message: string }) => {
  console.log({ error })
  return client.send(
    JSON.stringify({
      command: "message",
      identifier: JSON.stringify({
        channel: "IndexerChannel",
      }),
      data: JSON.stringify({ action: "error", ...error }),
    }),
  )
}

function processResult(error: unknown, result?: Result) {
  if (error || !result) {
    console.error({ error, url: result?.url })
    sendError({
      ...(result ? result : {}),
      message:
        error instanceof Error ? error.message : "No error message available",
    })
    return
  }

  if ("response" in result) {
    const a = { action: "parse", ...result }

    return client.send(
      JSON.stringify({
        command: "message",
        identifier: JSON.stringify({
          channel: "IndexerChannel",
        }),
        data: JSON.stringify(a),
      }),
    )
  }

  if ("retryIn" in result) {
    setTimeout(function retry() {
      jobQueue.push(result, processResult)
    }, result.retryIn)

    return
  }
}

const tryForHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const lastIndexedURL: { [key: string]: number | undefined } = {}

const lastTimeHostnameWasIndexed: { [key: string]: number | undefined } = {}

const msBetweenIndexingDomains = process.env.NODE_ENV === "test" ? 0 : 15000

const msBeforeSkippingUrlIndexing = process.env.NODE_ENV === "test" ? 0 : 3000

async function worker(
  { url, dataToIndex, ...job }: Job,
  done: fastq.done<Result>,
) {
  const currentTime = new Date().getTime()

  const hostname = tryForHostname(url)

  const msSinceUrlWasLastIndexed = currentTime - (lastIndexedURL[url] || 0)

  if (msSinceUrlWasLastIndexed < msBeforeSkippingUrlIndexing) {
    done(
      new Error(
        `Won't re-index the url: ${url} it's only been since the last time it was indexed: ${
          msBetweenIndexingDomains - msSinceUrlWasLastIndexed
        }`,
      ),
    )
  }

  const msSinceHostnameWasLastIndexed =
    currentTime - (lastTimeHostnameWasIndexed[hostname] || 0)

  if (msSinceHostnameWasLastIndexed < msBetweenIndexingDomains) {
    console.log(
      `waiting: ${
        msBetweenIndexingDomains - msSinceHostnameWasLastIndexed
      }ms before trying again`,
    )

    return done(null, {
      url,
      retryIn: msBetweenIndexingDomains - msSinceHostnameWasLastIndexed,
      dataToIndex,
      ...job,
    })
  }

  lastIndexedURL[url] = currentTime

  lastTimeHostnameWasIndexed[hostname] = currentTime

  let incognito: BrowserContext

  let page: Page

  const browser = await puppeteerBrowser

  try {
    incognito = await browser.createIncognitoBrowserContext()
  } catch (error: any) {
    done(error, { url, ...job })

    return
  }

  try {
    page = await incognito.newPage()
  } catch (error: any) {
    incognito.close()

    done(error, { url, ...job })
    return
  }

  try {
    await page.goto(url)

    const response = await extractAndProcessData(page, dataToIndex)

    done(null, { url, response, ...job })
  } catch (error: any) {
    done(error, { url, ...job })
  } finally {
    page.close()

    incognito.close()
  }
}
