import { useContext, useCallback, useRef } from 'react';
import { UpdateProps, GetStoreData, SetStoreData } from './types';
import { useStoreCore } from './useStoreCore';
import {
  checkPattern,
  getDataWithSelector,
  isEqual,
  setDataWithSelector,
  useRerender,
} from './storeUtils';

export function useStore<T = any>(
  StoreContext: React.Context<ReturnType<typeof useStoreCore<T>> | null>
) {
  const store = useContext(StoreContext);
  const rerender = useRerender();
  const previousValueRef = useRef<any>(null);

  const getStoreData: GetStoreData<T> = useCallback(
    (selector, settings) => {
      if (!store) return undefined as any;

      // Subscribe to changes
      const onUpdate = ({
        selector,
        baseSelector,
        settings,
        forceRerender,
      }: UpdateProps) => {
        if (forceRerender && selector === undefined) {
          rerender();
          return;
        }

        const currentValue = getDataWithSelector(store.get(), baseSelector);
        const dataChanged = !isEqual(currentValue, previousValueRef.current);

        if (dataChanged === false) return;

        const selectorParts = selector?.split('.').slice(0, -1);
        const parentSelectors =
          selectorParts?.map((_, index) =>
            selectorParts.slice(0, index + 1).join('.')
          ) || [];

        if (
          selector !== undefined &&
          baseSelector !== undefined &&
          checkPattern(
            [...parentSelectors, selector + '.**', selector],
            baseSelector
          ) === false
        )
          return;

        if (
          settings?.observedSelectors !== undefined &&
          checkPattern(
            settings.observedSelectors,
            forceRerender ? selector + '.**' : selector
          ) === false
        )
          return;
        if (
          settings?.ignoredSelectors !== undefined &&
          checkPattern(settings.ignoredSelectors, selector) === true
        )
          return;

        rerender();
        previousValueRef.current = currentValue;
      };
      store.subscribe({ onUpdate, baseSelector: selector, settings });

      // Get data
      const snapshot = store.get();
      const data = getDataWithSelector(snapshot, selector);

      // Initialize previous value
      previousValueRef.current = data;

      return data;
    },
    [store, rerender]
  );

  const setStoreData: SetStoreData<T> = useCallback(
    (value, selector, forceRerender) => {
      if (!store) return;

      const snapshot = store.get();
      const newSnapshot = setDataWithSelector(snapshot, value, selector);

      store.set(newSnapshot);
      store.notify(selector, forceRerender);
    },
    [store]
  );

  return [getStoreData, setStoreData] as const;
}
