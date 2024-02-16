import { readAuth } from "../../readAuth";
import { prisma } from "@/db";

export default async function Members() {
  const auth = await readAuth();

  const users = await prisma.user.findMany({
    where: {
      company: {
        id: auth!.user.company.id,
      },
    },
    include: {
      authorization: true,
    },
  });

  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <div key={user.id} className="flex flex-row gap-3">
          <span>{user.name}</span>
          <span className="italic">
            {user.authorization?.email || "Not active"}
          </span>
        </div>
      ))}
    </div>
  );
}
