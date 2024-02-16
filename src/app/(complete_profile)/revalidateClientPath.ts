"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revalidateClientPath(
  path: string,
  type?: "page" | "layout"
) {
  revalidatePath(path, type);
  redirect(path);
}
