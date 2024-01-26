import "../globals.css";

import { Form } from "./Form";
import { getSession } from "@auth0/nextjs-auth0";
import { UserClaims } from "../api/auth/[auth0]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

export default async function Home() {
  const session = await getSession();

  const res = UserClaims.safeParse(session?.user);
  if (!res.success) {
    redirect("/api/auth/logout");
  }

  const auth = await prisma.userAuthorization.findUniqueOrThrow({
    where: {
      email: res.data.email,
    },
    include: {
      user: {
        include: {
          company: true,
        },
      },
    },
  });

  if (auth.user.company.name !== null) {
    redirect("/");
  }

  return <Form companyId={auth.user.company_id} />;
}
