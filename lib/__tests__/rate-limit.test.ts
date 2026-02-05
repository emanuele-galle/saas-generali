import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit, recordAttempt, clearAttempts } from "../rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    // Clear all entries by clearing attempts for test keys
    clearAttempts("test@example.com");
    clearAttempts("blocked@example.com");
  });

  it("allows first attempt", () => {
    expect(checkRateLimit("test@example.com")).toBe(true);
  });

  it("allows up to 5 attempts", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("test@example.com")).toBe(true);
      recordAttempt("test@example.com");
    }
  });

  it("blocks after 5 failed attempts", () => {
    for (let i = 0; i < 5; i++) {
      recordAttempt("blocked@example.com");
    }
    expect(checkRateLimit("blocked@example.com")).toBe(false);
  });

  it("clearAttempts resets the counter", () => {
    for (let i = 0; i < 5; i++) {
      recordAttempt("test@example.com");
    }
    expect(checkRateLimit("test@example.com")).toBe(false);

    clearAttempts("test@example.com");
    expect(checkRateLimit("test@example.com")).toBe(true);
  });

  it("resets after window expires", () => {
    vi.useFakeTimers();

    for (let i = 0; i < 5; i++) {
      recordAttempt("test@example.com");
    }
    expect(checkRateLimit("test@example.com")).toBe(false);

    // Advance past 15 min window
    vi.advanceTimersByTime(16 * 60 * 1000);
    expect(checkRateLimit("test@example.com")).toBe(true);

    vi.useRealTimers();
  });

  it("does not affect other keys", () => {
    for (let i = 0; i < 5; i++) {
      recordAttempt("blocked@example.com");
    }
    expect(checkRateLimit("blocked@example.com")).toBe(false);
    expect(checkRateLimit("test@example.com")).toBe(true);
  });
});
