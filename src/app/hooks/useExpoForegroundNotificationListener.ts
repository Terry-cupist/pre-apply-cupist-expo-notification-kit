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
    openToast: localOpenToast,
    dependencies = [],
  } = props ?? {};
  const {
    refreshDeepLinkApis,
    refreshBadgeCount,
    checkIsToastOpenValid,
    beforeOpenNotificationUI,
    openToast,
    onToastPress,
    afterOpenToast,
    navigateToLink,
    sendNotificationUserEvent,
  } = useNotificationManage(props);

  useEffect(() => {
    const subscription = ExpoNotificationModule.addNotificationReceivedListener(
      async (notification) => {
        const parsedNotification = parseExpoForegroundMessage(
          notification as ExpoNotification,
        );
        const validNotificationData = getValidNotificationData
          ? getValidNotificationData(parsedNotification)
          : parsedNotification;

        if (validNotificationData.deepLink) {
          await refreshDeepLinkApis(validNotificationData.deepLink);
        }

        if (localOpenToast) {
          localOpenToast?.(validNotificationData);
        } else if (checkIsToastOpenValid?.(validNotificationData)) {
          beforeOpenNotificationUI?.(validNotificationData);

          openToast({
            ...validNotificationData,
            onPress: () => {
              onToastPress?.(validNotificationData);

              if (validNotificationData.type) {
                sendNotificationUserEvent(validNotificationData.type);
              }
              if (validNotificationData.deepLink) {
                navigateToLink(validNotificationData.deepLink);
              }

              afterOpenToast?.(validNotificationData);
            },
          });
        }

        refreshBadgeCount();

        onNotification?.(validNotificationData);
      },
    );
    return () => subscription.remove();
  }, dependencies);
};
