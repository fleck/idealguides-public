import { test, expect } from "../test/baseFixtures"

test("navigate to item page with no properties", async ({ page }) => {
  await page.goto("http://localhost:8080/jack-up-prius")

  expect(await page.waitForSelector('h1:has-text("Jack Up Prius")')).toBeTruthy()

  expect(await page.$('text="Properties"')).toBeNull()
})

test("content displays correctly", async ({ page }) => {
  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  expect(
    await page.$(
      'p:has-text("All the steps and supplies needed to change the oil in a Prius. This is for a second generation Prius 2005-2010.")',
    ),
  ).toBeTruthy()

  expect(await page.$('strong:has-text("Prius")')).toBeTruthy()
})
