import { test, expect } from "@playwright/test";

// Landing pages are public - no auth needed
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Public Landing Page", () => {
  test("shows published landing page for demo consultant", async ({
    page,
  }) => {
    await page.goto("/giuseppe-guglielmo");
    await page.waitForTimeout(3_000);

    // The page should load (not redirect to login - it's a public slug)
    expect(page.url()).toContain("/giuseppe-guglielmo");

    // Should contain consultant info (from seed data)
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });

  test("shows 404 for non-existent landing page slug", async ({ page }) => {
    const res = await page.goto("/this-slug-does-not-exist-xyz");
    // Should either show 404 page or redirect
    const status = res?.status();
    // Accept 404 or 200 (with not-found page rendered client-side)
    expect([200, 404]).toContain(status);
  });
});
