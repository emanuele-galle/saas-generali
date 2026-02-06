import { test, expect } from "@playwright/test";

test.describe("Submissions Page (Admin)", () => {
  test("loads submissions page", async ({ page }) => {
    await page.goto("/submissions");
    // Should show some heading or content about submissions/richieste
    await page.waitForTimeout(2_000);
    // The page should be accessible (not redirect to login)
    expect(page.url()).toContain("/submissions");
  });
});
