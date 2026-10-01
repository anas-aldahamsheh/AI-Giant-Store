import { NextResponse } from "next/server";

// Retrieval is computed from the browser's catalog for each chat request.
// A shared index cannot be managed safely until products and admin auth live on the server.
export async function GET() {
  return NextResponse.json({
    provider: "local-hashing-embedding",
    vectorStore: "request-scoped",
    indexedChunks: 0,
    persistent: false,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  return NextResponse.json(
    { error: "Persistent indexing requires a server catalog and administrator authentication." },
    { status: 501 },
  );
}
