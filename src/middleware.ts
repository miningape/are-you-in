import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api/auth/") ||
    request.nextUrl.pathname === "/api/jobs/auto-deny"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("appSession");
  if (token === undefined) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`
    );
  }

  return NextResponse.next();
}
