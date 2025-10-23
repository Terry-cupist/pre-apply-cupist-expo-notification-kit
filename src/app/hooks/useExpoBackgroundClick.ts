import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseFCMHookBaseProps } from "./types";

export const useExpoBackgroundResponse = ({
  onMessage,
  dependencies = [],
}: UseFCMHookBaseProps<typeof parseExpoNotificationResponse>) => {
  useEffect(() => {
    const subscription =
      ExpoNotificationModule.addNotificationResponseReceivedListener(
        (response) => {
          const message = parseExpoNotificationResponse(
            response as ExpoNotificationResponse,
          );
          onMessage(message);
        },
      );
    return () => subscription.remove();
  }, dependencies);
};
