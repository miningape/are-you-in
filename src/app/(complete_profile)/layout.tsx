import "../globals.css";

import type { Metadata } from "next";
import "../globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { AuthProvider } from "./AuthProvider";
import { readAuth } from "./readAuth";
import { CiLogout } from "react-icons/ci";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await readAuth();
  if (auth.user.company.name === null) {
    redirect("/setup");
  }

  return (
    <UserProvider>
      <AuthProvider auth={auth}>
        <a
          className="absolute bottom-0 left-0 m-5 hover:cursor-pointer hover:text-slate-400"
          href="/api/auth/logout"
        >
          <CiLogout className="inline text-3xl pb-1" />
          <span className="ml-2 text-xl">Log out</span>
        </a>
        {children}
      </AuthProvider>
    </UserProvider>
  );
}
