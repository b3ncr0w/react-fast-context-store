export type SettingsType = {
    doObserveChanges?: boolean;
    doUpdateOnlyWhenDataChanges?: boolean;
    observedSelectors?: string[];
    ignoredSelectors?: string[];

    doForceUpdate?: boolean;
};

export type UpdatePropsType = {
    selector?: string;
    settings?: SettingsType;
};
