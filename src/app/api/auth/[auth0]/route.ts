import {
  AppRouteHandlerFnContext,
  Session,
  handleAuth,
  handleCallback,
  handleLogin,
} from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import { create } from "domain";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/db";

export const UserClaims = z.object({
  given_name: z.string(),
  family_name: z.string(),
  nickname: z.string(),
  picture: z.string(),
  email: z.string(),
});

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
              username: user.nickname,
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
