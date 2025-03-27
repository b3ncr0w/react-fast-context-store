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

  function getStoreData<Path extends string>(
    selector?: Path,
    settings?: SettingsType
  ) {
    if (!store) return null;

    // Subscribe to changes
    const onUpdate = ({
      selector,
      baseSelector,
      settings,
    }: UpdatePropsType) => {
      const relatedSelectorParts = selector?.split('.').slice(0, -1);
      const relatedSelectors =
        relatedSelectorParts?.map((_, index) =>
          relatedSelectorParts.slice(0, index + 1).join('.')
        ) || [];

      if (
        baseSelector !== undefined &&
        [...relatedSelectors, selector].includes(baseSelector) === false
      )
        return;

      if (
        settings?.observedSelectors !== undefined &&
        checkPattern(settings.observedSelectors, selector) === false
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
    selector?: Path
  ) {
    if (!store) return;

    const snapshot = store.get();
    const newSnapshot = setDataWithSelector(snapshot, value, selector);

    store.set(newSnapshot);
    store.notify(selector);
  }

  return [getStoreData, setStoreData] as const;
}
