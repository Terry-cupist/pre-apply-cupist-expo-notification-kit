import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseFCMHookBaseProps } from "./types";

export const useExpoQuitResponse = ({
  onMessage,
  dependencies = [],
}: UseFCMHookBaseProps<typeof parseExpoNotificationResponse>) => {
  useEffect(() => {
    (async () => {
      const response =
        await ExpoNotificationModule.getLastNotificationResponseAsync();
      if (response) {
        const message = parseExpoNotificationResponse(
          response as ExpoNotificationResponse,
        );
        onMessage(message);
      }
    })();
  }, dependencies);
};
