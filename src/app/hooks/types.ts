import { DependencyList } from "react";

export type UseExpoHookCallbackType<T extends (...args: any) => any> = (
  params: ReturnType<T>,
) => void;

export interface UseFCMHookBaseProps {
  dependencies?: DependencyList;
}
