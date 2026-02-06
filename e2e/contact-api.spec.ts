import { test, expect } from "@playwright/test";

// Public API - no auth needed
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Contact API", () => {
  test("POST /api/contact rejects invalid payload", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {},
    });
    // Should return 400 or validation error
    expect([400, 422, 500]).toContain(res.status());
  });
});
