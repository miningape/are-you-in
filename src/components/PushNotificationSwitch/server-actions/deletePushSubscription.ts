"use server";

import { prisma } from "@/db";

export async function deletePushSubscription(id: string) {
  return prisma.pushSubscription.update({
    where: {
      id,
    },
    data: {
      deleted_at: new Date(),
    },
  });
}
