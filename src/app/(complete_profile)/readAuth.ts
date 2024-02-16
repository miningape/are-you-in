"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { UserClaims } from "../UserClaims";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

export async function readAuth() {
  const session = await getSession();

  const res = UserClaims.safeParse(session?.user);
  if (!res.success) {
    redirect("/api/auth/logout");
  }

  return prisma.userAuthorization.findUnique({
    where: {
      email: res.data.email,
    },
    include: {
      user: {
        include: {
          company: {
            include: {
              settings: true,
            },
          },
          registrations: {
            where: {
              day: new Date(),
            },
            orderBy: {
              created_at: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });
}
