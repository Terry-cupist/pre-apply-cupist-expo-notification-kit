import { parseExpoForegroundMessage } from "@cupist/notification-core";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";
type UseExpoForegroundNotificationListenerProps = UseFCMHookBaseProps<typeof parseExpoForegroundMessage> & {
    onNotification?: UseExpoHookCallbackType<typeof parseExpoForegroundMessage>;
};
export declare const useExpoForegroundNotificationListener: (props?: UseExpoForegroundNotificationListenerProps) => void;
export {};
//# sourceMappingURL=useExpoForegroundNotificationListener.d.ts.map