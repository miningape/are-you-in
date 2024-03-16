import { prisma } from "@/db";
import { autoDeny } from "./autoDeny";
import { authenticatedRoute } from "../authenticatedRoute";

export const GET = authenticatedRoute(async () => {
  await prisma.$transaction((prisma) => autoDeny(prisma));
});
