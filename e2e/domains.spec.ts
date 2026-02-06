import { test, expect } from "@playwright/test";

test.describe("Domains Page (Admin)", () => {
  test("loads domains page", async ({ page }) => {
    await page.goto("/domains");
    await page.waitForTimeout(2_000);
    expect(page.url()).toContain("/domains");
  });
});
