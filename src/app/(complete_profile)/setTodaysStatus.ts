"use server";

import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

export async function setTodaysStatus(userId: string, isInToday: boolean) {
  const status = isInToday ? "In" : "Out";

  await prisma.registration.create({
    data: {
      status,
      user_id: userId,
    },
  });

  revalidatePath("/");
}
