import { test, expect } from "@playwright/test";

test.describe("Analytics Page (Admin)", () => {
  test("loads analytics page", async ({ page }) => {
    await page.goto("/analytics");
    await page.waitForTimeout(2_000);
    expect(page.url()).toContain("/analytics");
  });
});
