import { useRef } from 'react';
import { SubscriberType } from './types';

export function useStoreCore<T>(initData?: T | object) {
  const store = useRef<T | object>(initData || {});
  const subscribers = useRef(new Set<SubscriberType>());

  const subscribe = (subscriber: SubscriberType) => {
    subscribers.current.add(subscriber as SubscriberType);
    return () => subscribers.current.delete(subscriber as SubscriberType);
  };

  const notify = (selector?: string, forceRerender?: boolean) => {
    subscribers.current.forEach(({ onUpdate, baseSelector, settings }) =>
      onUpdate({
        selector,
        baseSelector,
        settings,
        forceRerender,
      })
    );
  };

  const get = () => store.current;

  const set = (value: T | object) => {
    store.current = value;
  };

  return {
    subscribe,
    notify,
    get,
    set,
  };
}
