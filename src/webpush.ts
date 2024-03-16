import { sendNotification, RequestOptions } from "web-push";
import { z } from "zod";

export const ZodPushSubscription = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type ZodPushSubscription = z.infer<typeof ZodPushSubscription>;

const VapidDetails = z.object({
  subject: z.string(),
  publicKey: z.string(),
  privateKey: z.string(),
});

type VapidDetails = z.infer<typeof VapidDetails>;

export class WebPush {
  private vapidDetails: VapidDetails;
  private useable = false;

  constructor(subject: any, publicKey: any, privateKey: any) {
    this.vapidDetails = {
      subject,
      publicKey,
      privateKey,
    };

    const result = VapidDetails.safeParse(this.vapidDetails);

    if (!result.success) {
      console.error("Vapid details not set");
    }

    this.useable = result.success;
  }

  sendNotificationErrorable(
    subscription: ZodPushSubscription,
    payload: string,
    options?: Omit<RequestOptions, "vapidDetails">
  ) {
    if (!this.useable) {
      throw new Error("Vapid details not set");
    }

    return sendNotification(subscription, payload, {
      ...options,
      vapidDetails: this.vapidDetails,
    });
  }

  sendNotification(
    subscription: ZodPushSubscription,
    payload: string,
    options?: Omit<RequestOptions, "vapidDetails">
  ) {
    if (!this.useable) {
      console.error("Vapid details not set");
      return;
    }

    return sendNotification(subscription, payload, {
      ...options,
      vapidDetails: this.vapidDetails,
    });
  }
}

const webPushSingleton = () => {
  return new WebPush(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
};

declare global {
  var webpush: undefined | ReturnType<typeof webPushSingleton>;
}

export const webpush = globalThis.webpush ?? webPushSingleton();

if (process.env.NODE_ENV !== "production") globalThis.webpush = webpush;
