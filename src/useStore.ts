import { useContext } from 'react';
import { PathValue, SettingsType, UpdatePropsType } from './types';
import { useStoreCore } from './useStoreCore';
import {
  checkPattern,
  getDataWithSelector,
  setDataWithSelector,
  useRerender,
} from './storeUtils';

export function useStore<T = any>(
  StoreContext: React.Context<ReturnType<typeof useStoreCore<T>> | null>
) {
  const store = useContext(StoreContext);
  const rerender = useRerender();

  function getStoreData<Path extends string | undefined = undefined>(
    selector?: Path,
    settings?: SettingsType
  ): Path extends string ? PathValue<T, Path> : Path extends undefined ? T : any {
    if (!store) return undefined as any;

    // Subscribe to changes
    const onUpdate = ({
      selector,
      baseSelector,
      settings,
      forceRerender,
    }: UpdatePropsType) => {
      if (forceRerender && selector === undefined) {
        rerender();
        return;
      }

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
    };
    store.subscribe({ onUpdate, baseSelector: selector, settings });

    // Get data
    const snapshot = store.get();
    const data = getDataWithSelector(snapshot, selector);

    return data;
  }

  function setStoreData<Path extends string>(
    value:
      | ((prev: PathValue<T, Path>) => PathValue<T, Path>)
      | PathValue<T, Path>
      | T,
    selector?: Path,
    forceRerender?: boolean
  ) {
    if (!store) return;

    const snapshot = store.get();
    const newSnapshot = setDataWithSelector(snapshot, value, selector);

    store.set(newSnapshot);
    store.notify(selector, forceRerender);
  }

  return [getStoreData, setStoreData] as const;
}
