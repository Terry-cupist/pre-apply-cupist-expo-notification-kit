import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";

export const useExpoQuitClickListener = ({
  onResponse,
  dependencies = [],
}: UseFCMHookBaseProps & {
  onResponse: UseExpoHookCallbackType<typeof parseExpoNotificationResponse>;
}) => {
  useEffect(() => {
    (async () => {
      const response =
        await ExpoNotificationModule.getLastNotificationResponseAsync();
      if (response) {
        const message = parseExpoNotificationResponse(
          response as ExpoNotificationResponse,
        );
        onResponse(message);
      }
    })();
  }, dependencies);
};
