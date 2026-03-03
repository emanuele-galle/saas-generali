import { describe, it, expect, vi } from "vitest";
import { verifyDNS } from "../dns";

// Mock dns/promises
vi.mock("dns/promises", () => ({
  resolveTxt: vi.fn(),
  resolve4: vi.fn(),
}));

import { resolveTxt, resolve4 } from "dns/promises";

const mockResolveTxt = vi.mocked(resolveTxt);
const mockResolve4 = vi.mocked(resolve4);

describe("verifyDNS", () => {
  it("returns valid when both TXT and A records match", async () => {
    mockResolveTxt.mockResolvedValue([["saas-consulenti-verify=abc123"]]);
    mockResolve4.mockResolvedValue(["193.203.190.63"]);

    const result = await verifyDNS(
      "example.com",
      "saas-consulenti-verify=abc123",
      "193.203.190.63",
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns error when TXT record is missing", async () => {
    mockResolveTxt.mockResolvedValue([["some-other-record"]]);
    mockResolve4.mockResolvedValue(["193.203.190.63"]);

    const result = await verifyDNS(
      "example.com",
      "saas-consulenti-verify=abc123",
      "193.203.190.63",
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Record TXT di verifica non trovato");
  });

  it("returns error when A record points to wrong IP", async () => {
    mockResolveTxt.mockResolvedValue([["saas-consulenti-verify=abc123"]]);
    mockResolve4.mockResolvedValue(["1.2.3.4"]);

    const result = await verifyDNS(
      "example.com",
      "saas-consulenti-verify=abc123",
      "193.203.190.63",
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Record A non punta a 193.203.190.63");
  });

  it("returns errors when DNS resolution fails", async () => {
    mockResolveTxt.mockRejectedValue(new Error("NXDOMAIN"));
    mockResolve4.mockRejectedValue(new Error("NXDOMAIN"));

    const result = await verifyDNS(
      "nonexistent.example.com",
      "saas-consulenti-verify=abc123",
      "193.203.190.63",
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Impossibile risolvere record TXT");
    expect(result.errors).toContain("Impossibile risolvere record A");
  });

  it("returns multiple errors when both checks fail", async () => {
    mockResolveTxt.mockResolvedValue([["wrong-record"]]);
    mockResolve4.mockResolvedValue(["1.2.3.4"]);

    const result = await verifyDNS(
      "example.com",
      "saas-consulenti-verify=abc123",
      "193.203.190.63",
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
