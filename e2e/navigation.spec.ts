import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates to Consultants page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Consulenti").click();
    await expect(page).toHaveURL("/consultants");
    await expect(
      page.getByRole("heading", { name: "Consulenti" })
    ).toBeVisible();
  });

  test("navigates to Invitations page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Inviti").click();
    await expect(page).toHaveURL("/invitations");
  });

  test("navigates to Domains page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Domini").click();
    await expect(page).toHaveURL("/domains");
  });

  test("navigates to Submissions page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Richieste").click();
    await expect(page).toHaveURL("/submissions");
  });

  test("navigates to Analytics page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Analytics").click();
    await expect(page).toHaveURL("/analytics");
  });

  test("navigates to Media page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Media").click();
    await expect(page).toHaveURL("/media");
  });

  test("navigates to Settings page", async ({ page }) => {
    await page.goto("/");
    await page.locator("aside").first().getByText("Impostazioni").click();
    await expect(page).toHaveURL("/settings");
  });

  test("navigates back to Dashboard from sidebar", async ({ page }) => {
    await page.goto("/consultants");
    await page.locator("aside").first().getByText("Dashboard").click();
    await expect(page).toHaveURL("/");
  });
});
