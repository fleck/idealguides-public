import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import { test as baseTest } from "@playwright/test"

const istanbulCLIOutput = path.join(process.cwd(), ".nyc_output")

export function generateUUID(): string {
  return crypto.randomBytes(16).toString("hex")
}

export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener("beforeunload", () =>
        // This is added to the window via the babel istanbul plugin.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        (window as any).collectIstanbulCoverage(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          JSON.stringify((window as any).__coverage__),
        ),
      ),
    )
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true })
    await context.exposeFunction(
      "collectIstanbulCoverage",
      (coverageJSON: string) => {
        if (coverageJSON)
          fs.writeFileSync(
            path.join(
              istanbulCLIOutput,
              `playwright_coverage_${generateUUID()}.json`,
            ),
            coverageJSON,
          )
      },
    )
    await use(context)
    for (const page of context.pages()) {
      await page.evaluate(() =>
        // This is added to the window via the babel istanbul plugin.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        (window as any).collectIstanbulCoverage(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          JSON.stringify((window as any).__coverage__),
        ),
      )
      await page.close()
    }
  },
})

export const expect = test.expect
