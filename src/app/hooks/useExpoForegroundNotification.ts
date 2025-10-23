import {
  ExpoNotification,
  parseExpoForegroundMessage,
} from "@cupist/notification-core";
import { expoModule } from "@shared/notification";
import { useEffect } from "react";
import { UseFCMHookBaseProps } from "./types";

export const useExpoForegroundNotification = ({
  onMessage,
  dependencies = [],
}: UseFCMHookBaseProps<typeof parseExpoForegroundMessage>) => {
  useEffect(() => {
    const subscription = expoModule.addNotificationReceivedListener(
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
