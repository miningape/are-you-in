import { PrismaClient } from "@prisma/client";

export function extractToken(headers: Headers) {
  const authorization = headers.get("Authorization");

  if (authorization === null) {
    throw new Error();
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new Error();
  }

  const [, token] = authorization.split("Bearer ");
  if (token === undefined || token === "") {
    throw new Error();
  }

  return token;
}

export async function assertTokenValid(prisma: PrismaClient, token: string) {
  const authenticated = await prisma.serverToken.findUnique({
    where: {
      token,
      used_at: null,
    },
  });

  if (authenticated === null) {
    throw new Error();
  }

  return prisma.$transaction(async (prisma) => {
    await prisma.serverToken.update({
      where: {
        id: authenticated.id,
      },
      data: {
        used_at: new Date(),
      },
    });

    return prisma.serverToken.create({
      data: {},
    });
  });
}
