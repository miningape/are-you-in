"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useAuthContext } from "./AuthProvider";
import { FaBackward, FaGear } from "react-icons/fa6";
import dayjs from "dayjs";
import { GoGear } from "react-icons/go";
import { HTMLAttributes, useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
import { setTodaysStatus } from "./setTodaysStatus";

function CurrentTime({ ...rest }: {} & HTMLAttributes<HTMLSpanElement>) {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <span {...rest} suppressHydrationWarning>
      {time.format("DD/MM/YYYY HH:mm:ss")}
    </span>
  );
}

export default function Home() {
  const auth = useAuthContext();
  const updateStatus = (status: boolean) =>
    (auth.user.registrations[0]?.status === "In") !== status && // only update if there is a difference
    setTodaysStatus(auth.user_id, status);

  return (
    <>
      <CurrentTime className="absolute top-0 left-0 m-5 pt-3 text-lg font-mono" />
      <Link
        className="absolute bottom-0 right-0 m-5 text-xl hover:text-slate-400"
        href="/settings"
      >
        {auth.user.company.name} <FaGear className="inline pb-1 text-3xl" />
      </Link>
      <Link href="/overview">
        <span className="absolute top-0 right-0 m-5 w-20 h-20 text-5xl font-extralight hover:text-slate-400">
          &gt;
        </span>
      </Link>

      <div className="flex flex-col h-dvh mx-5 my-auto justify-center">
        <span className="text-5xl text-center">Are You In?</span>
        <div className="flex justify-center gap-24 text-2xl pt-5 ">
          <span
            className={
              "hover:cursor-pointer p-2 rounded-xl border-2 " +
              (auth.user.registrations[0]?.status === "In"
                ? "border-slate-200"
                : "border-slate-900 hover:border-slate-400")
            }
            onClick={() => updateStatus(true)}
          >
            ✅ Yes
          </span>
          <span
            className={
              "hover:cursor-pointer p-2 rounded-xl border-2 " +
              (auth.user.registrations[0]?.status === "Out"
                ? "border-slate-200"
                : "border-slate-900 hover:border-slate-400")
            }
            onClick={() => updateStatus(false)}
          >
            ❌ No
          </span>
        </div>
      </div>
    </>
  );
}
