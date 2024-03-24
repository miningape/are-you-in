import { PrecacheEntry } from "@serwist/precaching";
import type { RuntimeCaching } from "@serwist/build";
import { installSerwist, registerRuntimeCaching } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your `injectionPoint`.
  // `injectionPoint` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const ACTIONS = {
  yes: "yes",
  no: "no",
} as const;

self.addEventListener("push", async (e) => {
  const text = e.data?.text();

  if (text !== "PUSH_NOTIFICATION_GET_STATUS") {
    return;
  }

  await self.registration.showNotification("Are you in today?", {
    actions: [
      {
        action: ACTIONS.yes,
        title: "👍 Yes",
      },
      {
        action: ACTIONS.no,
        title: "👎 No",
      },
    ],
  });
});

const ACTION_TO_URL: Record<keyof typeof ACTIONS, string> = {
  [ACTIONS.yes]: "/set/today?status=in",
  [ACTIONS.no]: "/set/today?status=out",
};

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    (async () => {
      if (e.action in ACTIONS) {
        const url = ACTION_TO_URL[e.action as keyof typeof ACTIONS];
        await fetch(url, {
          credentials: "include",
        });
      }
    })()
  );
});

const httpMethods = ["GET", "DELETE", "HEAD", "PATCH", "POST", "PUT"] as const;
registerRuntimeCaching(
  ...httpMethods.map(
    (method): RuntimeCaching => ({
      method,
      handler: "NetworkOnly",
      urlPattern: /.*/g,
    })
  )
);

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  disableDevLogs: true,
});
