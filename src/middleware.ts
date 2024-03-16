import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/service-worker.js") {
    return NextResponse.next({
      headers: {
        "Service-Worker-Allowed": "/",
      },
    });
  }

  if (
    request.nextUrl.pathname.startsWith("/api/auth/") ||
    request.nextUrl.pathname === "/api/jobs/auto-deny" ||
    request.nextUrl.pathname === "/api/jobs/push-notifications" ||
    request.nextUrl.pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("appSession");
  if (token === undefined) {
    return NextResponse.redirect(
      `${process.env.AUTH0_BASE_URL}/api/auth/login`
    );
  }

  return NextResponse.next();
}
