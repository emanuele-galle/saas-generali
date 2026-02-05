const attempts = new Map<string, { count: number; firstAttempt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS = 5;

export function checkRateLimit(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return true;

  // Window expired, reset
  if (Date.now() - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return true;
  }

  return entry.count < MAX_ATTEMPTS;
}

export function recordAttempt(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: Date.now() });
  } else {
    entry.count++;
  }
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
