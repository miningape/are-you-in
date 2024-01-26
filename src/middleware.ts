import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { getSession } from "@auth0/nextjs-auth0";

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes("/api/auth/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("appSession");
  if (token === undefined) {
    return NextResponse.redirect("http://localhost:3000/api/auth/login");
  }

  return NextResponse.next();
}
