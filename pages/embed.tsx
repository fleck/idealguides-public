import Layout from "app/core/layouts/Layout"
import ct from "class-types.macro"
import { useEffect, useRef, useState } from "react"

export default function Embed() {
  return (
    <Layout>
      <div className="py-24 bg-gray-50 sm:py-24">
        <div className="max-w-md mx-auto pl-4 pr-8 sm:max-w-lg sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-4xl leading-10 font-extrabold tracking-tight text-gray-900 text-center sm:text-5xl sm:leading-none lg:text-6xl">
            Earn affiliate revenue and add useful content to your site
          </h1>
        </div>
      </div>
      <section
        className="relative bg-white shadow-xl rounded-t-lg overflow-hidden mb-16"
        aria-labelledby="contactHeading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-white">
            <h2 id="contactHeading" className="sr-only">
              Contact us
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="relative overflow-hidden py-10 px-6 bg-gradient-to-b from-yellow-500 to-yellow-600 sm:px-10 xl:p-12">
                <div
                  className="absolute inset-0 pointer-events-none sm:hidden"
                  aria-hidden="true"
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    width={343}
                    height={388}
                    viewBox="0 0 343 388"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                      fill="url(#linear1)"
                      fillOpacity=".1"
                    />
                    <defs>
                      <linearGradient
                        id="linear1"
                        x1="254.553"
                        y1="107.554"
                        x2="961.66"
                        y2="814.66"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div
                  className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden"
                  aria-hidden="true"
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    width={359}
                    height={339}
                    viewBox="0 0 359 339"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                      fill="url(#linear2)"
                      fillOpacity=".1"
                    />
                    <defs>
                      <linearGradient
                        id="linear2"
                        x1="192.553"
                        y1="28.553"
                        x2="899.66"
                        y2="735.66"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div
                  className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none lg:block"
                  aria-hidden="true"
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    width={160}
                    height={678}
                    viewBox="0 0 160 678"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                      fill="url(#linear3)"
                      fillOpacity=".1"
                    />
                    <defs>
                      <linearGradient
                        id="linear3"
                        x1="192.553"
                        y1="325.553"
                        x2="899.66"
                        y2="1032.66"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <ol className="list-decimal text-yellow-50 list-inside text-xl">
                  <li className="mb-3">Enter your Amazon affiliate ID</li>
                  <li className="mb-3">Copy the embed script</li>
                  <li className="mb-3">
                    Paste the embed script where you&apos;d like the content to
                    appear on your site
                  </li>
                </ol>
                <p className="text-yellow-50">
                  Any questions? Please contact us at:
                </p>
                <dl className="mt-8 space-y-6">
                  <dt>
                    <span className="sr-only">Email</span>
                  </dt>
                  <dd className="flex text-base text-yellow-50">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-yellow-200"
                      x-description="Heroicon name: outline/mail"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="ml-3">
                      <a
                        className="underline"
                        href="mailto:support@idealguides.com"
                      >
                        support@idealguides.com
                      </a>
                    </span>
                  </dd>
                </dl>
              </div>
              <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
                <AffiliateScript />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 text-center px-8 bg-white shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center text-white justify-center p-3 bg-lime-500 rounded-md shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Fast
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  We only make one request for the content HTML. The HTML is
                  delivered via a global CDN with over over 150 data centers
                  world wide. This means users don&apos;t waste a second waiting
                  for content!
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center text-white justify-center p-3 bg-lime-500 rounded-md shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  No bloat
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Most 3rd party tools slow your site down with loads of
                  JavaScript. Our embed code is powered by{" "}
                  <strong>less than 0.3KB of JS.</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center text-white justify-center p-3 bg-lime-500 rounded-md shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Up to date
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Tired of products you&apos;re linking to going out of stock or
                  prices embedded in your content changing? We automatically
                  keep content up to date with our automated data indexing.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center text-white justify-center p-3 bg-lime-500 rounded-md shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  No lock in
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Content is licensed under CC BY 4.0
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center text-white justify-center p-3 bg-lime-500 rounded-md shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Real people
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Affiliate links matched to your pages are reviewed by a real
                  person to ensure relevant content.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center text-white justify-center p-3 bg-lime-500 rounded-md shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Privacy
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  We don&apos;t spy on your users. Affiliate links are matched
                  to your content, not your visitors private data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <h2 className="text-center sm:text-5xl text-4xl lg:text-6xl leading-10 sm:leading-none font-extrabold tracking-tight text-gray-900 mt-8 mb-8 sm:mt-14 sm:mb-10">
        Example of an embed
      </h2>

      <SampleAffiliateScript />

      {process.env.APP_ENV !== "production" && (
        // This is here for testing/debugging purposes only.
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "8.4",
                reviewCount: "197",
              },
            }),
          }}
        />
      )}
    </Layout>
  )
}

function SampleAffiliateScript() {
  const difRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")

    script.innerHTML = affiliateScriptBody("adfasdf")

    // Effect may fire multiple times, but we only want to append script once.
    if (difRef.current?.firstElementChild) {
      return
    }

    difRef.current?.appendChild(script)
  }, [])

  return <div ref={difRef} />
}

function AffiliateScript() {
  const [amazonAffiliateId, setAmazonAffiliateId] = useState("")

  const codeSnippet = createAffiliateScript(amazonAffiliateId)

  return (
    <div className="grid grid-cols-1 gap-y-6">
      <div>
        <label htmlFor="amazon_affiliate_id" className="sr-only">
          Amazon Affiliate ID
        </label>
        <input
          id="amazon_affiliate_id"
          className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-lime-500 focus:border-lime-500 border-gray-300 rounded-md"
          placeholder="Amazon Affiliate ID"
          type="text"
          value={amazonAffiliateId}
          onChange={(e) => setAmazonAffiliateId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="affiliate_embed" className="sr-only">
          Embed Code
        </label>
        <textarea
          className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-lime-500 focus:border-lime-500 border-gray-300 rounded-md h-40"
          placeholder="Embed Code"
          id="affiliate_embed"
          value={codeSnippet}
          readOnly
        />
      </div>
      <div>
        <button
          type="button"
          className={ct(
            "inline-flex",
            "justify-center",
            "rounded-md",
            "border",
            "border-transparent",
            "bg-lime-700",
            "py-3",
            "px-6",
            "text-base",
            "font-medium",
            "text-white",
            "shadow-sm",
            "hover:bg-lime-800",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-lime-500",
            "focus:ring-offset-2",
          )}
          onClick={() => {
            navigator.clipboard.writeText(codeSnippet).catch(console.error)
          }}
        >
          Copy this script
        </button>
      </div>
    </div>
  )
}

const affiliateScriptBody = (amazonAffiliateId: string) =>
  `try{const e=document.currentScript;fetch(\`${
    (typeof window !== "undefined" && window?.location?.origin) || ""
  }/api/embeds/\${encodeURIComponent(window.location.href)}?amazon_id=${encodeURIComponent(
    amazonAffiliateId,
  )}\`).then((t=>{t.text().then((t=>{null==e||e.insertAdjacentHTML("beforebegin",t)}))})).catch()}catch(n){}`

function createAffiliateScript(amazonAffiliateId: string) {
  return `<script>${affiliateScriptBody(amazonAffiliateId)}</script>`
}
