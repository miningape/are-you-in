import { PrismaClient } from "@prisma/client";

export class AuthorizationError extends Error {
  static AUTHORIZATION_ERROR_MESSAGE = "@AUTHORIZATION_ERROR_MESSAGE";

  constructor() {
    super(AuthorizationError.AUTHORIZATION_ERROR_MESSAGE);
  }
}

export function extractToken(headers: Headers) {
  const authorization = headers.get("Authorization");

  if (authorization === null) {
    throw new AuthorizationError();
  }

  if (!authorization.startsWith("Bearer ")) {
    throw new AuthorizationError();
  }

  const [, token] = authorization.split("Bearer ");
  if (token === undefined || token === "") {
    throw new AuthorizationError();
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
    throw new AuthorizationError();
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
