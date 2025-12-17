"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExpoForegroundNotificationListener = void 0;
const notification_core_1 = require("@cupist/notification-core");
const notification_1 = require("../../shared/notification");
const react_1 = require("react");
const useExpoForegroundNotificationListener = (props) => {
    const { onNotification, getValidNotificationData, onRenderNotification: localOnRenderNotification, dependencies = [], } = props !== null && props !== void 0 ? props : {};
    const { onRefreshQueriesForDeepLink, onRefreshBadgeCount, shouldShowNotification, onBeforeShowNotification, onRenderNotification, onNotificationPress, onAfterShowNotification, onNavigateToDeepLink, onLogNotificationEvent, } = (0, notification_core_1.useNotificationManage)(props);
    (0, react_1.useEffect)(() => {
        const subscription = notification_1.ExpoNotificationModule.addNotificationReceivedListener(async (notification) => {
            var _a;
            const parsedNotification = (0, notification_core_1.parseExpoForegroundMessage)(notification);
            const validNotificationData = getValidNotificationData
                ? getValidNotificationData(parsedNotification)
                : parsedNotification;
            if (validNotificationData.deepLink) {
                await onRefreshQueriesForDeepLink(validNotificationData.deepLink);
            }
            const isNotificationUIOpenValid = (_a = shouldShowNotification === null || shouldShowNotification === void 0 ? void 0 : shouldShowNotification(validNotificationData)) !== null && _a !== void 0 ? _a : true;
            if (isNotificationUIOpenValid) {
                onBeforeShowNotification === null || onBeforeShowNotification === void 0 ? void 0 : onBeforeShowNotification(validNotificationData);
                if (localOnRenderNotification) {
                    localOnRenderNotification === null || localOnRenderNotification === void 0 ? void 0 : localOnRenderNotification(validNotificationData);
                    onAfterShowNotification === null || onAfterShowNotification === void 0 ? void 0 : onAfterShowNotification(validNotificationData);
                }
                else {
                    onRenderNotification({
                        ...validNotificationData,
                        onPress: () => {
                            onNotificationPress === null || onNotificationPress === void 0 ? void 0 : onNotificationPress(validNotificationData);
                            if (validNotificationData.type) {
                                onLogNotificationEvent(validNotificationData.type);
                            }
                            if (validNotificationData.deepLink) {
                                onNavigateToDeepLink(validNotificationData.deepLink);
                            }
                            onAfterShowNotification === null || onAfterShowNotification === void 0 ? void 0 : onAfterShowNotification(validNotificationData);
                        },
                    });
                }
            }
            onRefreshBadgeCount();
            onNotification === null || onNotification === void 0 ? void 0 : onNotification(validNotificationData);
        });
        return () => subscription.remove();
    }, dependencies);
};
exports.useExpoForegroundNotificationListener = useExpoForegroundNotificationListener;
//# sourceMappingURL=useExpoForegroundNotificationListener.js.map