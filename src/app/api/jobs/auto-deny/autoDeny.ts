"use server";

import {
  getUsersWithoutRegistrationForToday,
  setUserOutForToday,
} from "../user-actions";
import { shouldPerform } from "../time";
import { PrismaClient } from "@prisma/client";

function getCompaniesToAutoDeny(prisma: PrismaClient) {
  return prisma.company.findMany({
    where: {
      settings: {
        OR: [
          {
            last_denied_on: {
              not: new Date(),
            },
          },
          {
            last_denied_on: null,
          },
        ],
      },
      users: {
        some: {
          registrations: {
            none: {
              day: new Date(),
            },
          },
        },
      },
    },
    include: {
      settings: true,
    },
  });
}

function setCompanyAutoDeniedToday(prisma: PrismaClient, companyId: string) {
  return prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      settings: {
        update: {
          last_denied_on: new Date(),
        },
      },
    },
  });
}

async function autoDenyCompany(prisma: PrismaClient, companyId: string) {
  const usersAwaitingStatus = await getUsersWithoutRegistrationForToday(
    prisma,
    companyId
  );

  for (const user of usersAwaitingStatus) {
    await setUserOutForToday(prisma, user.id);
  }

  await setCompanyAutoDeniedToday(prisma, companyId);
}

export async function autoDeny(prisma: PrismaClient) {
  const companies = await getCompaniesToAutoDeny(prisma);

  for (const company of companies) {
    if (shouldPerform("auto_deny_at", company.settings)) {
      await autoDenyCompany(prisma, company.id);
    }
  }
}
