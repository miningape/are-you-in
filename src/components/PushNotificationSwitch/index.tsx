"use client";

import { useAuthContext } from "@/app/(complete_profile)/AuthProvider";
import { useServiceWorker } from "@/app/RegisterPwa";
import { useRelativeWideSpinner } from "@/hooks/useSpinner";
import { Switch, SwitchProps, Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import { useMemo } from "react";
import { registerPushNotifications } from "./registerPushNotifications";
import { deletePushSubscription } from "./server-actions/deletePushSubscription";
import { revalidateClientPath } from "@/app/(complete_profile)/revalidateClientPath";

function PushNotificationSwitchComponent(props: SwitchProps) {
  return (
    <Switch
      {...props}
      classNames={{
        base: clsx(
          "group",
          "inline-flex flex-row-reverse w-full max-w-full bg-content2 hover:bg-content3 items-center",
          "justify-between cursor-pointer rounded-xl gap-2 p-2 border-2 border-transparent"
        ),
        wrapper: clsx("bg-content3 group-hover:bg-content4"),
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-medium">Push Notifications</p>
        <p className="text-tiny text-default-400">For this device</p>
      </div>
    </Switch>
  );
}

export function PushNotificationSwitch() {
  const auth = useAuthContext();
  const { Spinner, loading, setLoading } = useRelativeWideSpinner();
  const { serviceWorker, pushSubscription, refetchPushSubscription } =
    useServiceWorker();

  const persistedPushSubscription = useMemo(
    () =>
      auth.user.push_subscriptions.find(
        (subscription) => subscription.endpoint === pushSubscription?.endpoint
      ),
    [auth.user.push_subscriptions, pushSubscription?.endpoint]
  );

  if (serviceWorker === undefined) {
    return (
      <Tooltip content="Disabled because there is no service worker">
        <div>
          <PushNotificationSwitchComponent isDisabled />
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="relative">
      <Spinner />
      <PushNotificationSwitchComponent
        disabled={loading}
        isSelected={persistedPushSubscription !== undefined}
        onValueChange={async (shouldEnablePushNotifications) => {
          setLoading(true);

          if (shouldEnablePushNotifications) {
            await registerPushNotifications(auth.user.id, serviceWorker);
          } else {
            // should disable push notifications
            if (pushSubscription !== undefined) {
              await pushSubscription.unsubscribe();
            }

            if (persistedPushSubscription !== undefined) {
              await deletePushSubscription(persistedPushSubscription.id);
            }
          }

          await refetchPushSubscription();
          await revalidateClientPath(`/settings/${auth.user.id}`, "layout");
          setLoading(false);
        }}
      />
    </div>
  );
}
