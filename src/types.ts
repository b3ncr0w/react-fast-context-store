export type SettingsType = {
  observedSelectors?: string[];
  ignoredSelectors?: string[];
};

export type UpdatePropsType = {
  selector?: string;
  baseSelector?: string;
  settings?: SettingsType;
  forceRerender?: boolean;
};

export type SubscriberType = {
  onUpdate: (props: UpdatePropsType) => void;
  baseSelector?: string;
  settings?: SettingsType;
};

export type PathValue<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : never;
