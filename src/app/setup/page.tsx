import "../globals.css";

import { Form } from "./Form";
import { redirect } from "next/navigation";
import { readAuth } from "../(complete_profile)/readAuth";

export default async function Home() {
  const auth = await readAuth();
  if (auth === null) {
    redirect("/api/auth/logout");
  }

  if (auth.user.company.name !== null) {
    redirect("/");
  }

  return <Form companyId={auth.user.company_id} />;
}
