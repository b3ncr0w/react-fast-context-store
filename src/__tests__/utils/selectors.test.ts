import { getDataWithSelector, setDataWithSelector, checkPattern } from '../../storeUtils';

describe('Selector Utils', () => {
  describe('getDataWithSelector', () => {
    const testObj = {
      a: {
        b: {
          c: 'value'
        },
        d: [1, 2, 3]
      },
      e: 'top-level'
    };

    it('should get data with nested selectors', () => {
      expect(getDataWithSelector(testObj, 'a.b.c')).toBe('value');
      expect(getDataWithSelector(testObj, 'a.d')).toEqual([1, 2, 3]);
      expect(getDataWithSelector(testObj, 'e')).toBe('top-level');
    });

    it('should handle missing paths', () => {
      expect(getDataWithSelector(testObj, 'a.b.missing')).toBeUndefined();
      expect(getDataWithSelector(testObj, 'missing.path')).toBeUndefined();
    });

    it('should handle empty/undefined selectors', () => {
      expect(getDataWithSelector(testObj)).toBe(testObj);
      expect(getDataWithSelector(testObj, '')).toBe(testObj);
      expect(getDataWithSelector(null)).toBeNull();
    });
  });

  describe('setDataWithSelector', () => {
    it('should set data with nested selectors', () => {
      const obj = {
        a: {
          b: {
            c: 'old'
          }
        }
      };

      setDataWithSelector(obj, 'new', 'a.b.c');
      expect(obj.a.b.c).toBe('new');
    });

    it('should handle function updates', () => {
      const obj = {
        count: 1
      };

      setDataWithSelector(obj, (prev: number) => prev + 1, 'count');
      expect(obj.count).toBe(2);
    });

    it('should handle missing paths', () => {
      const obj = {} as any;
      setDataWithSelector(obj, 'value', 'a.b.c');
      expect(obj.a?.b?.c).toBeUndefined(); // Should not create missing paths
    });

    it('should handle no selector', () => {
      const obj = { a: 1 };
      const result = setDataWithSelector(obj, { b: 2 });
      expect(result).toEqual({ b: 2 });
    });
  });

  describe('checkPattern', () => {
    it('should match exact patterns', () => {
      expect(checkPattern(['a.b.c'], 'a.b.c')).toBe(true);
      expect(checkPattern(['a.b.c'], 'a.b.d')).toBe(false);
    });

    it('should handle single wildcards', () => {
      expect(checkPattern(['a.*.c'], 'a.b.c')).toBe(true);
      expect(checkPattern(['a.*.c'], 'a.b.d')).toBe(false);
      expect(checkPattern(['*.b.*'], 'a.b.c')).toBe(true);
    });

    it('should handle double wildcards', () => {
      expect(checkPattern(['a.**'], 'a.b.c.d')).toBe(true);
      expect(checkPattern(['a.**'], 'b.c.d')).toBe(false);
      expect(checkPattern(['**'], 'a.b.c.d')).toBe(true);
    });

    it('should handle multiple patterns', () => {
      expect(checkPattern(['a.b.c', 'x.y.z'], 'a.b.c')).toBe(true);
      expect(checkPattern(['a.b.c', 'x.y.z'], 'x.y.z')).toBe(true);
      expect(checkPattern(['a.b.c', 'x.y.z'], 'd.e.f')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(checkPattern([], 'a.b.c')).toBe(false);
      expect(checkPattern(['a.b.c'], '')).toBe(false);
      expect(checkPattern(['a.b.c'], undefined)).toBe(false);
    });
  });
}); 