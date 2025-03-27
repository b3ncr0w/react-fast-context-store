# React Fast Context Store

A lightweight state management solution for React applications using Context API with optimized re-renders.

## Why React Fast Context Store?

React's Context API has limitations with frequent updates:
- All consuming components re-render on any context change
- No granular control over which parts of the state components depend on
- Performance issues with high-frequency updates

React Fast Context Store solves these by:
- Selective updates: Components only re-render when their specific dependencies change
- Fine-grained control: Components can specify which parts of the state to observe or ignore
- Optimized for high-frequency updates: Perfect for real-time applications

## Features

- 🚀 Fast and lightweight
- 🔄 Optimized re-renders using selective updates
- 📦 TypeScript support
- 🎯 Granular state updates
- 🔍 Fine-grained control over component updates

## Installation

```bash
npm install react-fast-context-store
# or
yarn add react-fast-context-store
```

## Quick Start

1. Create a store with your initial state:

```typescript
import { createStore } from 'react-fast-context-store';

type StoreType = {
  mousePosition: { x: number; y: number };
  selectedItem: { id: string; position: { x: number; y: number } } | null;
};

const [StoreProvider, useStore] = createStore<StoreType>({
  mousePosition: { x: 0, y: 0 },
  selectedItem: null,
});
```

2. Wrap your app with the provider:

```typescript
function App() {
  return (
    <StoreProvider>
      <YourApp />
    </StoreProvider>
  );
}
```

3. Use the store in your components:

```typescript
// Component that only rerenders when mouseX changes
function MouseXDisplay() {
  const [getData] = useStore();
  const x = getData('mousePosition.x');
  return <div>Mouse X: {x}</div>;
}

// Component that rerenders when selected item changes, but not when any other data of the item changes
function SelectedItemDisplay() {
  const [getData] = useStore();
  const selectedItem = getData('selectedItem', {
    observedSelectors: ['selectedItem.id']
  });
  return (
    <div>
      Selected: {selectedItem?.id}
      Position on select: ({selectedItem.position.x}, {selectedItem.position.y})
    </div>
  );
}

// Component that updates the store using selectors
function MouseTracker() {
  const [, setData] = useStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setData(e.clientX, 'mousePosition.x');
      setData(e.clientY, 'mousePosition.y');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}

// Component that can be selected and updates its position in the store
function SelectableItem({ id }: { id: string }) {
  const [, setData] = useStore();

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setData(id, 'selectedItem.id');
    setData({ x: rect.left, y: rect.top }, 'selectedItem.position');
  };

  return (
    <div onClick={handleClick}>
      Item {id}
    </div>
  );
}
```

## API

### createStore

Creates a new store with the given initial state.

```typescript
const [StoreProvider, useStore] = createStore<StoreType>(initialState);
```

### useStore

Hook to access and update the store state.

```typescript
const [getData, setData] = useStore();

// Get data with selector
const value = getData('path.to.value');

// Get data with settings
const value = getData('path.to.value', {
  observedSelectors: ['path.to.value'],
  ignoredSelectors: ['path.to.value'],
});
```

### setData

Function to update store values with selective updates.

```typescript
// Update a single value
setData(newValue, 'path.to.value');

// Update without selector (replaces entire store)
setData(newStoreState);
```

The setter supports:
- Single value updates with a selector
- Full store replacement when no selector is provided
- Nested path selectors (e.g., 'user.settings.theme')

### Rerender Behavior

1. **No Selector**:
   ```typescript
   const data = getData();
   ```
   - Gets whole store data
   - Rerenders on every store update

2. **With Selector**:
   ```typescript
   const data = getData('data3.data2.data1');
   ```
   - Rerenders when the exact selector is used in setter
   - Other components using parent selectors will also rerender
   - Example: `setData(newValue, 'data3.data2.data1')` triggers rerender for:
     - Components with selector `data3.data2.data1`
     - Components with selector `data3.data2`
     - Components with selector `data3`

3. **With Empty observedSelectors**:
   ```typescript
   const data = getData('data', { observedSelectors: [] });
   ```
   - Only renders once when mounted
   - Never rerenders on store updates

4. **With observedSelectors**:
   ```typescript
   const data = getData('data', { 
     observedSelectors: ['data.items.*', 'data.settings.**'] 
   });
   ```
   - Rerenders only when data is changed using matching selectors
   - Other components using parent selectors ('data', 'data.items', 'data.settings') will not rerender
   - Patterns:
     - `*` matches any single level (e.g., `items.*` matches `items.0`, `items.1`)
     - `**` matches any level (e.g., `settings.**` matches `settings.theme.color`)
   - Example: `setData(newValue, 'data.items.0')` will trigger rerender because `data.items.*` matches the selector

5. **With ignoredSelectors**:
   ```typescript
   const data = getData('data', { 
     ignoredSelectors: ['data.temp', 'data.cache.*'] 
   });
   ```
   - Rerenders on changes that match the selector or observedSelectors, except for ignored selectors
   - Example: With selector 'data' and ignoredSelectors ['data.temp']:
     - `setData(newValue, 'data.temp')` will NOT trigger rerender
     - `setData(newValue, 'data.other')` will trigger rerender
   - Supports same patterns as observedSelectors

## License

MIT