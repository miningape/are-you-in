"use server";

import { PrismaTransaction } from "../types";
import { PushNotificationService } from "@/util/service/PushNotificationService";
import { webpush } from "@/webpush";
import { shouldPerform } from "../time";
import { getUsersWithoutRegistrationForToday } from "../user-actions";

async function getCompaniesToPushNotificationsTo(prisma: PrismaTransaction) {
  return prisma.company.findMany({
    where: {
      settings: {
        OR: [
          {
            last_pushed_notifications_on: null,
          },
          {
            last_pushed_notifications_on: {
              not: new Date(),
            },
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

function setCompanyPushedNotificationsToday(
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
          last_pushed_notifications_on: new Date(),
        },
      },
    },
  });
}

async function pushNotificationsToCompany(
  pushNotificationService: PushNotificationService,
  prisma: PrismaTransaction,
  companyId: string
) {
  const users = await getUsersWithoutRegistrationForToday(prisma, companyId);

  for (const user of users) {
    await pushNotificationService.push(user.push_subscriptions);
  }

  await setCompanyPushedNotificationsToday(prisma, companyId);
}

export async function pushNotifications(prisma: PrismaTransaction) {
  const pushNotificationService = new PushNotificationService(webpush, prisma);
  const companiesToPushNotificationsTo =
    await getCompaniesToPushNotificationsTo(prisma);

  for (const company of companiesToPushNotificationsTo) {
    if (shouldPerform("push_notifications_at", company.settings)) {
      await pushNotificationsToCompany(
        pushNotificationService,
        prisma,
        company.id
      );
    }
  }
}
