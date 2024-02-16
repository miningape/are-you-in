import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

const prisma = new PrismaClient();
const coreEmail = "miningape@gmail.com";

async function main() {
  const auth = await prisma.userAuthorization.findUniqueOrThrow({
    where: {
      email: coreEmail,
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

  await Promise.all(
    auth.user.company.users.map((user, i) =>
      prisma.registration.create({
        data: {
          status: i % 2 === 0 ? "In" : "Out",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    )
  );

  //   await Promise.all(
  //     new Array(10).fill(undefined).map(() =>
  //       prisma.user.create({
  //         data: {
  //           name: faker.person.fullName(),
  //           username:
  //             faker.person.jobTitle().split(" ").pop() +
  //             faker.person.zodiacSign(),
  //           company: { connect: { id: auth.user.company.id } },
  //         },
  //       })
  //     )
  //   ).then((users) =>
  //     users.map((user, j) =>
  //       Promise.all(
  //         new Array(10).fill(undefined).map((_, i) =>
  //           prisma.registration.create({
  //             data: {
  //               user: {
  //                 connect: {
  //                   id: user.id,
  //                 },
  //               },
  //               status: (i + j) % 2 === 0 ? "In" : "Out",
  //               day: dayjs().subtract(i, "days").toDate(),
  //               created_at: dayjs().subtract(i, "days").toDate(),
  //             },
  //           })
  //         )
  //       )
  //     )
  //   );
}

main();
