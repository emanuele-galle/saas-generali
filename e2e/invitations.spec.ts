import { test, expect } from "@playwright/test";

test.describe("Invitations Page (Admin)", () => {
  test("loads invitations page", async ({ page }) => {
    await page.goto("/invitations");
    await page.waitForTimeout(2_000);
    expect(page.url()).toContain("/invitations");
  });
});
