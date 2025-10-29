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
    openNotificationUI: localOpenNotificationUI,
    dependencies = [],
  } = props ?? {};
  const {
    refreshDeepLinkApis,
    refreshBadgeCount,
    checkIsNotificationOpenValid,
    beforeOpenNotificationUI,
    openNotificationUI,
    onNotificationUIPress,
    afterOpenNotificationUI,
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

        const isNotificationUIOpenValid =
          checkIsNotificationOpenValid?.(validNotificationData) ?? true;
        if (isNotificationUIOpenValid) {
          beforeOpenNotificationUI?.(validNotificationData);

          if (localOpenNotificationUI) {
            localOpenNotificationUI?.(validNotificationData);

            afterOpenNotificationUI?.(validNotificationData);
          } else {
            openNotificationUI({
              ...validNotificationData,
              onPress: () => {
                onNotificationUIPress?.(validNotificationData);

                if (validNotificationData.type) {
                  sendNotificationUserEvent(validNotificationData.type);
                }
                if (validNotificationData.deepLink) {
                  navigateToLink(validNotificationData.deepLink);
                }

                afterOpenNotificationUI?.(validNotificationData);
              },
            });
          }
        }

        refreshBadgeCount();

        onNotification?.(validNotificationData);
      },
    );
    return () => subscription.remove();
  }, dependencies);
};
