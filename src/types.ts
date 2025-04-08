export interface GetterSettings {
  observedSelectors?: string[];
  ignoredSelectors?: string[];
}

export interface SetterSettings {
  forceRerender?: boolean;
  immutable?: boolean;
}

export interface UpdateProps {
  selector?: string;
  baseSelector?: string;
  settings?: GetterSettings;
  forceRerender?: boolean;
}

export interface Subscriber {
  onUpdate: (props: UpdateProps) => void;
  baseSelector?: string;
  settings?: GetterSettings;
}

export type PathValue<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : any
  : any;

export type GetStoreData<T> = <Path extends string | undefined = undefined>(
  selector?: Path,
  settings?: GetterSettings
) => Path extends string ? PathValue<T, Path> : Path extends undefined ? T : any;

export type SetStoreData<T> = <Path extends string | undefined = undefined>(
  value: ((prev: Path extends string ? PathValue<T, Path> : T) => Path extends string ? PathValue<T, Path> : T) | (Path extends string ? PathValue<T, Path> : T),
  selector?: Path,
  settings?: SetterSettings
) => void;

export type UseStore<T> = () => readonly [GetStoreData<T>, SetStoreData<T>];
