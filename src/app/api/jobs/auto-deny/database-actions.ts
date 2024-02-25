import { PrismaClient } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

function getCompaniesToAutoDeny(prisma: PrismaTransaction) {
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

function shouldAutoDeny(now: Dayjs, denyTimeString: string, timezone: string) {
  const [hour, minute] = denyTimeString.split(":");
  const denyTime = dayjs.tz(
    now.format(`YYYY-MM-DDT${hour}:${minute}:00.00`),
    timezone
  );

  return now.isAfter(denyTime);
}

function usersWithoutRegistrationForToday(
  prisma: PrismaTransaction,
  companyId: string
) {
  return prisma.user.findMany({
    where: {
      company: {
        id: companyId,
      },
      registrations: {
        none: {
          day: new Date(),
        },
      },
    },
  });
}

function setUserOutForToday(prisma: PrismaTransaction, userId: string) {
  return prisma.registration.create({
    data: {
      status: "Out",
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

function setCompanyAutoDeniedToday(
  prisma: PrismaTransaction,
  companyId: string
) {
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

export async function autoDeny(prisma: PrismaTransaction) {
  const now = dayjs();
  const companies = await getCompaniesToAutoDeny(prisma);

  for (const company of companies) {
    if (
      shouldAutoDeny(
        now,
        company.settings.auto_deny_at,
        company.settings.timezone
      )
    ) {
      const usersAwaitingStatus = await usersWithoutRegistrationForToday(
        prisma,
        company.id
      );

      for (const user of usersAwaitingStatus) {
        await setUserOutForToday(prisma, user.id);
      }

      await setCompanyAutoDeniedToday(prisma, company.id);
    }
  }
}
