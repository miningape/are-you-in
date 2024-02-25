"use client";

import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
  User as UserComponent,
  Chip,
} from "@nextui-org/react";
import { Registration, User, UserAuthorization } from "@prisma/client";

interface TodayStatusTableProps {
  className?: string;
  users: (User & {
    authorization: UserAuthorization | null;
    registrations: Registration[];
  })[];
}

export function TodayStatusTable({ users, className }: TodayStatusTableProps) {
  console.log(users);
  return (
    <Table hideHeader {...{ className }}>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody className="overflow-scroll">
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <UserComponent
                name={user.name}
                description={user.authorization?.email}
                avatarProps={{
                  radius: "sm",
                  src: user.picture_url ?? undefined,
                }}
              />
            </TableCell>
            <TableCell>
              <Chip
                className="capitalize"
                color={
                  user.registrations[0] === undefined
                    ? "warning"
                    : user.registrations[0]?.status === "In"
                    ? "success"
                    : "danger"
                }
                variant="flat"
              >
                {user.registrations[0]?.status ?? "Not registered"} Today
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
