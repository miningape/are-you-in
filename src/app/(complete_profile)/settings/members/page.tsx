"use server";

import { AddUserDialogButton } from "@/components/AddUserDialog";
import { readAuth } from "../../readAuth";
import { prisma } from "@/db";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { DeleteUserDialogButton } from "@/components/DeleteUserDialog";
import { UserTable } from "./UserTable";

export default async function Members() {
  const auth = await readAuth();

  const users = await prisma.user.findMany({
    where: {
      AND: {
        deleted_at: null,
        company: {
          id: auth!.user.company.id,
        },
      },
    },
    include: {
      authorization: true,
    },
  });

  return (
    <>
      <AddUserDialogButton className="absolute -top-0 mt-5 md:mt-16 right-0 mr-3 md:mr-5" />
      <UserTable>{users}</UserTable>
    </>
  );
}
