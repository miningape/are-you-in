"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Serwist } from "@serwist/window";

declare global {
  interface Window {
    serwist: Serwist;
  }
}

const ServiceWorkerContext = createContext<{
  serviceWorker?: ServiceWorkerRegistration;
  pushSubscription?: PushSubscription;
  refetchPushSubscription: () => Promise<void>;
}>({ refetchPushSubscription: async () => {} });

export const useServiceWorker = () => useContext(ServiceWorkerContext);

export function ServiceWorker({ children }: { children: ReactNode }) {
  const [serviceWorker, setServiceWorker] = useState<
    ServiceWorkerRegistration | undefined
  >(undefined);
  const [pushSubscription, setPushSubscription] = useState<
    PushSubscription | undefined
  >(undefined);

  async function refetchPushSubscription() {
    if (serviceWorker !== undefined) {
      const subscription = await serviceWorker.pushManager.getSubscription();
      setPushSubscription(subscription ?? undefined);
    } else {
      setPushSubscription(undefined);
    }
  }

  useEffect(() => {
    if ("serviceWorker" in navigator && window.serwist !== undefined) {
      window.serwist.register().then((serviceWorker) => {
        setServiceWorker(serviceWorker);
      });
    }
  }, []);

  useEffect(() => {
    refetchPushSubscription();
  }, [serviceWorker]);

  return (
    <ServiceWorkerContext.Provider
      value={{
        serviceWorker,
        pushSubscription,
        refetchPushSubscription,
      }}
    >
      {children}
    </ServiceWorkerContext.Provider>
  );
}
