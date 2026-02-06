import { test, expect } from "@playwright/test";

test.describe("API Health", () => {
  test("GET /api/health returns 200 with status ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.app).toBe("saas-generali");
    expect(body.timestamp).toBeTruthy();
  });

  test("GET /robots.txt is accessible", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
  });

  test("GET /sitemap.xml is accessible", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
  });
});
