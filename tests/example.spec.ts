import { test, expect } from "@playwright/test";

test.describe("Homepage features", () => {
  test("has title", async ({ page }) => {
    await page.goto("https://avatar-generator-delta.vercel.app/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(
      /Who Were You Meant To Be: Avatar Generator/,
    );
    await expect(page).toHaveTitle(/.*Avatar Generator.*/);
  });

  // test('has header', async ({ page }) => {
  //   await page.goto('https://avatar-generator-delta.vercel.app/');

  //   // Expect a title "to contain" a substring.
  //   await expect(page).toHaveTitle(/Who Were You Meant To Be: Avatar Generator/);
  //   await expect(page).toHaveTitle(/.*Avatar Generator.*/);
  // });
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});
