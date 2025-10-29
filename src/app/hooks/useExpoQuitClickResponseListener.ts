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
  const { onLogNotificationEvent, onRefreshQueriesForDeepLink, onNavigateToDeepLink } =
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
          onLogNotificationEvent(validResponseData.type);
        }

        if (validResponseData.deepLink) {
          await onRefreshQueriesForDeepLink(validResponseData.deepLink);
          onNavigateToDeepLink(validResponseData.deepLink);
        }

        onClickResponse?.(validResponseData);
      }
    })();
  }, dependencies);
};
