import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "demo",
    timestamp: new Date().toISOString(),
    services: {
      api: "up",
      database: "not_configured",
      cache: "not_configured",
      payments: "not_configured",
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
