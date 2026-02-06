import { test, expect } from "@playwright/test";

test.describe("Media Page (Admin)", () => {
  test("loads media page", async ({ page }) => {
    await page.goto("/media");
    await page.waitForTimeout(2_000);
    expect(page.url()).toContain("/media");
  });
});
