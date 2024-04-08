import { WebPush, ZodPushSubscription } from "@/webpush";
import { PrismaClient, PushSubscription } from "@prisma/client";
import { PUSH_NOTIFICATION_GET_STATUS } from "../constants/service-worker";
import { WebPushError } from "web-push";

export class PushNotificationService {
  constructor(private webpush: WebPush, private prisma: PrismaClient) {}

  private static toZodPushSubscription(
    subscription: Pick<
      PushSubscription,
      "endpoint" | "keys_auth" | "keys_p256dh"
    >
  ): ZodPushSubscription {
    return {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys_auth,
        p256dh: subscription.keys_p256dh,
      },
    };
  }

  private deletePushSubscription(id: string) {
    return this.prisma.pushSubscription.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async push(subscriptions: PushSubscription[]) {
    for (const subscription of subscriptions) {
      const zodSubscription =
        PushNotificationService.toZodPushSubscription(subscription);

      try {
        await this.webpush.sendNotificationErrorable(
          zodSubscription,
          PUSH_NOTIFICATION_GET_STATUS
        );
      } catch (e) {
        if (e instanceof WebPushError) {
          if (e.statusCode === 410) {
            // Unsubscribed / dead subscription
            await this.deletePushSubscription(subscription.id);
          }
        }

        console.error(`Failed to push subscription: "${subscription.id}"`, e);
      }
    }
  }
}
