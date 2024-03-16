"use server";

import * as dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { PrismaTransaction } from "../types";
import { PushNotificationService } from "@/util/service/PushNotificationService";
import { webpush } from "@/webpush";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

export async function pushNotifications(prisma: PrismaTransaction) {
  console.log(webpush);
  const pushNotificationService = new PushNotificationService(prisma, webpush);

  await pushNotificationService.push(["af947048-d27f-4042-afe9-7f0740e4c232"]);

  console.log("notifications pushed");
}
