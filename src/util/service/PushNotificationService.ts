import { PrismaTransaction } from "@/app/api/jobs/types";
import { WebPush, ZodPushSubscription } from "@/webpush";
import { PushSubscription } from "@prisma/client";
import { PUSH_NOTIFICATION_GET_STATUS } from "../constants/service-worker";

export class PushNotificationService {
  private static instance: PushNotificationService | null = null;
  constructor(private prisma: PrismaTransaction, private webpush: WebPush) {}

  static get(prisma: PrismaTransaction, webpush: WebPush) {
    console.log(PushNotificationService.instance);

    if (PushNotificationService.instance === null) {
      PushNotificationService.instance = new PushNotificationService(
        prisma,
        webpush
      );
    }

    console.log(PushNotificationService.instance);

    return PushNotificationService.instance;
  }

  static destroy() {
    PushNotificationService.instance = null;
  }

  private static toZodPushSubscription(
    subscription: PushSubscription
  ): ZodPushSubscription {
    return {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys_auth,
        p256dh: subscription.keys_p256dh,
      },
    };
  }

  async push(ids: string[]) {
    console.log("ids", ids);

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    console.log("subscriptions", subscriptions);

    const responses = subscriptions
      .map(PushNotificationService.toZodPushSubscription)
      .map((subscription) => {
        console.log("sending");
        return this.webpush.sendNotificationErrorable(
          subscription,
          PUSH_NOTIFICATION_GET_STATUS
        );
      });

    responses.forEach((promise) => promise.then((r) => console.log(r)));
  }
}
