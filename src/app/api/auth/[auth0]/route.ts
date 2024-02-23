import { Session, handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { UserClaims } from "@/app/UserClaims";

export const GET = handleAuth({
  callback: handleCallback({
    afterCallback: async (req: NextRequest, session: Session) => {
      let user = UserClaims.parse(session.user);

      await prisma.userAuthorization.upsert({
        where: {
          email: user.email,
        },
        update: {},
        create: {
          email: user.email,
          user: {
            create: {
              name: user.given_name + " " + user.family_name,
              company: {
                create: {
                  settings: {
                    create: {
                      auto_deny_at: "9:00",
                      push_notifications_at: "10:00",
                    },
                  },
                },
              },
            },
          },
        },
      });

      return session;
    },
  }),
});
