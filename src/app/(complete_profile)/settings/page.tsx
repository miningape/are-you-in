import { redirect } from "next/navigation";
import { readAuth } from "../readAuth";
import { SettingsForm } from "./SettingsForm";
import { useAuthContext } from "../AuthProvider";

export default async function Settings() {
  return <SettingsForm />;
}
