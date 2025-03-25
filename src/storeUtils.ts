import { useCallback, useRef, useState } from "react";
import { UpdatePropsType } from "./types";
import { cloneDeep, isEqual } from "./functions";

function useForceRerender() {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return rerender;
}

export function subscribeDataSnapshot({
  subscribe,
  getDataSnapshot,
}: {
  subscribe: (update: (props: UpdatePropsType) => void) => void;
  getDataSnapshot: () => any;
}) {
  const dataSnapshot = useRef(null);
  const forceRerender = useForceRerender();

  function update({ selector, settings }: UpdatePropsType) {
    const {
      doObserveChanges = true,
      doUpdateOnlyWhenDataChanges = true,
      observedSelectors,
      ignoredSelectors,
      doForceUpdate = false,
    } = settings ?? {};

    // . is word limiter
    // * is any word between dots
    // ** is anything to the end
    function checkPattern(pattensArray: string[], str: string): boolean {
      for (const pattern of pattensArray) {
        const regexString = pattern
          .replace(/\./g, "\\.")
          .replace(/\*{2}/g, ".+")
          .replace(/\*/g, "[^.]+");
        const regex = new RegExp(`^${regexString}$`);
        if (regex.test(str)) {
          return true;
        }
      }
      return false;
    }

    if (!doForceUpdate) {
      if (!doObserveChanges) return;
      if (selector && ignoredSelectors) {
        if (checkPattern(ignoredSelectors, selector)) return;
      }
      if (selector && observedSelectors) {
        if (!checkPattern(observedSelectors, selector)) return;
      }
      if (doUpdateOnlyWhenDataChanges) {
        if (isEqual(dataSnapshot.current, getDataSnapshot())) return;
      }
    }

    dataSnapshot.current = cloneDeep(getDataSnapshot());
    forceRerender();
  }

  subscribe(update);

  return dataSnapshot.current;
}

export function getDataWithSelector(obj: any, selector?: string) {
  if (Object.keys(obj).length === 0) return null;

  if (selector) {
    const keys = selector.split(".");

    keys.forEach((key) => {
      if (!obj.hasOwnProperty(key)) {
        console.error(`No property '${key}' for selector '${selector}'`);
        return null;
      }
      obj = obj[key];
    });
  }

  return obj;
}

export function setDataWithSelector(obj: any, value: any, selector?: string) {
  if (!selector) return value;

  let target = obj;
  const keys = selector.split(".");
  keys.forEach((key, i) => {
    if (i === keys.length - 1) return;

    if (!target.hasOwnProperty(key)) {
      console.error(`No property '${key}' for selector '${selector}'`);
      return null;
    }
    target = target[key];
  });

  const lastKey = keys[keys.length - 1];
  target[lastKey] = value;

  return obj;
}
