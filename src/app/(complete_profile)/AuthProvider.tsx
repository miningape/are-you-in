"use client";

import {
  Company,
  PushSubscription,
  Registration,
  Settings,
  User,
  UserAuthorization,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";

export type UserFromAuth = UserAuthorization & {
  user: User & {
    company: Company & { settings: Settings };
    registrations: Registration[];
    push_subscriptions: PushSubscription[];
  };
};

const UserAuthContext = createContext<UserFromAuth | null>(null);

export function AuthProvider({
  auth,
  children,
}: {
  auth: UserFromAuth;
  children: React.ReactNode;
}) {
  return (
    <UserAuthContext.Provider value={auth}>{children}</UserAuthContext.Provider>
  );
}

export function useAuthContext() {
  const auth = useContext(UserAuthContext);
  const { push } = useRouter();

  useEffect(() => {
    if (auth === null) {
      push("/api/auth/logout");
    }
  }, []);

  return auth!;
}
