import React, { act} from 'react';
import { render } from '@testing-library/react';
import { createStore } from '../../index';
import { GetterSettings, SetStoreData, UseStore } from '../../types';

type TestStore = {
  data1: string;
  data2: {
    data1: string;
  };
  data3: {
    data1: string;
    data2: {
      data1: string;
    };
  };
  array1: string[];
};

const initialData: TestStore = {
  data1: 'initial1',
  data2: {
    data1: 'initial2',
  },
  data3: {
    data1: 'initial3',
    data2: {
      data1: 'initial4',
    },
  },
  array1: ['a', 'b', 'c'],
};

const createTestComponent = ({
  useStore,
  rerendersCount,
  index,
  selector,
  settings,
}: {
  useStore: UseStore<TestStore>;
  rerendersCount: number[];
  index: number;
  selector?: string;
  settings?: GetterSettings;
}) => {
  const setStoreDataRef = { current: null as SetStoreData<TestStore> | null };

  const TestComponent = () => {
    const [getData, setData] = useStore();
    setStoreDataRef.current = setData;
    getData(selector, settings);

    React.useEffect(() => {
      rerendersCount[index] = (rerendersCount[index] || 0) + 1;
    });

    return null;
  };

  return [TestComponent, () => setStoreDataRef.current!] as const;
};

describe('Store', () => {
  describe('Basic Selector Tests', () => {
    it('should rerender component with no selector on any store update', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const rerendersCount: number[] = [];
      
      const [TestComponent1, getSetData1] = createTestComponent({
        useStore,
        rerendersCount,
        index: 0,
        selector: undefined,
        settings: undefined,
      });

      act(() => {
        render(
          <StoreProvider>
            <TestComponent1 />
          </StoreProvider>
        );
      });

      const setData1 = getSetData1();

      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([1])); // first render

      // no value change
      act(() => setData1('initial1', 'data1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([1]));

      // no object change
      act(() => setData1({ data1: 'initial2' }, 'data2'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([1]));

      // no array change
      act(() => setData1(['a', 'b', 'c'], 'array1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([1]));

      // 0 level string with function
      act(() => setData1((prev) => ({ ...prev, data1: 'new1' })));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([2]));

      // 0 level string directly
      act(() => setData1('new2', 'data1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([3]));

      // 0 level object with function
      act(() =>
        setData1((prev) => ({ ...prev, data2: { data1: 'new3' } }))
      );
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([4]));

      // 0 level object directly
      act(() => setData1({ data1: 'new4' }, 'data2'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([5]));

      // 0 level array with function
      act(() => setData1((prev) => prev.slice(0, -1), 'array1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([6]));

      // 0 level array directly
      act(() => setData1(['a', 'b', 'c', 'd'], 'array1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([7]));

      // 1 level string with function
      act(() =>
        setData1((prev) => ({ ...prev, data2: { data1: 'new5' } }))
      );
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([8]));

      // 1 level string directly
      act(() => setData1('new6', 'data2.data1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([9]));

      // 2 level string with function
      act(() =>
        setData1((prev) => ({ ...prev, data1: 'new7' }), 'data3.data2')
      );
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([10]));

      // 2 level string directly
      act(() => setData1('new8', 'data3.data2.data1'));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([11]));

      // force rerender
      act(() => setData1((prev) => prev, undefined, { forceRerender: true }));
      expect(JSON.stringify(rerendersCount)).toBe(JSON.stringify([12]));
    });
    // it('should only rerender component with matching selector', () => {});
    // it('should rerender component with parent selector when child changes', () => {});
    // it('should rerender child components when parent object changes', () => {});
  });

  // describe('Observed Selectors Tests', () => {
  //   it('should never rerender with empty observedSelectors', () => {});
  //   it('should rerender only for matching observedSelectors', () => {});
  //   it('should handle wildcard patterns in observedSelectors', () => {});
  // });

  // describe('Ignored Selectors Tests', () => {
  //   it('should not rerender for ignored selectors', () => {});
  // });

  // describe('Combined Settings Tests', () => {
  //   it('should respect both observed and ignored selectors', () => {});
  // });

  // describe('Array Operation Tests', () => {
  //   it('should rerender on array operations', () => {});
  // });

  // describe('Edge Cases', () => {
  //   it('should handle invalid selectors gracefully', () => {});
  // });

  // describe('Force Rerender Tests', () => {
  //   it('should force rerender all components when updating whole store', () => {});
  //   it('should force rerender all components related to a path', () => {});
  //   it('should force rerender without changing data', () => {});
  // });
});
