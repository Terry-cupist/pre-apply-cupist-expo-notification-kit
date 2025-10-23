import { DependencyList } from "react";

export interface UseFCMHookBaseProps<T extends (...args: any) => any> {
  onMessage: (params: ReturnType<T>) => void;
  dependencies?: DependencyList;
}
