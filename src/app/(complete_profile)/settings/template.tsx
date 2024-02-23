"use client";

import React from "react";
import { readAuth } from "../readAuth";
import { useAuthContext } from "../AuthProvider";
import { notFound, usePathname } from "next/navigation";
import Link from "next/link";

function SettingsNavTitle({
  href,
  children,
}: {
  href: string;
  children: React.JSX.Element | string;
}) {
  const path = usePathname();

  return (
    <Link href={href}>
      <span className={path === href ? "underline" : ""}>{children}</span>
    </Link>
  );
}

export default function Template({
  children,
}: {
  children: React.JSX.Element;
}) {
  const auth = useAuthContext();
  const path = usePathname();

  if (!path.includes("/settings")) {
    notFound();
  }

  return (
    <div className="flex flex-col m-5">
      <Link href="/" className="text-3xl mb-7">
        <span>{auth.user.company.name}</span>
      </Link>
      <div className="flex flex-row text-xl gap-5 ml-10">
        <SettingsNavTitle href="/settings">General</SettingsNavTitle>
        <SettingsNavTitle href="/settings/members">Members</SettingsNavTitle>
        <SettingsNavTitle href={`/settings/${auth.user.id}`}>
          {auth.user.name ?? auth.email ?? "Myself"}
        </SettingsNavTitle>
      </div>
      <div className="ml-10">{children}</div>
    </div>
  );
}
