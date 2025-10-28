import {
  ExpoNotification,
  parseExpoForegroundMessage,
  useNotificationManage,
} from "@cupist/notification-core";
import { ExpoNotificationModule } from "@shared/notification";
import { useEffect } from "react";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";

type UseExpoForegroundNotificationListenerProps = UseFCMHookBaseProps<
  typeof parseExpoForegroundMessage
> & {
  onNotification?: UseExpoHookCallbackType<typeof parseExpoForegroundMessage>;
};

export const useExpoForegroundNotificationListener = (
  props?: UseExpoForegroundNotificationListenerProps,
) => {
  const {
    onNotification,
    getValidNotificationData,
    dependencies = [],
  } = props ?? {};
  const { refreshDeepLinkApis, refreshBadgeCount, openNotificationUI } =
    useNotificationManage(props);

  useEffect(() => {
    const subscription = ExpoNotificationModule.addNotificationReceivedListener(
      (notification) => {
        const parsedNotification = parseExpoForegroundMessage(
          notification as ExpoNotification,
        );
        const validNotificationData = getValidNotificationData
          ? getValidNotificationData(parsedNotification)
          : parsedNotification;

        if (validNotificationData.deepLink) {
          refreshDeepLinkApis(validNotificationData.deepLink);
        }

        if (validNotificationData.content) {
          openNotificationUI(validNotificationData);
        }

        refreshBadgeCount();

        onNotification?.(validNotificationData);
      },
    );
    return () => subscription.remove();
  }, dependencies);
};
