"use client";

import toast from "react-hot-toast";
import { persistOrGetPushNotification as persistPushSubscription } from "./persistPushNotifications";

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
  serviceWorker: ServiceWorkerRegistration | undefined
) {
  try {
    if (serviceWorker === undefined) {
      throw new Error("Service worker not registered");
    }

    const permission = await Notification.requestPermission();
    if (permission === "default" || permission === "denied") {
      throw new Error("Must allow notifications");
    }

    const subscription = await getPushSubscription(serviceWorker);
    const persistedSubscription = await persistPushSubscription(
      userId,
      JSON.parse(JSON.stringify(subscription))
    );

    console.log(persistedSubscription);
  } catch (e) {
    if (e instanceof Error) {
      toast.error(`Cannot send push notifications - ${e.message}`);
    } else {
      toast.error("Cannot send push notifications - Unknown reason");
    }
  }
}
