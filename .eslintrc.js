const baseConfig = require("@blitzjs/next/eslint")

module.exports = {
  ...baseConfig,
  plugins: ["class-types"],
  rules: {
    "class-types/class-order": 2,
    "class-types/single-class-per-arg": 2,
    ...baseConfig.rules,
  },
  ignorePatterns: ["packages/indexer/src/index.ts"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unused-vars": "off",
      },

      parserOptions: {
        project: ["./tsconfig.json"], // Specify it only for TypeScript files
      },
    },
  ],
}
