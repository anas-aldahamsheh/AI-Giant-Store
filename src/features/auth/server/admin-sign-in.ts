import { createHash, timingSafeEqual } from "node:crypto";

// The store administrator signs in with ADMIN_EMAIL and ADMIN_PASSWORD from the server's
// environment. The password is checked here, on the server, so it never reaches the code
// the browser downloads.

export type AdminAccount = { email: string; password: string };

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** The administrator account, or null when the server has none set up. */
export function readAdminAccount(
  env: Record<string, string | undefined> = process.env,
): AdminAccount | null {
  const email = normalizeEmail(env.ADMIN_EMAIL ?? "");
  const password = env.ADMIN_PASSWORD ?? "";
  if (!email.includes("@") || !password) return null;
  return { email, password };
}

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Compares in constant time, so how long the answer takes says nothing about the password. */
export function passwordMatches(given: string, expected: string) {
  return timingSafeEqual(digest(given), digest(expected));
}

type Window = { count: number; resetAt: number };

/**
 * Counts failed administrator sign-ins: a few per visitor, and a cap for all visitors
 * together, so the password cannot be guessed from many addresses at once.
 */
export class FailedSignInLimiter {
  private readonly visitors = new Map<string, Window>();
  private everyone: Window = { count: 0, resetAt: 0 };

  constructor(
    private readonly limits = {
      perVisitor: 5,
      visitorWindowMs: 15 * 60_000,
      overall: 20,
      overallWindowMs: 60 * 60_000,
    },
  ) {}

  isBlocked(visitor: string, now = Date.now()) {
    this.sweep(now);
    const failures = this.visitors.get(visitor)?.count ?? 0;
    return (
      failures >= this.limits.perVisitor || this.everyone.count >= this.limits.overall
    );
  }

  recordFailure(visitor: string, now = Date.now()) {
    this.sweep(now);
    const entry = this.visitors.get(visitor);
    if (entry) entry.count += 1;
    else
      this.visitors.set(visitor, {
        count: 1,
        resetAt: now + this.limits.visitorWindowMs,
      });
    this.everyone.count += 1;
  }

  private sweep(now: number) {
    for (const [visitor, entry] of this.visitors) {
      if (entry.resetAt <= now) this.visitors.delete(visitor);
    }
    if (this.everyone.resetAt <= now)
      this.everyone = { count: 0, resetAt: now + this.limits.overallWindowMs };
  }
}
