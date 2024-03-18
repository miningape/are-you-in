import { PrismaTransaction } from "./types";

export function getUsersWithoutRegistrationForToday(
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
      deleted_at: null,
    },
    include: {
      push_subscriptions: {
        where: {
          deleted_at: null,
        },
      },
    },
  });
}

export function setUserOutForToday(prisma: PrismaTransaction, userId: string) {
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
