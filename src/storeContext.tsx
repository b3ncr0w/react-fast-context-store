import React, { createContext, ReactNode } from "react";
import { useStoreCore } from "./useStoreCore";
import { useStore } from "./useStore";

export function createStore<T = any>(initData?: T) {
  const StoreContext = createContext<ReturnType<typeof useStoreCore<T>> | null>(
    null
  );

  const StoreProvider = ({ children }: { children: ReactNode }) => {
    const store = useStoreCore<T>(initData);
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  };

  const useStoreContext = () => useStore<T>(StoreContext);

  return [StoreProvider, useStoreContext] as const;
}