import { useCallback, useRef } from 'react';
import { SubscriberType } from './types';

export function useStoreCore<T>(initData?: T | object) {
  const store = useRef<T | object>(initData || {});
  const subscribers = useRef(new Set<SubscriberType>());

  const subscribe = useCallback((subscriber: SubscriberType) => {
    subscribers.current.add(subscriber as SubscriberType);
    return () => subscribers.current.delete(subscriber as SubscriberType);
  }, []);

  const notify = useCallback((selector?: string) => {
    subscribers.current.forEach(({ onUpdate, baseSelector, settings }) =>
      onUpdate({ selector, baseSelector, settings })
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
