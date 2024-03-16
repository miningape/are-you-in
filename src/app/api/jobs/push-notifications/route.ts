import { prisma } from "@/db";
import { pushNotifications } from "./pushNotifications";
import { authenticatedRoute } from "../authenticatedRoute";

export const GET = authenticatedRoute(async () => {
  await prisma.$transaction((prisma) => pushNotifications(prisma));
});
