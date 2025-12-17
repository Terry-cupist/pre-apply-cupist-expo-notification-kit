"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExpoQuitClickResponseListener = void 0;
const notification_core_1 = require("@cupist/notification-core");
const notification_1 = require("../../shared/notification");
const react_1 = require("react");
const useExpoQuitClickResponseListener = (props) => {
    const { onClickResponse, getValidNotificationData, dependencies = [], } = props !== null && props !== void 0 ? props : {};
    const { onLogNotificationEvent, onRefreshQueriesForDeepLink, onNavigateToDeepLink } = (0, notification_core_1.useNotificationManage)(props);
    (0, react_1.useEffect)(() => {
        (async () => {
            const response = await notification_1.ExpoNotificationModule.getLastNotificationResponseAsync();
            if (response) {
                const parsedResponse = (0, notification_core_1.parseExpoNotificationResponse)(response);
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
                onClickResponse === null || onClickResponse === void 0 ? void 0 : onClickResponse(validResponseData);
            }
        })();
    }, dependencies);
};
exports.useExpoQuitClickResponseListener = useExpoQuitClickResponseListener;
//# sourceMappingURL=useExpoQuitClickResponseListener.js.map