# React Fast Context Store

A lightweight and performant state management solution for React applications using Context API with optimized re-renders.

## Why React Fast Context Store?

While React's Context API is great for sharing state, it has limitations when dealing with frequent updates:

### The Problem with Plain Context API

1. **Unnecessary Re-renders**: When using plain Context API, any change to the context value causes all consuming components to re-render, even if they only depend on a small part of the state.
2. **Performance Impact**: For high-frequency updates (like mouse movement or drag events), this can lead to significant performance issues.
3. **No Granular Control**: Components can't specify which parts of the context they care about.

### How React Fast Context Store Solves These Issues

1. **Selective Updates**: Components only re-render when their specific dependencies change:
   ```typescript
   // Only re-renders when mouseX changes
   const [mouseX] = useStore("mousePosition.x");
   
   // Only re-renders when mouseY changes
   const [mouseY] = useStore("mousePosition.y");
   ```

2. **Optimized for High-Frequency Updates**: Perfect for real-time applications:
   ```typescript
   function DraggableComponent() {
     const [, setPosition] = useStore();
     
     const handleMouseMove = (e: MouseEvent) => {
       // Updates only trigger re-renders in components that depend on position
       setPosition({ x: e.clientX, y: e.clientY }, "position");
     };
     
     return <div onMouseMove={handleMouseMove}>...</div>;
   }
   ```

3. **Fine-grained Control**: Components can specify exactly which parts of the state they want to observe or ignore:
   ```typescript
   function OptimizedComponent() {
     const [, setStore] = useStore({
       observedSelectors: ["position.x"], // Only observe x position
       ignoredSelectors: ["position.y"]   // Ignore y position changes
     });
     
     return <div>...</div>;
   }
   ```

4. **Memory Efficient**: No unnecessary state copies or complex state management overhead.

## Features

- 🚀 Fast and lightweight
- 🔄 Optimized re-renders using selective updates
- 📦 TypeScript support
- 🎯 Granular state updates
- 🔍 Fine-grained control over component updates
- 🎨 Easy to use API

## Installation

```bash
npm install react-fast-context-store
# or
yarn add react-fast-context-store
```

## Quick Start

1. Create a store with your initial state:

```typescript
import { createStore } from "react-fast-context-store";

type StoreType = {
  count: number;
  user: {
    name: string;
    email: string;
  };
};

const [StoreProvider, useStore] = createStore<StoreType>({
  count: 0,
  user: {
    name: "John Doe",
    email: "john@example.com"
  }
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
function Counter() {
  const [count, setCount] = useStore("count");
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
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
// Get and set a specific value
const [value, setValue] = useStore("path.to.value");

// Get and set multiple values
const [values, setValues] = useStore(["path1", "path2"]);

// Get and set the entire store
const [store, setStore] = useStore();
```

### Component Settings

You can control which parts of the store a component should observe:

```typescript
function MyComponent() {
  const [, setStore] = useStore({
    observedSelectors: ["user.name"], // Only re-render when user.name changes
    ignoredSelectors: ["user.email"]  // Ignore changes to user.email
  });
  
  return <div>...</div>;
}
```

## Advanced Usage

### Updating Nested State

```typescript
const [, setStore] = useStore();

// Update nested state
setStore("new value", "user.name");

// Update with previous state
setStore(prev => ({ ...prev, count: prev.count + 1 }), "user");
```

### Array Operations

```typescript
const [, setStore] = useStore();

// Add to array
setStore(prev => [...prev, newItem], "items");

// Remove from array
setStore(prev => prev.filter(item => item.id !== id), "items");
```

## Performance Optimization

The store is designed to minimize unnecessary re-renders by:
- Only updating components that depend on changed values
- Using selective updates with path-based state modifications
- Providing fine-grained control over which parts of the state a component observes

## License

MIT 