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
    onRenderNotification: localOnRenderNotification,
    dependencies = [],
  } = props ?? {};
  const {
    onRefreshQueriesForDeepLink,
    onRefreshBadgeCount,
    shouldShowNotification,
    onBeforeShowNotification,
    onRenderNotification,
    onNotificationPress,
    onAfterShowNotification,
    onNavigateToDeepLink,
    onLogNotificationEvent,
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
          await onRefreshQueriesForDeepLink(validNotificationData.deepLink);
        }

        const isNotificationUIOpenValid =
          shouldShowNotification?.(validNotificationData) ?? true;
        if (isNotificationUIOpenValid) {
          onBeforeShowNotification?.(validNotificationData);

          if (localOnRenderNotification) {
            localOnRenderNotification?.(validNotificationData);

            onAfterShowNotification?.(validNotificationData);
          } else {
            onRenderNotification({
              ...validNotificationData,
              onPress: () => {
                onNotificationPress?.(validNotificationData);

                if (validNotificationData.type) {
                  onLogNotificationEvent(validNotificationData.type);
                }
                if (validNotificationData.deepLink) {
                  onNavigateToDeepLink(validNotificationData.deepLink);
                }

                onAfterShowNotification?.(validNotificationData);
              },
            });
          }
        }

        onRefreshBadgeCount();

        onNotification?.(validNotificationData);
      },
    );
    return () => subscription.remove();
  }, dependencies);
};
