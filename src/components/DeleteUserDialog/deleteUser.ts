"use server";

import { prisma } from "@/db";

export async function deleteUser(userId: string) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      deleted_at: new Date(),
    },
    include: {
      authorization: true,
    },
  });

  if (user.authorization !== null) {
    await prisma.userAuthorization.delete({
      where: {
        id: user.authorization.id,
      },
    });
  }
}
