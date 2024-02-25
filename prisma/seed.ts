import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

// ! Put in admin email here
const ADMIN_EMAIL = "<email>";

async function main() {
  const prisma = new PrismaClient();

  const auth = await prisma.userAuthorization.findUniqueOrThrow({
    where: {
      email: ADMIN_EMAIL,
    },
    include: {
      user: {
        include: {
          company: {
            include: {
              users: true,
            },
          },
        },
      },
    },
  });

  const { token } = await prisma.serverToken.create({
    data: {},
  });

  console.log(
    "Server API Token: ",
    token,
    `\ncurl https://localhost:3000/api/jobs/auto-deny -H 'Authorization: Bearer ${token}' -v`,
    "\nCall this api and use the `next` token for the next request"
  );

  await Promise.all(
    new Array(10).fill(undefined).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          flavour: faker.person.jobArea(),
          company: { connect: { id: auth.user.company.id } },
        },
      })
    )
  );
}

main();
