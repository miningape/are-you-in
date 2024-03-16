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

const ServiceWorkerContext = createContext<
  ServiceWorkerRegistration | undefined
>(undefined);

export const useServiceWorker = () => useContext(ServiceWorkerContext);

export function ServiceWorker({ children }: { children: ReactNode }) {
  const [serviceWorker, setServiceWorker] = useState<
    ServiceWorkerRegistration | undefined
  >(undefined);

  useEffect(() => {
    if ("serviceWorker" in navigator && window.serwist !== undefined) {
      window.serwist
        .register()
        .then((serviceWorker) => setServiceWorker(serviceWorker));
    }
  }, []);

  return (
    <ServiceWorkerContext.Provider value={serviceWorker}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}
