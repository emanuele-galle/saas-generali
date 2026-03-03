import { test, expect } from "@playwright/test";

// These tests do NOT use the stored auth state - they test the login page directly
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login Page", () => {
  test("shows login form with brand panel", async ({ page }) => {
    await page.goto("/login");

    // Brand panel (desktop)
    await expect(
      page.getByRole("heading", { name: "Piattaforma Landing Page" })
    ).toBeVisible();

    // Login form
    await expect(page.getByRole("heading", { name: "Accedi" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /accedi/i })).toBeVisible();

    // Forgot password link
    await expect(page.getByText("Password dimenticata?")).toBeVisible();
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("nonexistent@test.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: /accedi/i }).click();

    await expect(page.getByText("Credenziali non valide")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("requires email and password fields", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await expect(emailInput).toHaveAttribute("required", "");
    await expect(passwordInput).toHaveAttribute("required", "");
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@saas-consulenti.it");
    await page.getByLabel("Password").fill("admin2026!");
    await page.getByRole("button", { name: /accedi/i }).click();

    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("redirects unauthenticated users from multi-segment paths to login", async ({
    page,
  }) => {
    // Single-segment paths like /consultants are treated as landing page slugs by middleware
    // Multi-segment dashboard paths (e.g. /consultants/new) require auth
    await page.goto("/settings");
    // The middleware should see /settings as a single-segment → allows through as slug
    // Let's test a path that definitely needs auth: a non-public nested path
    await page.goto("/editor/test");
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});
