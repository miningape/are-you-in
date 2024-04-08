import { prisma } from "@/db";
import { pushNotifications } from "./pushNotifications";
import { authenticatedRoute } from "../authenticatedRoute";

export const dynamic = "force-dynamic";

export const GET = authenticatedRoute(async () => {
  await pushNotifications(prisma);
});
