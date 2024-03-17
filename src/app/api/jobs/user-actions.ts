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
    },
    include: {
      push_subscriptions: true,
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
