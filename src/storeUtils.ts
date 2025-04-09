import { useState } from 'react';

export const useRerender = () => {
  const [, setTick] = useState(0);
  return () => setTick((tick) => tick + 1);
};

export function deepClone<T>(obj: T, visited = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clone: any[] = [];
    visited.set(obj, clone);
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepClone(obj[i], visited);
    }
    return clone as T;
  }

  // Handle objects
  const clone = {} as T;
  visited.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], visited);
    }
  }
  return clone;
}

export function getDataWithSelector(obj: any, selector?: string) {
  if (!obj) return null;
  if (!selector) return obj;
  return selector.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setDataWithSelector(obj: any, value: any, selector?: string) {
  if (!selector) {
    return typeof value === 'function' ? value(obj) : value;
  }

  const keys = selector.split('.');
  const lastKey = keys.pop()!;

  const target = keys.reduce((acc, key) => acc?.[key], obj);

  if (target) {
    target[lastKey] =
      typeof value === 'function' ? value(target[lastKey]) : value;
  }

  return obj;
}

// . is word limiter
// * is any word between dots
// ** is anything to the end
export function checkPattern(pattensArray: string[], str?: string): boolean {
  if (!str) return false;
  for (const pattern of pattensArray) {
    // Check if either pattern matches str or str matches pattern
    const patternRegex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*{2}/g, '.+')
      .replace(/\*/g, '[^.]+');
    const strRegex = str
      .replace(/\./g, '\\.')
      .replace(/\*{2}/g, '.+')
      .replace(/\*/g, '[^.]+');
    
    const patternReg = new RegExp(`^${patternRegex}$`);
    const strReg = new RegExp(`^${strRegex}$`);
    
    if (patternReg.test(str) || strReg.test(pattern)) {
      return true;
    }
  }
  return false;
}

export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  return a === b;
}