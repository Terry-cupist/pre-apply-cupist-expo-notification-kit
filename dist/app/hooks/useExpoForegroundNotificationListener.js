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
        console.log('🎧 [useExpoForegroundNotificationListener] 포그라운드 알림 리스너 등록');
        const subscription = notification_1.ExpoNotificationModule.addNotificationReceivedListener(async (notification) => {
            var _a;
            console.log('📨 [useExpoForegroundNotificationListener] 포그라운드 알림 수신');
            const parsedNotification = (0, notification_core_1.parseExpoForegroundMessage)(notification);
            console.log('✅ [useExpoForegroundNotificationListener] 알림 파싱 완료:', parsedNotification);
            const validNotificationData = getValidNotificationData
                ? getValidNotificationData(parsedNotification)
                : parsedNotification;
            console.log('✓ [useExpoForegroundNotificationListener] 유효성 검증 완료:', validNotificationData);
            if (validNotificationData.deepLink) {
                console.log('🔗 [useExpoForegroundNotificationListener] 딥링크 발견, 쿼리 갱신:', validNotificationData.deepLink);
                await onRefreshQueriesForDeepLink(validNotificationData.deepLink);
                console.log('✅ [useExpoForegroundNotificationListener] 쿼리 갱신 완료');
            }
            const isNotificationUIOpenValid = (_a = shouldShowNotification === null || shouldShowNotification === void 0 ? void 0 : shouldShowNotification(validNotificationData)) !== null && _a !== void 0 ? _a : true;
            console.log('🎨 [useExpoForegroundNotificationListener] UI 표시 여부:', isNotificationUIOpenValid);
            if (isNotificationUIOpenValid) {
                console.log('🚀 [useExpoForegroundNotificationListener] 알림 UI 표시 시작');
                onBeforeShowNotification === null || onBeforeShowNotification === void 0 ? void 0 : onBeforeShowNotification(validNotificationData);
                if (localOnRenderNotification) {
                    console.log('🎯 [useExpoForegroundNotificationListener] 로컬 렌더러 사용');
                    localOnRenderNotification === null || localOnRenderNotification === void 0 ? void 0 : localOnRenderNotification(validNotificationData);
                    onAfterShowNotification === null || onAfterShowNotification === void 0 ? void 0 : onAfterShowNotification(validNotificationData);
                    console.log('✅ [useExpoForegroundNotificationListener] 로컬 렌더링 완료');
                }
                else {
                    console.log('🎯 [useExpoForegroundNotificationListener] 기본 렌더러 사용');
                    onRenderNotification({
                        ...validNotificationData,
                        onPress: () => {
                            console.log('👆 [useExpoForegroundNotificationListener] 알림 클릭됨');
                            onNotificationPress === null || onNotificationPress === void 0 ? void 0 : onNotificationPress(validNotificationData);
                            if (validNotificationData.type) {
                                console.log('📊 [useExpoForegroundNotificationListener] 이벤트 로깅:', validNotificationData.type);
                                onLogNotificationEvent(validNotificationData.type);
                            }
                            if (validNotificationData.deepLink) {
                                console.log('🔗 [useExpoForegroundNotificationListener] 딥링크 네비게이션:', validNotificationData.deepLink);
                                onNavigateToDeepLink(validNotificationData.deepLink);
                            }
                            onAfterShowNotification === null || onAfterShowNotification === void 0 ? void 0 : onAfterShowNotification(validNotificationData);
                            console.log('✅ [useExpoForegroundNotificationListener] 클릭 처리 완료');
                        },
                    });
                }
            }
            console.log('🔔 [useExpoForegroundNotificationListener] 배지 카운트 갱신');
            onRefreshBadgeCount();
            onNotification === null || onNotification === void 0 ? void 0 : onNotification(validNotificationData);
            console.log('✅ [useExpoForegroundNotificationListener] 알림 처리 완료');
        });
        return () => {
            console.log('🔌 [useExpoForegroundNotificationListener] 리스너 구독 해제');
            subscription.remove();
        };
    }, dependencies);
};
exports.useExpoForegroundNotificationListener = useExpoForegroundNotificationListener;
//# sourceMappingURL=useExpoForegroundNotificationListener.js.map