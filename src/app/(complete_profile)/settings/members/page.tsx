"use server";

import { AddUserDialogButton } from "@/components/AddUserDialog";
import { readAuth } from "../../readAuth";
import { prisma } from "@/db";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { DeleteUserDialogButton } from "@/components/DeleteUserDialog";

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

  console.log(users);

  return (
    <>
      <AddUserDialogButton>
        <div className="absolute -top-0 mt-16 right-0 mr-5 p-2 rounded-xl border-2 hover:cursor-pointer hover:bg-slate-200 hover:text-slate-800">
          Add a new member
        </div>
      </AddUserDialogButton>
      <div className="flex flex-col w-1/2 mx-auto mt-4">
        {users.map((user) => (
          <div key={user.id} className={clsx("grid grid-cols-2")}>
            <div>
              <DeleteUserDialogButton name={user.name} userId={user.id}>
                <span className="mr-1">X</span>
              </DeleteUserDialogButton>

              <span>{user.name}</span>
            </div>
            <span className="italic">
              {user.authorization?.email || "Not active"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
