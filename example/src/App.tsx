import { Component } from './components/Component';
import { useFastStore } from './store';

const App = () => {
  const [getData, setData] = useFastStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Component />
        <Component settings={{ observedSelectors: [] }} />
        <Component settings={{ observedSelectors: ['data1'] }} />
        <Component settings={{ observedSelectors: ['data3.data2.data1'] }} />
        <Component settings={{ ignoredSelectors: ['data1'] }} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Component selector='data2'></Component>
        <Component selector='data3'></Component>
        <Component
          selector='data3'
          settings={{ ignoredSelectors: ['data3.data1'] }}
        ></Component>
        <Component
          selector='data3'
          settings={{ observedSelectors: ['data3.*'] }}
        ></Component>
        <Component
          selector='data3'
          settings={{ observedSelectors: ['data3.**'] }}
        ></Component>
        <Component selector='data3.data2'></Component>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Component selector='array1'>
          <button
            onClick={() =>
              setData((prev) => [...prev, 'el' + (prev.length + 1)], 'array1')
            }
          >
            Add
          </button>
          <button
            onClick={() => setData((prev) => prev.slice(0, -1), 'array1')}
          >
            Remove
          </button>
        </Component>
        <Component selector='data1'>
          <input
            type='text'
            defaultValue={getData('data1', { observedSelectors: [] })}
            onChange={(e) => setData(e.target.value, 'data1')}
          />
        </Component>
        <Component selector='data2.data1'>
          <input
            type='text'
            defaultValue={getData('data2.data1', {
              observedSelectors: [],
            })}
            onChange={(e) => setData(e.target.value, 'data2.data1')}
          />
        </Component>
        <Component selector='data3.data1'>
          <input
            type='text'
            defaultValue={getData('data3.data1', {
              observedSelectors: [],
            })}
            onChange={(e) => setData(e.target.value, 'data3.data1')}
          />
        </Component>
        <Component selector='data3.data2.data1'>
          <input
            type='text'
            defaultValue={getData('data3.data2.data1', {
              observedSelectors: [],
            })}
            onChange={(e) => setData(e.target.value, 'data3.data2.data1')}
          />
        </Component>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => {
            const hash = Number(Math.random() * 10000).toFixed(0);
            setData('data1' + `(${hash})`, 'data1');
            setData((prev) => [...prev, 'el' + (prev.length + 1)], 'array1');
          }}
        >
          Change multiple data at once
          <br />
          (data1 and array1)
        </button>
        <button
          onClick={() => {
            const hash = Number(Math.random() * 10000).toFixed(0);
            setData({
              array1: ['el1' + `(${hash})`, 'el2' + `(${hash})`, 'el3' + `(${hash})`],
              data1: 'data1' + `(${hash})`,
              data2: {
                data1: 'data2-1' + `(${hash})`,
              },
              data3: {
                data1: 'data3-1' + `(${hash})`,
                data2: {
                  data1: 'data3-2-1' + `(${hash})`,
                },
              },
            });
          }}
        >
          Change whole store
        </button>
        <button
          onClick={() => {
            const hash = Number(Math.random() * 10000).toFixed(0);
            setData({
              array1: ['el1' + `(${hash})`, 'el2' + `(${hash})`, 'el3' + `(${hash})`],
              data1: 'data1' + `(${hash})`,
              data2: {
                data1: 'data2-1' + `(${hash})`,
              },
              data3: {
                data1: 'data3-1' + `(${hash})`,
                data2: {
                  data1: 'data3-2-1' + `(${hash})`,
                },
              },
            });
          }}
        >
          Change whole store and force rerender
        </button>
        <button
          onClick={() => {
            const hash = Number(Math.random() * 10000).toFixed(0);
            setData({
              data1: 'data2-1' + `(${hash})`,
            }, 'data2');
          }}
        >
          Change data2 object
        </button>
      </div>
    </div>
  );
};

export default App;
