import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";

export const useExpoBackgroundClickListener = ({
  onResponse,
  dependencies = [],
}: UseFCMHookBaseProps & {
  onResponse: UseExpoHookCallbackType<typeof parseExpoNotificationResponse>;
}) => {
  useEffect(() => {
    const subscription =
      ExpoNotificationModule.addNotificationResponseReceivedListener(
        (response) => {
          if (response) {
            const message = parseExpoNotificationResponse(
              response as ExpoNotificationResponse,
            );
            onResponse(message);
          }
        },
      );
    return () => subscription.remove();
  }, dependencies);
};
