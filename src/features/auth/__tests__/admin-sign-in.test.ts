import { afterEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/auth/admin/route";
import {
  FailedSignInLimiter,
  passwordMatches,
  readAdminAccount,
} from "@/features/auth/server/admin-sign-in";

const testAccount = {
  ADMIN_EMAIL: " Owner@Example.com ",
  ADMIN_PASSWORD: "test-only-Secret-42",
};

function signIn(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request("http://store.test/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", host: "store.test", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("administrator account settings", () => {
  it("is off until both the email and the password are set", () => {
    expect(readAdminAccount({})).toBeNull();
    expect(readAdminAccount({ ADMIN_EMAIL: "owner@example.com" })).toBeNull();
    expect(readAdminAccount({ ADMIN_PASSWORD: "x" })).toBeNull();
    expect(
      readAdminAccount({ ADMIN_EMAIL: "not-an-email", ADMIN_PASSWORD: "x" }),
    ).toBeNull();
  });

  it("normalizes the email and keeps the password exactly", () => {
    expect(readAdminAccount(testAccount)).toEqual({
      email: "owner@example.com",
      password: "test-only-Secret-42",
    });
  });

  it("matches only the exact password", () => {
    expect(passwordMatches("test-only-Secret-42", "test-only-Secret-42")).toBe(true);
    expect(passwordMatches("test-only-secret-42", "test-only-Secret-42")).toBe(false);
    expect(passwordMatches("", "test-only-Secret-42")).toBe(false);
    expect(passwordMatches("test-only-Secret-42 ", "test-only-Secret-42")).toBe(false);
  });
});

describe("failed sign-in limits", () => {
  const limits = {
    perVisitor: 2,
    visitorWindowMs: 1_000,
    overall: 3,
    overallWindowMs: 5_000,
  };

  it("blocks a visitor after too many failures until the window passes", () => {
    const limiter = new FailedSignInLimiter(limits);
    limiter.recordFailure("a", 0);
    expect(limiter.isBlocked("a", 0)).toBe(false);
    limiter.recordFailure("a", 0);
    expect(limiter.isBlocked("a", 0)).toBe(true);
    expect(limiter.isBlocked("b", 0)).toBe(false);
    expect(limiter.isBlocked("a", 1_000)).toBe(false);
  });

  it("blocks everyone once all visitors together fail too often", () => {
    const limiter = new FailedSignInLimiter(limits);
    limiter.recordFailure("a", 0);
    limiter.recordFailure("b", 0);
    limiter.recordFailure("c", 0);
    expect(limiter.isBlocked("d", 0)).toBe(true);
    expect(limiter.isBlocked("d", 5_000)).toBe(false);
  });
});

describe("POST /api/auth/admin", () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
  });

  it("treats every address as a visitor when no administrator is set up", async () => {
    const response = await signIn({ email: "owner@example.com", password: "anything" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ reserved: false, admin: false });
  });

  it("tells whether an address is the administrator's without a password", async () => {
    Object.assign(process.env, testAccount);
    expect(await (await signIn({ email: "OWNER@example.com" })).json()).toEqual({
      reserved: true,
      admin: false,
    });
    expect(await (await signIn({ email: "visitor@example.com" })).json()).toEqual({
      reserved: false,
      admin: false,
    });
  });

  it("signs the administrator in with the right password only", async () => {
    Object.assign(process.env, testAccount);
    const right = await signIn({
      email: "owner@example.com",
      password: "test-only-Secret-42",
    });
    expect(right.status).toBe(200);
    expect(await right.json()).toEqual({ reserved: true, admin: true });

    const wrong = await signIn({ email: "owner@example.com", password: "password123" });
    expect(wrong.status).toBe(401);
    expect(await wrong.json()).toEqual({ error: "Invalid email or password." });
  });

  it("never says anything about the password of a visitor address", async () => {
    Object.assign(process.env, testAccount);
    const response = await signIn({
      email: "visitor@example.com",
      password: "test-only-Secret-42",
    });
    expect(await response.json()).toEqual({ reserved: false, admin: false });
  });

  it("rejects other sites and malformed requests", async () => {
    Object.assign(process.env, testAccount);
    expect(
      (
        await signIn(
          { email: "owner@example.com" },
          { origin: "https://elsewhere.test" },
        )
      ).status,
    ).toBe(403);
    expect(
      (await signIn({ email: "owner@example.com" }, { origin: "http://store.test" }))
        .status,
    ).toBe(200);
    expect((await signIn("not json")).status).toBe(400);
    expect((await signIn({ email: 42 })).status).toBe(400);
    expect((await signIn({ email: "owner@example.com", password: 42 })).status).toBe(
      400,
    );
  });
});
