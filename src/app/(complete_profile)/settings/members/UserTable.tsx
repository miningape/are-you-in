"use client";

import { DeleteUserDialogButton } from "@/components/DeleteUserDialog";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  User,
  Tooltip,
} from "@nextui-org/react";
import { User as UserI, UserAuthorization } from "@prisma/client";

interface UserTableProps {
  children: (UserI & { authorization: UserAuthorization | null })[];
}

export function UserTable({ children: users }: UserTableProps) {
  return (
    <Table className="max-h-[44rem]">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Role</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <User
                name={user.name}
                description={user.authorization?.email}
                avatarProps={{
                  radius: "sm",
                  src: user.picture_url ?? undefined,
                }}
              />
            </TableCell>
            <TableCell>{user.flavour || "Not Available"}</TableCell>
            <TableCell>
              <Chip
                className="capitalize"
                color={user.authorization !== null ? "success" : "danger"}
                variant="flat"
              >
                {user.authorization !== null ? "active" : "inactive"}
              </Chip>
            </TableCell>
            <TableCell>
              <Tooltip color="danger" content="Delete User">
                <DeleteUserDialogButton
                  userId={user.id}
                  name={user.name ?? undefined}
                >
                  <TrashIcon className="w-6 text-danger-300 hover:cursor-pointer" />
                </DeleteUserDialogButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
