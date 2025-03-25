import { useCallback, useRef } from "react";
import { SettingsType, UpdatePropsType } from "./types";

export function useStoreCore<T>(initData?: T | object) {
  const store = useRef<T | object>(initData || {});
  const subscribers = useRef(
    new Set<{
      update: (props: UpdatePropsType) => void;
      subSettings?: SettingsType;
    }>()
  );

  const subscribe = useCallback(
    (update: (props: UpdatePropsType) => void, subSettings?: SettingsType) => {
      const subscriber = { update, subSettings };

      subscribers.current.add(subscriber);
      return () => subscribers.current.delete(subscriber);
    },
    []
  );

  const notify = useCallback(({ selector, settings }: UpdatePropsType) => {
    subscribers.current.forEach(({ update, subSettings }) =>
      update({ selector, settings: { ...settings, ...subSettings } })
    );
  }, []);
  const get = useCallback(() => store.current, []);

  const set = useCallback((value: T | object) => {
    store.current = value;
  }, []);

  return {
    subscribe,
    notify,
    get,
    set,
  };
}
