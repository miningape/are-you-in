"use server";

import { prisma } from "@/db";
import { ZodPushSubscription } from "@/webpush";

export async function persistOrGetPushNotification(
  userId: string,
  subscription: any
) {
  const result = ZodPushSubscription.safeParse(subscription);

  if (!result.success) {
    throw new Error(`Bad subscription: ${result.error.message}`);
  }

  return prisma.pushSubscription.upsert({
    where: {
      endpoint_user_id: {
        endpoint: result.data.endpoint,
        user_id: userId,
      },
    },
    update: {},
    create: {
      endpoint: subscription.endpoint,
      keys_auth: subscription.keys.auth,
      keys_p256dh: subscription.keys.p256dh,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
