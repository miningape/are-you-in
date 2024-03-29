import Link from "next/link";
import { readAuth } from "../readAuth";

import { prisma } from "@/db";
import { FaGear } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { TodayStatusTable } from "./TodayStatusTable";

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
        <span className="absolute top-0 left-0 m-5 w-20 h-20 text-5xl font-extralight hover:text-slate-400">
          &lt;
        </span>
      </Link>
      <Link
        className="absolute bottom-0 right-0 m-5 text-xl hover:text-slate-400"
        href="/settings"
      >
        {auth?.user.company.name} <FaGear className="inline pb-1 text-3xl" />
      </Link>

      <div className="flex flex-col h-dvh mx-5 justify-center">
        {/*eslint-disable-next-line react/no-unescaped-entities*/}
        <div className="mx-auto mb-5 text-3xl">Here's who's in today</div>
        <div className="mx-auto w-full md:w-3/4 md:h-3/4 overflow-scroll">
          <TodayStatusTable users={users} className="max-h-[44rem]" />
        </div>
      </div>
    </>
  );
}
