// File: /Users/shantirai/Desktop/PROJECTS/avatarGenImg/tests/explicit-coverage.spec.ts
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test("Collect coverage explicitly", async ({ page }) => {
  // Start JS coverage collection with resetOnNavigation: false to keep coverage across navigations
  console.log("Starting JS coverage collection...");
  await page.coverage.startJSCoverage({
    resetOnNavigation: false,
    // Include all JavaScript, not just from our origin
    includeRawScriptCoverage: true,
  });

  // Navigate to your application
  await page.goto("/", { waitUntil: "networkidle" });
  console.log("Page loaded, starting interactions...");

  // Make sure we wait for the application to be fully ready
  // This is important for Vue applications that may have a mounting delay
  await page.waitForSelector('h1:has-text("Who You Were Meant To Be")');

  // Get the text input by its placeholder text (more reliable than by type)
  const inputLocator = page.getByRole("textbox", {
    name: /Create your alter ego/i,
  });

  // Wait for input to be visible and interactable
  await inputLocator.waitFor({ state: "visible" });

  // Test that input is working by typing text
  await inputLocator.fill("A futuristic robot with glowing blue eyes");

  // Verify the input value was set correctly (this ensures interaction worked)
  const inputValue = await inputLocator.inputValue();
  expect(inputValue).toBe("A futuristic robot with glowing blue eyes");

  // Get the generate button and click it
  const generateButton = page.getByRole("button", {
    name: "Create Your Legend",
  });
  await generateButton.waitFor({ state: "visible" });
  await generateButton.click();

  // Wait for some visual indication that generation is happening or completed
  // You might need to adjust this based on your application's behavior
  // For example, waiting for a loading indicator to appear and disappear
  await page.waitForTimeout(2000); // Give enough time for the app to process

  // Try additional interactions to increase coverage
  await inputLocator.clear();
  await inputLocator.fill("A wizard with a flowing purple cloak");
  await generateButton.click();

  // Wait for processing
  await page.waitForTimeout(2000);

  // Force-trigger any event handlers that might be registered
  // This can help execute code paths that might not be covered otherwise
  await page.evaluate(() => {
    // Trigger window resize event (often has handlers)
    window.dispatchEvent(new Event("resize"));

    // If your app uses custom events, trigger those here
    // For example: document.dispatchEvent(new CustomEvent('app:someEvent'));
  });

  console.log("Interactions complete, collecting coverage...");

  // Stop coverage collection
  const coverage = await page.coverage.stopJSCoverage();

  console.log(`Collected coverage data: ${coverage.length} entries`);

  // Create directory for coverage data if it doesn't exist
  const coverageDir = path.join(process.cwd(), "playwright-coverage");
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
    console.log(`Created directory: ${coverageDir}`);
  }

  // Save raw coverage data
  const filePath = path.join(coverageDir, "coverage-data.json");
  fs.writeFileSync(filePath, JSON.stringify(coverage, null, 2), "utf8");
  console.log(`Saved coverage data to: ${filePath}`);
});
