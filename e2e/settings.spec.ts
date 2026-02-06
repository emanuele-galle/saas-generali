import { test, expect } from "@playwright/test";

test.describe("Settings Page (Admin)", () => {
  test("loads settings page", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForTimeout(2_000);
    expect(page.url()).toContain("/settings");
  });
});
