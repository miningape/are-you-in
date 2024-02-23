import Link from "next/link";
import { readAuth } from "../readAuth";

import { prisma } from "@/db";
import { FaGear } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";

function ColorAvatar({ text }: { text: string }) {
  return (
    <span className="text-center text-lg p-1 bg-rose-500 border-2 rounded-full font-mono">
      {text}
    </span>
  );
}

export default async function Overview() {
  const auth = await readAuth();

  const users = await prisma.user.findMany({
    where: {
      company: {
        id: auth?.user.company.id,
      },
    },
    include: {
      authorization: true,
      registrations: {
        where: {
          day: new Date(),
        },
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
  });

  return (
    <>
      <Link href="/">
        <span className="absolute top-0 left-0 m-5 w-20 h-20 text-5xl font-extralight">
          &lt;
        </span>
      </Link>
      <Link
        className="absolute bottom-0 right-0 m-5 text-xl hover:text-slate-400"
        href="/settings"
      >
        {auth?.user.company.name} <FaGear className="inline pb-1 text-3xl" />
      </Link>
      <a
        className="absolute bottom-0 left-0 m-5 hover:cursor-pointer hover:text-slate-400"
        href="/api/auth/logout"
      >
        <CiLogout className="inline text-3xl pb-1" />
        <span className="ml-2 text-xl">{auth?.user.name}</span>
      </a>

      <div className="flex  h-dvh mx-5  justify-center">
        <div className="flex-col my-auto">
          {/*eslint-disable-next-line react/no-unescaped-entities*/}
          <div className="m-5 text-3xl">Here's who is in today</div>

          {users.map((user) => (
            <div key={user.id} className="flex justify-between pb-4">
              <div>
                {user.picture_url ?? (
                  <ColorAvatar
                    text={(user.name ?? user.authorization?.email ?? "Unknown")
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  />
                )}
                <span className="text-right ml-1">{user.name}</span>
              </div>

              <div>{user.registrations[0]?.status ?? "Not registered"}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
