"use server";

import { prisma } from "@/db";

interface UpdateUserDto {
  name?: string;
  flavour?: string;
}

export async function updateUser(id: string, { name, flavour }: UpdateUserDto) {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      flavour,
    },
  });
}
