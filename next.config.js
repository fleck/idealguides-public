const { withBlitz } = require("@blitzjs/next")

module.exports = withBlitz({
  webpack: (config) => {
    config.module.rules.push({
      test: require.resolve("next/dist/shared/lib/router/router.js"),
      loader: "exports-loader",
      options: {
        exports: "fetchNextData",
      },
    })

    return config
  },
  experimental: {
    outputStandalone: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
  },
})
