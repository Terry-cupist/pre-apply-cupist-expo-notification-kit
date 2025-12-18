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
        console.log('🎧 [useExpoBackgroundClickResponseListener] 백그라운드 클릭 리스너 등록');
        const subscription = notification_1.ExpoNotificationModule.addNotificationResponseReceivedListener(async (response) => {
            if (response) {
                console.log('👆 [useExpoBackgroundClickResponseListener] 백그라운드 알림 클릭됨');
                const parsedResponse = (0, notification_core_1.parseExpoNotificationResponse)(response);
                console.log('✅ [useExpoBackgroundClickResponseListener] 응답 파싱 완료:', parsedResponse);
                const validNotificationData = getValidNotificationData
                    ? getValidNotificationData(parsedResponse)
                    : parsedResponse;
                console.log('✓ [useExpoBackgroundClickResponseListener] 유효성 검증 완료:', validNotificationData);
                if (validNotificationData.type) {
                    console.log('📊 [useExpoBackgroundClickResponseListener] 이벤트 로깅:', validNotificationData.type);
                    onLogNotificationEvent(validNotificationData.type);
                }
                if (validNotificationData.deepLink) {
                    console.log('🔗 [useExpoBackgroundClickResponseListener] 딥링크 발견:', validNotificationData.deepLink);
                    await onRefreshQueriesForDeepLink(validNotificationData.deepLink);
                    console.log('✅ [useExpoBackgroundClickResponseListener] 쿼리 갱신 완료');
                    onNavigateToDeepLink(validNotificationData.deepLink);
                    console.log('🚀 [useExpoBackgroundClickResponseListener] 네비게이션 실행');
                }
                onClickResponse === null || onClickResponse === void 0 ? void 0 : onClickResponse(validNotificationData);
                console.log('✅ [useExpoBackgroundClickResponseListener] 클릭 응답 처리 완료');
            }
        });
        return () => {
            console.log('🔌 [useExpoBackgroundClickResponseListener] 리스너 구독 해제');
            subscription.remove();
        };
    }, dependencies);
};
exports.useExpoBackgroundClickResponseListener = useExpoBackgroundClickResponseListener;
//# sourceMappingURL=useExpoBackgroundClickResponseListener.js.map