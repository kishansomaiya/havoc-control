export const featureFlags = {
    adaptationModuleEnabled: 'adaptation_module_enabled',
    data330Enabled: 'data_3.3.0_enabled',
};

export type FeatureFlags = keyof typeof featureFlags;
