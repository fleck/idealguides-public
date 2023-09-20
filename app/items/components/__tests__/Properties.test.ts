import { fillInLoginFormSubmitAndWaitForHomePage } from "../../../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { test, expect } from "../../../../test/baseFixtures"

test("computed properties", async ({ page }) => {
  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await expect(page.locator(':text("Total Price 13.98")')).toBeVisible()

  await expect(page.locator("text=Oil Price $10")).toBeVisible()

  await expect(page.locator(':text("Total time 25 minutes")')).toBeVisible()

  await expect(page.locator(':text("Total cost of tools 38.99")')).toBeVisible()

  await expect(page.locator(':text("Cheapest Tool 6")')).toBeVisible()

  await expect(page.locator(':text("Most expensive Tool 32.99")')).toBeVisible()

  expect(
    await page
      .getByRole("definition")
      .filter({ hasText: "6.00" })
      .getByRole("link", { name: "6.00" })
      .getAttribute("href"),
  ).toBe("https://retail.com/wrenchs")

  expect(
    await page
      .getByRole("definition")
      .filter({ hasText: "32.99" })
      .getByRole("link", { name: "32.99" })
      .getAttribute("href"),
  ).toBe("https://retailer.com/Jack")

  expect(
    await page
      .getByRole("definition")
      .filter({ hasText: "13.98" })
      .getByRole("link", { name: "13.98" })
      .getAttribute("href"),
  ).toBe("https://big-box.com/5w-30-motor-oil")

  expect(
    await page.getByRole("link", { name: "$3.00" }).getAttribute("href"),
  ).toBe("https://retail.com/plastic-wheel-chocks")
})

test("auto updating properties", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit Property rating"]')

  // Wait for websocket to open
  await page.waitForTimeout(1000)

  await page.click('text="Update"')

  expect(await page.waitForSelector(':text("8.4")')).toBeTruthy()
})
