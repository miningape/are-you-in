"use server";

import { prisma } from "@/db";
import { User, UserAuthorization } from "@prisma/client";
import { UserInAnotherCompanyError } from "./UserInAnotherCompanyError";

// async function createUserInAuth0(email: string): string {}
// async function getAuth0InviteUrl(userId: string): string {}

async function sendInviteEmail(
  email: string,
  inviteUrl: string
): Promise<void> {}

async function createOrGetUserEntry(
  email: string,
  companyId: string
): Promise<UserAuthorization & { user: User }> {
  const auth = await prisma.userAuthorization.findUnique({
    where: {
      email,
    },
    include: {
      user: true,
    },
  });

  if (auth === null) {
    return prisma.userAuthorization.create({
      data: {
        email,
        user: {
          create: {
            company: {
              connect: {
                id: companyId,
              },
            },
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  if (auth.user.company_id !== companyId) {
    throw new UserInAnotherCompanyError();
  }

  return auth;
}

export async function inviteUser(email: string, companyId: string) {
  const auth = await createOrGetUserEntry(email, companyId);

  //   const auth0UserId = await createUserInAuth0(auth.email);
  //   const inviteUrl = await getAuth0InviteUrl(auth0UserId);

  await sendInviteEmail(auth.email, "");
}
