import {
  ExpoNotification,
  parseExpoForegroundMessage,
} from "@cupist/notification-core";
import { Notifications } from "@shared/notification";
import { useEffect } from "react";
import { UseFCMHookBaseProps } from "./types";

export const useExpoForegroundNotification = ({
  onMessage,
  dependencies = [],
}: UseFCMHookBaseProps<typeof parseExpoForegroundMessage>) => {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const message = parseExpoForegroundMessage(
          notification as ExpoNotification,
        );
        onMessage(message);
      },
    );
    return () => subscription.remove();
  }, dependencies);
};
