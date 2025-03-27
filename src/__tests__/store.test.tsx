import React, { act } from 'react';
import { render } from '@testing-library/react';
import { flushSync } from 'react-dom';
import { createStore } from '../index';

describe('Store', () => {
  type TestStore = {
    string: string;
    number: number;
    array: string[];
    nested: {
      value: string;
      deep: {
        value: number;
      };
    };
  };

  const initialData: TestStore = {
    string: 'initial',
    number: 42,
    array: ['a', 'b', 'c'],
    nested: {
      value: 'nested',
      deep: {
        value: 100
      }
    }
  };

  function createTestComponent(useStore: any) {
    return function TestComponent({ 
      onMount, 
      selector 
    }: { 
      onMount?: (data: any, setStoreData?: (value: any, selector?: string) => void) => void;
      selector?: string;
    }) {
      const [getStoreData, setStoreData] = useStore();
      const data = getStoreData(selector as any);
      
      React.useEffect(() => {
        onMount?.(data, setStoreData);
      }, [data, onMount, setStoreData]);

      return null;
    }
  }

  it('should initialize with initial data', () => {
    const [StoreProvider, useStore] = createStore<TestStore>(initialData);
    const TestComponent = createTestComponent(useStore);
    let mountData: any;
    let wholeStoreData: any;

    render(
      <StoreProvider>
        <TestComponent onMount={(data) => { mountData = data; }} />
        <TestComponent onMount={(data) => { wholeStoreData = data; }} />
      </StoreProvider>
    );

    expect(mountData).toEqual(initialData);
    expect(wholeStoreData).toEqual(initialData);
  });

  it('should update primitive values and update whole store', async () => {
    const [StoreProvider, useStore] = createStore<TestStore>(initialData);
    const TestComponent = createTestComponent(useStore);
    let mountData: any;
    let wholeStoreData: any;
    let setData: any;

    render(
      <StoreProvider>
        <TestComponent 
          selector="string"
          onMount={(data) => { mountData = data; }} 
        />
        <TestComponent onMount={(data) => { wholeStoreData = data; }} />
        <TestComponent onMount={(_, set) => { setData = set; }} />
      </StoreProvider>
    );

    await act(async () => void setData('new string', 'string'));

    expect(mountData).toBe('new string');
    expect(wholeStoreData.string).toBe('new string');
    expect(wholeStoreData.number).toBe(42);
    expect(wholeStoreData.array).toEqual(['a', 'b', 'c']);
    expect(wholeStoreData.nested).toEqual({
      value: 'nested',
      deep: {
        value: 100
      }
    });
  });

  it('should update nested values and update whole store', async () => {
    const [StoreProvider, useStore] = createStore<TestStore>(initialData);
    const TestComponent = createTestComponent(useStore);
    let mountData: any;
    let wholeStoreData: any;
    let setData: any;

    render(
      <StoreProvider>
        <TestComponent 
          selector="nested.value"
          onMount={(data) => { mountData = data; }} 
        />
        <TestComponent onMount={(data) => { wholeStoreData = data; }} />
        <TestComponent onMount={(_, set) => { setData = set; }} />
      </StoreProvider>
    );

    await act(async () => void setData('new nested', 'nested.value'));

    expect(mountData).toBe('new nested');
    expect(wholeStoreData.string).toBe('initial');
    expect(wholeStoreData.number).toBe(42);
    expect(wholeStoreData.array).toEqual(['a', 'b', 'c']);
    expect(wholeStoreData.nested.value).toBe('new nested');
    expect(wholeStoreData.nested.deep.value).toBe(100);
  });

  it('should update with function updater and update whole store', async () => {
    const [StoreProvider, useStore] = createStore<TestStore>(initialData);
    const TestComponent = createTestComponent(useStore);
    let mountData: any;
    let wholeStoreData: any;
    let setData: any;

    render(
      <StoreProvider>
        <TestComponent 
          selector="number"
          onMount={(data) => { mountData = data; }} 
        />
        <TestComponent onMount={(data) => { wholeStoreData = data; }} />
        <TestComponent onMount={(_, set) => { setData = set; }} />
      </StoreProvider>
    );

    await act(async () => void setData((prev: number) => prev + 1, 'number'));

    expect(mountData).toBe(43);
    expect(wholeStoreData.string).toBe('initial');
    expect(wholeStoreData.number).toBe(43);
    expect(wholeStoreData.array).toEqual(['a', 'b', 'c']);
    expect(wholeStoreData.nested).toEqual({
      value: 'nested',
      deep: {
        value: 100
      }
    });
  });
}); 