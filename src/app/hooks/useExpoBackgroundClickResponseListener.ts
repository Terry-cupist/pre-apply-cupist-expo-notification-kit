import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
  useNotificationManage,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";

export const useExpoBackgroundClickResponseListener = (
  props?: UseFCMHookBaseProps<typeof parseExpoNotificationResponse> & {
    onClickResponse?: UseExpoHookCallbackType<
      typeof parseExpoNotificationResponse
    >;
  },
) => {
  const {
    onClickResponse,
    getValidNotificationData,
    dependencies = [],
  } = props ?? {};
  const { sendNotificationUserEvent, refreshDeepLinkApis, navigateToLink } =
    useNotificationManage(props);
  useEffect(() => {
    const subscription =
      ExpoNotificationModule.addNotificationResponseReceivedListener(
        async (response) => {
          if (response) {
            const parsedResponse = parseExpoNotificationResponse(
              response as ExpoNotificationResponse,
            );
            const validNotificationData = getValidNotificationData
              ? getValidNotificationData(parsedResponse)
              : parsedResponse;

            if (validNotificationData.type) {
              sendNotificationUserEvent(validNotificationData.type);
            }

            if (validNotificationData.deepLink) {
              await refreshDeepLinkApis(validNotificationData.deepLink);
              navigateToLink(validNotificationData.deepLink);
            }

            onClickResponse?.(validNotificationData);
          }
        },
      );
    return () => subscription.remove();
  }, dependencies);
};
