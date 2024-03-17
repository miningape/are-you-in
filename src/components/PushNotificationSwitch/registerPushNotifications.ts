"use client";

import toast from "react-hot-toast";
import { persistOrGetPushSubscription as persistPushSubscription } from "./server-actions/persistOrGetPushSubscription";

async function getPushSubscription(serviceWorker: ServiceWorkerRegistration) {
  const subscription = await serviceWorker.pushManager.getSubscription();

  if (subscription !== null) {
    return subscription;
  }

  return serviceWorker.pushManager.subscribe({
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    userVisibleOnly: true,
  });
}

export async function registerPushNotifications(
  userId: string,
  serviceWorker: ServiceWorkerRegistration
) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "default" || permission === "denied") {
      throw new Error("Must allow notifications");
    }

    const subscription = await getPushSubscription(serviceWorker);
    return persistPushSubscription(
      userId,
      JSON.parse(JSON.stringify(subscription))
    );
  } catch (e) {
    if (e instanceof Error) {
      toast.error(`Cannot send push notifications - ${e.message}`);
    } else {
      toast.error("Cannot send push notifications - Unknown reason");
    }
  }
}
