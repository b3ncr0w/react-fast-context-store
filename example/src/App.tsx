import { Component } from "./components/Component";
import { useFastStore } from "./store";

const App = () => {
  const [, setStoreData] = useFastStore();

  return (
    <>
      <Component
        settings={{
          // observedSelectors: ["data3.**"],
          // ignoredSelectors: ["data3.*.data1"],
        }}
      />
      <Component selector="data3" />
      <Component selector="data3.data1" />
      <Component selector="array1" />
      <Component selector="data3.data2.data1" />

      <button onClick={() => setStoreData("edited data1", "data1")}>
        Change data1
      </button>
      <button onClick={() => setStoreData("edited data3-1", "data3.data1")}>
        Change data3.data1
      </button>
      <button
        onClick={() =>
          setStoreData((prev) => ({ ...prev, data1: "edited data1" }), "data3")
        }
      >
        Change data3 {">"} data1
      </button>
      <button
        onClick={() =>
          setStoreData((prev) => [...prev, `el${prev.length + 1}`], "array1")
        }
      >
        Add to array
      </button>
      <button
        onClick={() => setStoreData((prev) => prev.slice(0, -1), "array1")}
      >
        Remove last from array
      </button>
      <button
        onClick={() => setStoreData("edited data3-2-1", "data3.data2.data1")}
      >
        Change data3-data-2-data1
      </button>
    </>
  );
};

export default App;
