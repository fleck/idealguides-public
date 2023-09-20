import { fillInLoginFormSubmitAndWaitForHomePage } from "../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { expect, test } from "../../test/baseFixtures"
import { ratingJson } from "db/ratingJson"

test("add and edit indexer page", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/indexers")

  await page.getByRole("link", { name: "Create a new indexer" }).click()

  await page
    .getByRole("textbox", { name: "name", exact: true })
    .type("a new indexer")

  await page.getByRole("textbox", { name: "hostname" }).type("localhost")

  await page
    .getByRole("combobox", { name: "Next Indexer" })
    .selectOption("Page Heading localhost")

  await page.getByRole("button", { name: "Create" }).click()

  await page.getByRole("textbox", { name: "decimal places" }).type("2")

  await page.getByRole("button", { name: "Update Indexer" }).click()

  await expect(
    page.getByRole("cell", { name: "a new indexer", exact: true }),
  ).toBeVisible()

  await page.getByRole("link", { name: "Edit Rating", exact: true }).click()

  await expect(
    page.getByRole("combobox", { name: "Next Indexer" }),
  ).toHaveValue(ratingJson.id.toString())
})
