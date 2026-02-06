import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Forgot Password", () => {
  test("shows forgot password form", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(page.getByText("Password dimenticata?")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /invia link di reset/i })
    ).toBeVisible();
    await expect(page.getByText("Torna al login")).toBeVisible();
  });

  test("submits reset request and shows confirmation", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("button", { name: /invia link di reset/i }).click();

    // Should show confirmation regardless of whether email exists (security)
    await expect(page.getByText("Controlla la tua email")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("test@example.com")).toBeVisible();
    await expect(page.getByText("Torna al login")).toBeVisible();
  });

  test("navigates back to login from forgot password", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByText("Torna al login").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("navigates from login to forgot password", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Password dimenticata?").click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});
