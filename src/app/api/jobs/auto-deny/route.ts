import { prisma } from "@/db";
import { autoDeny } from "./autoDeny";
import { authenticatedRoute } from "../authenticatedRoute";

export const dynamic = "force-dynamic";

export const GET = authenticatedRoute(async () => {
  await autoDeny(prisma);
});
