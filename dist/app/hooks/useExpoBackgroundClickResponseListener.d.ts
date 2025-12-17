import { parseExpoNotificationResponse } from "@cupist/notification-core";
import { UseExpoHookCallbackType, UseFCMHookBaseProps } from "./types";
export declare const useExpoBackgroundClickResponseListener: (props?: UseFCMHookBaseProps<typeof parseExpoNotificationResponse> & {
    onClickResponse?: UseExpoHookCallbackType<typeof parseExpoNotificationResponse>;
}) => void;
//# sourceMappingURL=useExpoBackgroundClickResponseListener.d.ts.map