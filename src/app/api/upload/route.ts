import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "File uploads are unavailable until storage and authentication are configured." },
    { status: 501 },
  );
}
