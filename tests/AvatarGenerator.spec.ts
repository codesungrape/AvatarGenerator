import { test, expect } from "@playwright/test";

test.describe("Homepage features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://avatar-generator-delta.vercel.app/");
  });
  test("has title", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(
      /Who Were You Meant To Be: Avatar Generator/,
    );
    await expect(page).toHaveTitle(/.*Avatar Generator.*/);
  });

  test("header elements should correct values", async ({ page }) => {
    const headerContainer = page.locator(".header-container");
    await expect(headerContainer).toBeVisible(); // does header container exist/render?

    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/Who You Were Meant To Be/);

    const h2 = page.locator("h2");
    await expect(h2).toBeVisible();
    await expect(h2).toHaveText(
      /Craft Your Ultimate Avatar, describe your vision and witness it materialize/,
    );
  });

  test("should be responsive", async ({ page }) => {
    // Test responsiveness by resizing viewport
    // Mobile viewport test
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileHeaderContainer = page.locator(".header-container");
    await expect(mobileHeaderContainer).toBeVisible();

    // Tablet viewport test
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletHeaderContainer = page.locator(".header-container");
    await expect(tabletHeaderContainer).toBeVisible();

    // Desktop viewport test
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopHeaderContainer = page.locator(".header-container");
    await expect(desktopHeaderContainer).toBeVisible();
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    const headings = await page.evaluate(() => {
      const headingElements = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
      );
      return headingElements.map((header) => ({
        level: parseInt(header.tagName.substring(1)),
        text: header.textContent,
      }));
    });
  });
});
