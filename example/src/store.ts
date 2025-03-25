import { createStore } from "react-fast-context-store";

export type FastStoreDataType = {
  array1: string[];
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
};

export const [FastStoreProvider, useFastStore] = createStore<FastStoreDataType>({
  array1: ["el1", "el2", "el3"],
  data1: "data1",
  data2: {
    data1: "data2-1",
  },
  data3: {
    data1: "data3-1",
    data2: {
      data1: "data3-2-1",
    },
  },
});