import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
} from "@cupist/notification-core";
import { expoModule } from "@shared/notification";
import { useEffect } from "react";
import { UseFCMHookBaseProps } from "./types";

export const useExpoBackgroundResponse = ({
  onMessage,
  dependencies = [],
}: UseFCMHookBaseProps<typeof parseExpoNotificationResponse>) => {
  useEffect(() => {
    const subscription = expoModule.addNotificationResponseReceivedListener(
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
