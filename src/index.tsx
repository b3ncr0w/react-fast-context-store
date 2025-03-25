import React, { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import {
  subscribeDataSnapshot,
  getDataWithSelector,
  setDataWithSelector,
} from "./storeUtils";
import { useStoreCore } from "./useStoreCore";
import { SettingsType } from "./types";

type PathValue<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : never;

export function createStore<T = any>(initData?: T) {
  const StoreContext = createContext<ReturnType<typeof useStoreCore<T>> | null>(
    null
  );
  let isInitialized: boolean = false;

  const StoreProvider = ({ children }: { children: ReactNode }) => {
    const store = useStoreCore<T>(initData);
    const isStoreInitialized = useRef(false);

    useEffect(() => {
      if (!isStoreInitialized.current) {
        isStoreInitialized.current = true;
        store.notify({ settings: { doForceUpdate: true } });
        isInitialized = true;
      }
    }, [isStoreInitialized]);

    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  };

  function useStore() {
    const store = useContext(StoreContext)!;
    if (!store) throw new Error("Store not found");

    function getStoreData<Path extends string>(selector?: Path, settings?: SettingsType) {
      return subscribeDataSnapshot({
        subscribe: (update) => store.subscribe(update, settings),
        getDataSnapshot: () => getDataWithSelector(store.get(), selector),
      }) as Path extends string ? PathValue<T, Path> : T;
    }

    function setStoreData<Path extends string>(
      value: ((prev: PathValue<T, Path>) => PathValue<T, Path>) | PathValue<T, Path>,
      selector?: Path,
      { doNotifyObservers = true }: { doNotifyObservers?: boolean } = {}
    ) {
      if (selector && !isInitialized) return;

      const prevData = getDataWithSelector(store.get(), selector);
      const data = setDataWithSelector(
        store.get(),
        typeof value === "function"
          ? (value as (prev: PathValue<T, Path>) => PathValue<T, Path>)(prevData)
          : value,
        selector
      );
      store.set(data);
      doNotifyObservers && store.notify({ selector });
    }

    return [
      getStoreData,
      setStoreData,
    ] as const;
  }

  return [StoreProvider, useStore] as const;
}
