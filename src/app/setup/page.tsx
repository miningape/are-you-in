import "../globals.css";

import { Form } from "./Form";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { prisma } from "@/db";
import { UserClaims } from "../UserClaims";

export default async function Home() {
  const session = await getSession();

  const res = UserClaims.safeParse(session?.user);
  if (!res.success) {
    redirect("/api/auth/logout");
  }

  const auth = await prisma.userAuthorization.findUnique({
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

  if (auth === null) {
    redirect("/api/auth/logout");
  }

  if (auth.user.company.name !== null) {
    redirect("/");
  }

  return <Form companyId={auth.user.company_id} />;
}
