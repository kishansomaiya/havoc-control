export type DesignLevelOptions = '50' | '100' | '200' | '500';
export type EffectivenessOptions = '25%' | '50%' | '75%' | '100%';

export type SidebarSelection = {
    implementationYear: string;
    floodRaiseStructure: boolean;
    floodRaiseStructureDesignLevel: DesignLevelOptions;
    floodElevateSensitive: boolean;
    floodElevateSensitiveDesignLevel: DesignLevelOptions;
    floodProofing: boolean;
    windEngineering: boolean;
    windDesignLevel: DesignLevelOptions;
    wildfireNonFlammableRoof: boolean;
    wildfireDoublePaneWindows: boolean;
    nonExposedVents: boolean;
    heatActiveCooling: boolean;
    heatPassiveCooling: boolean;
    heatEffectiveness: EffectivenessOptions;
};

interface StrategyDetails {
    strategyValues?: {
        [value: string]: number[] | undefined;
    };
    notApplicable?: Array<{
        customerLocationIds?: number[];
        reason?: string;
    }>;
}

interface ConsistentStrategy {
    type: 'consistent' | 'ConsistentStrategy';
    value?: string;
}

interface InconsistentStrategy {
    type: 'inconsistent' | 'InconsistentStrategy';
    details?: StrategyDetails;
}

type Strategy = ConsistentStrategy | InconsistentStrategy;

interface StrategyInput {
    strategies?: {
        [key: string]: Strategy | undefined;
    };
}

export type InconsistencyReason = {
    notApplicable: {
        customerLocationId: number;
        reason?: string;
        name?: string;
    }[];
    overridden: {
        customerLocationId: number;
        currentValue: unknown;
        name?: string;
    }[];
};

export type InconsistentState = {
    [key: string]: InconsistencyReason;
};

function getMostFrequentValue(details?: StrategyDetails): string {
    if (!details?.strategyValues) return 'None';

    let maxCount = 0;
    let mostFrequentValue = 'None';

    Object.entries(details.strategyValues).forEach(([value, ids]) => {
        if (!ids || !Array.isArray(ids)) return;

        const count = ids.length;
        if (count > maxCount) {
            maxCount = count;
            mostFrequentValue = value;
        }
    });

    return mostFrequentValue;
}

function getStrategyValue(strategy?: Strategy): string {
    if (!strategy) return 'None';

    if (strategy.type === 'consistent') {
        return strategy.value ?? 'None';
    } else if (strategy.type === 'inconsistent') {
        return getMostFrequentValue(strategy.details);
    }
    return 'None';
}

function isEnabled(value?: string): boolean {
    if (!value) return false;
    return value !== 'None' && value !== 'Disabled';
}

function getDesignLevel(value?: string): DesignLevelOptions {
    if (!value) return '100';

    // Extract numeric value and map to design level options
    const match = value.match(/(\d+)/);
    if (match) {
        const num = match[1];
        if (num && ['50', '100', '200', '500'].includes(num)) {
            return num as DesignLevelOptions;
        }
    }
    return '100';
}

function mapStrategyToSidebarSelection(
    key?: string,
    value?: string,
    result?: Partial<SidebarSelection>
): void {
    if (!key || !result) return;

    switch (key) {
        case 'FL_elevateStructure':
            result.floodRaiseStructure = isEnabled(value);
            if (result.floodRaiseStructure) {
                result.floodRaiseStructureDesignLevel = getDesignLevel(value);
            }
            break;

        case 'FL_dryFloodproof':
            result.floodProofing = isEnabled(value);
            break;

        case 'FL_siteProtection':
            // This might map to floodElevateSensitive based on context
            result.floodElevateSensitive = isEnabled(value);
            if (result.floodElevateSensitive) {
                result.floodElevateSensitiveDesignLevel = getDesignLevel(value);
            }
            break;

        case 'WS_windRetrofit':
            result.windEngineering = isEnabled(value);
            if (result.windEngineering) {
                result.windDesignLevel = getDesignLevel(value);
            }
            break;

        case 'FR_roof':
            result.wildfireNonFlammableRoof = isEnabled(value);
            break;

        case 'FR_windows':
            result.wildfireDoublePaneWindows = isEnabled(value);
            break;

        case 'FR_vents':
            result.nonExposedVents = isEnabled(value);
            break;

        case 'HT_airConditioning':
            result.heatActiveCooling = isEnabled(value);
            if (result.heatActiveCooling) {
                result.heatEffectiveness =
                    (value as EffectivenessOptions) ?? '100%';
            }
            break;

        case 'HT_coolRoof':
            result.heatPassiveCooling = isEnabled(value);
            break;
    }
}

export const initialSelectedSettings: SidebarSelection = {
    implementationYear: '2025',
    floodRaiseStructure: false,
    floodRaiseStructureDesignLevel: '100',
    floodElevateSensitive: false,
    floodElevateSensitiveDesignLevel: '100',
    floodProofing: false,
    windEngineering: false,
    windDesignLevel: '100',
    wildfireNonFlammableRoof: false,
    wildfireDoublePaneWindows: false,
    nonExposedVents: false,
    heatActiveCooling: false,
    heatPassiveCooling: false,
    heatEffectiveness: '100%',
};

export function convertStrategiesToSidebarSelection(
    input?: StrategyInput
): SidebarSelection {
    const result = structuredClone(initialSelectedSettings);
    if (!input?.strategies) return result;

    const { strategies } = input;

    // Map strategies to sidebar selection properties
    Object.entries(strategies).forEach(([key, strategy]) => {
        if (!strategy) return;

        const value = getStrategyValue(strategy);
        mapStrategyToSidebarSelection(key, value, result);
    });

    return result;
}

export function extractInconsistencyState(
    input?: StrategyInput,
    locationList?: {
        customerLocationId: number;
        locationName?: string | null;
    }[]
): InconsistentState {
    const result: InconsistentState = {};

    if (!input?.strategies) return result;
    const { strategies } = input;

    Object.entries(strategies).forEach(([strategyKey, strategy]) => {
        if (
            !(
                strategy &&
                (strategy.type === 'inconsistent' ||
                    strategy.type === 'InconsistentStrategy') &&
                strategy.details
            )
        )
            return;

        const { details } = strategy;

        // Get the most frequent value to determine what's overridden
        const mostCommonValue = getMostFrequentValue(details);

        // Initialize arrays for each type of inconsistency
        const notApplicableEntries: Array<{
            customerLocationId: number;
            name?: string;
            reason?: string;
        }> = [];
        const overriddenEntries: Array<{
            customerLocationId: number;
            name?: string;
            currentValue: unknown;
        }> = [];

        // Collect notApplicable entries
        if (details.notApplicable && details.notApplicable.length > 0) {
            details.notApplicable.forEach((entry) => {
                if (
                    entry.customerLocationIds &&
                    entry.customerLocationIds.length > 0
                ) {
                    entry.customerLocationIds.forEach((locationId) => {
                        const name = locationList?.find(
                            ({ customerLocationId }) =>
                                locationId === customerLocationId
                        )?.locationName;

                        notApplicableEntries.push({
                            customerLocationId: locationId,
                            name: name || undefined,
                            reason: entry.reason,
                        });
                    });
                }
            });
        }

        // Collect overridden values (values that don't match the most common value)
        if (details.strategyValues) {
            Object.entries(details.strategyValues).forEach(
                ([value, customerLocationIds]) => {
                    // Skip if this is the most common value or if no customer location IDs
                    if (
                        value === mostCommonValue ||
                        !customerLocationIds ||
                        !Array.isArray(customerLocationIds) ||
                        customerLocationIds.length === 0
                    ) {
                        return;
                    }

                    // Add each customer location ID as an overridden entry
                    customerLocationIds.forEach((locationId) => {
                        const name = locationList?.find(
                            ({ customerLocationId }) =>
                                locationId === customerLocationId
                        )?.locationName;

                        overriddenEntries.push({
                            customerLocationId: locationId,
                            name: name || undefined,
                            currentValue: value,
                        });
                    });
                }
            );
        }

        // Only add to result if there are inconsistencies
        if (notApplicableEntries.length > 0 || overriddenEntries.length > 0) {
            result[strategyKey] = {
                notApplicable: notApplicableEntries,
                overridden: overriddenEntries,
            };
        }
    });

    return result;
}
