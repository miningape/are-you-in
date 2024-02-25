import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { assertTokenValid, extractToken } from "./authentication";
import { autoDeny } from "./database-actions";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers);
    const { token: next } = await assertTokenValid(prisma, token);

    await prisma.$transaction((prisma) => autoDeny(prisma));

    return NextResponse.json({
      next,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}
