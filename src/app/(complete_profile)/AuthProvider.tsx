"use client";

import {
  Company,
  Registration,
  Settings,
  User,
  UserAuthorization,
} from "@prisma/client";
import React, { createContext, useContext } from "react";

export type UserFromAuth = UserAuthorization & {
  user: User & {
    company: Company & { settings: Settings };
    registrations: Registration[];
  };
};

const UserAuthContext = createContext<UserFromAuth>({
  email: "fake@fake.com",
  id: "fake_auth_id_123",
  user_id: "fake_user_id_123",
  user: {
    id: "fake_user_id_123",
    name: "Fake User",
    picture_url: "https://fake.com/user.jpg",
    username: "faker",
    company_id: "fake_company_id_123",
    company: {
      id: "fake_company_id_123",
      name: "Fake Company",
      picture_url: "https://fake.com/company.jpg",
      settings_id: "fake_settings_id_123",
      settings: {
        id: "fake_settings_id_123",
        auto_deny_at: "09:00",
        push_notifications_at: "10:00",
      },
    },
    registrations: [],
  },
});

export function AuthProvider({
  auth,
  children,
}: {
  auth: UserFromAuth;
  children: React.JSX.Element;
}) {
  return (
    <UserAuthContext.Provider value={auth}>{children}</UserAuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(UserAuthContext);
