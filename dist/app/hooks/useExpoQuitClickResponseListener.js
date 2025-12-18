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
            console.log('🚪 [useExpoQuitClickResponseListener] 종료 상태 클릭 응답 확인 시작');
            const response = await notification_1.ExpoNotificationModule.getLastNotificationResponseAsync();
            if (response) {
                console.log('👆 [useExpoQuitClickResponseListener] 종료 상태에서 클릭한 알림 발견');
                const parsedResponse = (0, notification_core_1.parseExpoNotificationResponse)(response);
                console.log('✅ [useExpoQuitClickResponseListener] 응답 파싱 완료:', parsedResponse);
                const validResponseData = getValidNotificationData
                    ? getValidNotificationData(parsedResponse)
                    : parsedResponse;
                console.log('✓ [useExpoQuitClickResponseListener] 유효성 검증 완료:', validResponseData);
                if (validResponseData.type) {
                    console.log('📊 [useExpoQuitClickResponseListener] 이벤트 로깅:', validResponseData.type);
                    onLogNotificationEvent(validResponseData.type);
                }
                if (validResponseData.deepLink) {
                    console.log('🔗 [useExpoQuitClickResponseListener] 딥링크 발견:', validResponseData.deepLink);
                    await onRefreshQueriesForDeepLink(validResponseData.deepLink);
                    console.log('✅ [useExpoQuitClickResponseListener] 쿼리 갱신 완료');
                    onNavigateToDeepLink(validResponseData.deepLink);
                    console.log('🚀 [useExpoQuitClickResponseListener] 네비게이션 실행');
                }
                onClickResponse === null || onClickResponse === void 0 ? void 0 : onClickResponse(validResponseData);
                console.log('✅ [useExpoQuitClickResponseListener] 클릭 응답 처리 완료');
            }
            else {
                console.log('ℹ️ [useExpoQuitClickResponseListener] 종료 상태에서 클릭한 알림 없음');
            }
        })();
    }, dependencies);
};
exports.useExpoQuitClickResponseListener = useExpoQuitClickResponseListener;
//# sourceMappingURL=useExpoQuitClickResponseListener.js.map