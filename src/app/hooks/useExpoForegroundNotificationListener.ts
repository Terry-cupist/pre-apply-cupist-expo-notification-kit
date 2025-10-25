import {
  ExpoNotification,
  parseExpoForegroundMessage,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";

type UseExpoForegroundNotificationListenerProps = UseFCMHookBaseProps & {
  onNotification: UseExpoHookCallbackType<typeof parseExpoForegroundMessage>;
};

export const useExpoForegroundNotificationListener = ({
  onNotification,
  dependencies = [],
}: UseExpoForegroundNotificationListenerProps) => {
  useEffect(() => {
    const subscription = ExpoNotificationModule.addNotificationReceivedListener(
      (notification) => {
        const message = parseExpoForegroundMessage(
          notification as ExpoNotification,
        );
        onNotification(message);
      },
    );
    return () => subscription.remove();
  }, dependencies);
};
