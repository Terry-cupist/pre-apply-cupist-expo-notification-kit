"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExpoBackgroundClickResponseListener = void 0;
const notification_core_1 = require("@cupist/notification-core");
const notification_1 = require("../../shared/notification");
const react_1 = require("react");
const useExpoBackgroundClickResponseListener = (props) => {
    const { onClickResponse, getValidNotificationData, dependencies = [], } = props !== null && props !== void 0 ? props : {};
    const { onLogNotificationEvent, onRefreshQueriesForDeepLink, onNavigateToDeepLink, } = (0, notification_core_1.useNotificationManage)(props);
    (0, react_1.useEffect)(() => {
        const subscription = notification_1.ExpoNotificationModule.addNotificationResponseReceivedListener(async (response) => {
            if (response) {
                const parsedResponse = (0, notification_core_1.parseExpoNotificationResponse)(response);
                const validNotificationData = getValidNotificationData
                    ? getValidNotificationData(parsedResponse)
                    : parsedResponse;
                if (validNotificationData.type) {
                    onLogNotificationEvent(validNotificationData.type);
                }
                if (validNotificationData.deepLink) {
                    await onRefreshQueriesForDeepLink(validNotificationData.deepLink);
                    onNavigateToDeepLink(validNotificationData.deepLink);
                }
                onClickResponse === null || onClickResponse === void 0 ? void 0 : onClickResponse(validNotificationData);
            }
        });
        return () => subscription.remove();
    }, dependencies);
};
exports.useExpoBackgroundClickResponseListener = useExpoBackgroundClickResponseListener;
//# sourceMappingURL=useExpoBackgroundClickResponseListener.js.map