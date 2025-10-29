import {
  ExpoNotificationResponse,
  parseExpoNotificationResponse,
  useNotificationManage,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";

export const useExpoQuitClickResponseListener = (
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
    (async () => {
      const response =
        await ExpoNotificationModule.getLastNotificationResponseAsync();
      if (response) {
        const parsedResponse = parseExpoNotificationResponse(
          response as ExpoNotificationResponse,
        );
        const validResponseData = getValidNotificationData
          ? getValidNotificationData(parsedResponse)
          : parsedResponse;

        if (validResponseData.type) {
          sendNotificationUserEvent(validResponseData.type);
        }

        if (validResponseData.deepLink) {
          await refreshDeepLinkApis(validResponseData.deepLink);
          navigateToLink(validResponseData.deepLink);
        }

        onClickResponse?.(validResponseData);
      }
    })();
  }, dependencies);
};
