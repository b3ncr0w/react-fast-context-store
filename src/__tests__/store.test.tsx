import React, { act } from 'react';
import { render } from '@testing-library/react';
import { flushSync } from 'react-dom';
import { createStore } from '../index';

describe('Store', () => {
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
      data1: 'initial2'
    },
    data3: {
      data1: 'initial3',
      data2: {
        data1: 'initial4'
      }
    },
    array1: ['a', 'b', 'c']
  };

  function createTestComponent(useStore: any) {
    return function TestComponent({ 
      onMount, 
      selector,
      settings
    }: { 
      onMount?: (data: any, setStoreData?: (value: any, selector?: string) => void) => void;
      selector?: string;
      settings?: { observedSelectors?: string[], ignoredSelectors?: string[] };
    }) {
      const [getStoreData, setStoreData] = useStore();
      const data = getStoreData(selector as any, settings);
      
      React.useEffect(() => {
        onMount?.(data, setStoreData);
      }, [data, onMount, setStoreData]);

      return null;
    }
  }

  describe('Basic Selector Tests', () => {
    it('should rerender component with no selector on any store update', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data1'));
      expect(rerenderCount).toBe(2); // Initial mount + update
    });

    it('should only rerender component with matching selector', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data1"
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data1'));
      expect(rerenderCount).toBe(2); // Initial mount + update

      await act(async () => void setData('new value', 'data2.data1'));
      expect(rerenderCount).toBe(2); // Should not rerender
    });

    it('should rerender component with parent selector when child changes', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data3"
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data3.data2.data1'));
      expect(rerenderCount).toBe(2); // Initial mount + update
    });
  });

  describe('Observed Selectors Tests', () => {
    it('should never rerender with empty observedSelectors', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data1"
            settings={{ observedSelectors: [] }}
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data1'));
      expect(rerenderCount).toBe(1); // Only initial mount
    });

    it('should rerender only for matching observedSelectors', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data3"
            settings={{ observedSelectors: ['data3.data1'] }}
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data3.data1'));
      expect(rerenderCount).toBe(2); // Initial mount + update

      await act(async () => void setData('new value', 'data3.data2.data1'));
      expect(rerenderCount).toBe(2); // Should not rerender
    });

    it('should handle wildcard patterns in observedSelectors', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data3"
            settings={{ observedSelectors: ['data3.*'] }}
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data3.data1'));
      expect(rerenderCount).toBe(2); // Initial mount + update

      await act(async () => void setData('new value', 'data3.data2.data1'));
      expect(rerenderCount).toBe(2); // Should not rerender (not direct child)
    });
  });

  describe('Ignored Selectors Tests', () => {
    it('should not rerender for ignored selectors', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data3"
            settings={{ ignoredSelectors: ['data3.data1'] }}
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data3.data1'));
      expect(rerenderCount).toBe(1); // Only initial mount

      await act(async () => void setData('new value', 'data3.data2.data1'));
      expect(rerenderCount).toBe(2); // Should rerender for non-ignored path
    });
  });

  describe('Combined Settings Tests', () => {
    it('should respect both observed and ignored selectors', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="data3"
            settings={{ 
              observedSelectors: ['data3.*'],
              ignoredSelectors: ['data3.data1']
            }}
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data3.data1'));
      expect(rerenderCount).toBe(1); // Only initial mount (ignored)

      await act(async () => void setData('new value', 'data3.data2'));
      expect(rerenderCount).toBe(2); // Should rerender (observed and not ignored)
    });
  });

  describe('Array Operation Tests', () => {
    it('should rerender on array operations', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="array1"
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData((prev: string[]) => [...prev, 'd'], 'array1'));
      expect(rerenderCount).toBe(2); // Initial mount + update

      await act(async () => void setData((prev: string[]) => prev.slice(0, -1), 'array1'));
      expect(rerenderCount).toBe(3); // Another update
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid selectors gracefully', async () => {
      const [StoreProvider, useStore] = createStore<TestStore>(initialData);
      const TestComponent = createTestComponent(useStore);
      let rerenderCount = 0;
      let setData: any;

      render(
        <StoreProvider>
          <TestComponent 
            selector="invalid.path"
            onMount={(_, set) => { 
              setData = set;
              rerenderCount++;
            }} 
          />
        </StoreProvider>
      );

      await act(async () => void setData('new value', 'data1'));
      expect(rerenderCount).toBe(1); // Only initial mount
    });
  });
}); 