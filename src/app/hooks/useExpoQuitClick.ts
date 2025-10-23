import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
} from "@cupist/notification-core";
import { Notifications } from "@shared/notification";
import { useEffect } from "react";
import { UseFCMHookBaseProps } from "./types";

export const useExpoQuitResponse = ({
  onMessage,
  dependencies = [],
}: UseFCMHookBaseProps<typeof parseExpoNotificationResponse>) => {
  useEffect(() => {
    (async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      const message = parseExpoNotificationResponse(
        response as ExpoNotificationResponse,
      );
      onMessage(message);
    })();
  }, dependencies);
};
