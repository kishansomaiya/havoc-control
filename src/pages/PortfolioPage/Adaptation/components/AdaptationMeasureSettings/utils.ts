import { GroupStrategySettings } from '../../../../../api/openapi/auto-generated';

interface StrategyInput {
    fire?: {
        strategies?: {
            FR_roof?: string | null;
            FR_vents?: string | null;
            FR_windows?: string | null;
        };
    };
    flooding?: {
        strategies?: {
            FL_dryFloodproof?: string | null;
            FL_elevateStructure?: string | null;
            FL_siteProtection?: string | null;
        };
    };
    heat?: {
        strategies?: {
            HT_airConditioning?: string | null;
            HT_coolRoof?: string | null;
        };
    };
    wind?: {
        strategies?: {
            WS_windRetrofit?: string | null;
        };
    };
}

interface MappedStrategies {
    elevateStructure: string;
    siteLevelProtection: string;
    floodProofing: boolean;
    windEngineeringRetrofit: string;
    nonFlammableRoofMaterial: boolean;
    doublePaneWindows: boolean;
    emberResistantVents: boolean;
    installAirConditioning: string;
    coalRoof: boolean;
}

const NULL_DEFAULT = 'None';
export function mapStrategies(
    strategies: StrategyInput | null | undefined
): MappedStrategies {
    const { fire, flooding, heat, wind } = strategies ?? {};

    return {
        elevateStructure:
            flooding?.strategies?.FL_elevateStructure ?? NULL_DEFAULT,
        siteLevelProtection:
            flooding?.strategies?.FL_siteProtection ?? NULL_DEFAULT,
        floodProofing: flooding?.strategies?.FL_dryFloodproof === 'Enabled',
        windEngineeringRetrofit:
            wind?.strategies?.WS_windRetrofit ?? NULL_DEFAULT,
        nonFlammableRoofMaterial: fire?.strategies?.FR_roof === 'Enabled',
        doublePaneWindows: fire?.strategies?.FR_windows === 'Enabled',
        emberResistantVents: fire?.strategies?.FR_vents === 'Enabled',
        installAirConditioning:
            heat?.strategies?.HT_airConditioning ?? NULL_DEFAULT,
        coalRoof: heat?.strategies?.HT_coolRoof === NULL_DEFAULT,
    };
}

export function mapStrategiesForSubmit(
    mappedStrategies: Partial<MappedStrategies> | null | undefined
): { [key: string]: GroupStrategySettings } {
    if (!mappedStrategies) {
        return {};
    }

    const {
        elevateStructure,
        siteLevelProtection,
        floodProofing,
        windEngineeringRetrofit,
        nonFlammableRoofMaterial,
        doublePaneWindows,
        emberResistantVents,
        installAirConditioning,
        coalRoof,
    } = mappedStrategies;

    return {
        fire: {
            strategies: {
                FR_roof: nonFlammableRoofMaterial ? 'Enabled' : undefined,
                FR_vents: emberResistantVents ? 'Enabled' : undefined,
                FR_windows: doublePaneWindows ? 'Enabled' : undefined,
            },
        },
        flooding: {
            strategies: {
                FL_dryFloodproof: floodProofing ? 'Enabled' : undefined,
                FL_elevateStructure:
                    elevateStructure !== NULL_DEFAULT
                        ? elevateStructure
                        : undefined,
                FL_siteProtection:
                    siteLevelProtection !== NULL_DEFAULT
                        ? siteLevelProtection
                        : undefined,
            },
        },
        heat: {
            strategies: {
                HT_airConditioning:
                    installAirConditioning !== NULL_DEFAULT
                        ? installAirConditioning
                        : undefined,
                HT_coolRoof: coalRoof ? NULL_DEFAULT : undefined,
            },
        },
        wind: {
            strategies: {
                WS_windRetrofit:
                    windEngineeringRetrofit !== NULL_DEFAULT
                        ? windEngineeringRetrofit
                        : undefined,
            },
        },
    };
}
