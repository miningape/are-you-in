import { NextRequest, NextResponse } from "next/server";
import { readAuth } from "../../readAuth";
import { setTodaysStatus } from "../../setTodaysStatus";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auth = await readAuth();

  const status = searchParams.get("status")?.toLowerCase();

  if (status === undefined) {
    return NextResponse.json({ error: "No status" }, { status: 400 });
  }

  if (status === "in" || status === "out") {
    await setTodaysStatus(auth.user.id, status === "in");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  return NextResponse.json({ error: "Bad status" }, { status: 400 });
}
