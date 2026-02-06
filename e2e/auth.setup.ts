import { test as setup, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@saas-generali.it";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "admin2026!";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /accedi/i }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL("/", { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.context().storageState({ path: "e2e/.auth/admin.json" });
});
