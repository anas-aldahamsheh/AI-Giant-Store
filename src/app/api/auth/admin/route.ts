import { NextResponse } from "next/server";
import {
  FailedSignInLimiter,
  normalizeEmail,
  passwordMatches,
  readAdminAccount,
} from "@/features/auth/server/admin-sign-in";

// Administrator sign-in. Visitor accounts stay in the browser; only the administrator's
// password is checked here, against ADMIN_EMAIL and ADMIN_PASSWORD on the server.
//   { email }            -> { reserved }         is this the administrator's address?
//   { email, password }  -> { reserved, admin }  401 when the password is wrong
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const failedSignIns = new FailedSignInLimiter();
const failureDelayMs = 800;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  // Behind a reverse proxy request.url carries the internal address, so compare
  // against the host the browser actually asked for.
  const hosts = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    new URL(request.url).host,
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.split(",")[0].trim().toLowerCase());
  return hosts.includes(originHost);
}

function visitorId(request: Request) {
  // Forwarded headers are client controlled unless a trusted proxy is configured. Cloudflare
  // sets CF-Connecting-IP itself, so it is preferred over the first X-Forwarded-For entry.
  if (process.env.TRUST_PROXY_IP_HEADERS !== "true") return "shared";
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "shared"
  );
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Cross-site request rejected." }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  if (typeof email !== "string" || email.length > 254)
    return json({ error: "Invalid request." }, 400);
  if (
    password !== undefined &&
    (typeof password !== "string" || password.length > 256)
  ) {
    return json({ error: "Invalid request." }, 400);
  }

  const account = readAdminAccount();
  const reserved = account !== null && normalizeEmail(email) === account.email;
  if (!reserved || password === undefined) return json({ reserved, admin: false });

  const visitor = visitorId(request);
  if (failedSignIns.isBlocked(visitor)) {
    return json({ error: "Too many sign-in attempts. Please try again later." }, 429);
  }
  if (passwordMatches(password, account.password))
    return json({ reserved: true, admin: true });

  failedSignIns.recordFailure(visitor);
  await new Promise((resolve) => setTimeout(resolve, failureDelayMs));
  return json({ error: "Invalid email or password." }, 401);
}
