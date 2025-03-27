import { test, expect } from "@playwright/test";

test.describe("Homepage features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
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

  test("textarea element tests", async ({ page }) => {
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute(
      "placeholder",
      expect.stringContaining("Create your alter ego"),
    );
    await expect(textarea).toHaveAttribute(
      "placeholder",
      "Create your alter ego! Try: 'A secret agent in a tuxedo with futuristic glasses and a sleek hoverboard.'",
    );
  });

  test("Button tests", async ({ page }) => {
    const button = page.locator("button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(button).toHaveText("Create Your Legend");
  });

  test("Check Frame is exists and image is not visible", async ({ page }) => {
    const frame = page.locator(".frame");
    await expect(frame).toBeVisible();
    const emptyFrame = page.locator(".empty-frame h3");
    await expect(emptyFrame).toBeVisible();
    await expect(emptyFrame).toHaveText("Your creation will manifest here");

    const image = page.locator("img");
    await expect(image).not.toBeVisible();
  });
});

test.describe("Input validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
});

test.describe("Tests to check responsiveness", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://avatar-generator-delta.vercel.app/");
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
});
