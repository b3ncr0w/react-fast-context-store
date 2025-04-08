import { useContext, useCallback, useRef } from 'react';
import { UpdateProps, GetStoreData, SetStoreData } from './types';
import { useStoreCore } from './useStoreCore';
import {
  checkPattern,
  deepClone,
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
        // Handle global force rerender case (when selector is undefined)
        if (forceRerender && selector === undefined) {
          rerender();
          return;
        }

        // Check if the data has actually changed by comparing current and previous values
        const currentValue = getDataWithSelector(store.get(), baseSelector);
        const dataChanged = !isEqual(currentValue, previousValueRef.current);

        // Skip update if data hasn't changed
        if (dataChanged === false && !forceRerender) return;

        // Extract parent selectors for pattern matching
        const selectorParts = selector?.split('.').slice(0, -1);
        const parentSelectors =
          selectorParts?.map((_, index) =>
            selectorParts.slice(0, index + 1).join('.')
          ) || [];

        // Check if the update matches the selector pattern
        // This ensures we only rerender when relevant data changes
        if (
          selector !== undefined &&
          baseSelector !== undefined &&
          checkPattern(
            [...parentSelectors, selector + '.**', selector],
            baseSelector
          ) === false
        )
          return;

        // Check if the update matches the observed selectors pattern
        // This allows for selective observation of specific parts of the store
        if (
          settings?.observedSelectors !== undefined &&
          checkPattern(
            settings.observedSelectors,
            forceRerender ? selector + '.**' : selector
          ) === false
        )
          return;
        
        // Check if the update should be ignored based on ignored selectors
        // This allows for excluding specific parts of the store from updates
        if (
          settings?.ignoredSelectors !== undefined &&
          checkPattern(settings.ignoredSelectors, selector) === true
        )
          return;

        // If all checks pass, trigger a rerender and update the previous value reference
        rerender();
        previousValueRef.current = deepClone(currentValue);
      };
      store.subscribe({ onUpdate, baseSelector: selector, settings });

      // Get data
      const snapshot = store.get();
      const data = getDataWithSelector(snapshot, selector);

      // Initialize previous value
      previousValueRef.current = deepClone(data);

      return data;
    },
    [store, rerender]
  );

  const setStoreData: SetStoreData<T> = useCallback(
    (value, selector, settings) => {
      if (!store) return;

      const snapshot = store.get();
      const newSnapshot = setDataWithSelector(
        snapshot,
        settings?.immutable === false || settings?.forceRerender === true
          ? value
          : deepClone(value),
        selector
      );

      store.set(newSnapshot);
      store.notify(selector, settings?.forceRerender);
    },
    [store]
  );

  return [getStoreData, setStoreData] as const;
}
