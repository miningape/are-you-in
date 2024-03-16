import { NextRequest, NextResponse } from "next/server";
import { AuthorizationError, extractToken } from "./authentication";

export function authenticatedRoute(
  handler: (request: NextRequest) => Promise<void> | void
) {
  return async function (request: NextRequest) {
    try {
      const token = extractToken(request.headers);

      if (token !== process.env.CRON_API_KEY) {
        throw new AuthorizationError();
      }

      await handler(request);

      return NextResponse.json({
        ok: true,
      });
    } catch (e) {
      if (e instanceof AuthorizationError) {
        return NextResponse.json(
          {
            error: "Unauthorized",
          },
          {
            status: 401,
          }
        );
      }

      console.error(e);
      return NextResponse.json(
        {
          error: "Unknown",
        },
        {
          status: 500,
        }
      );
    }
  };
}
