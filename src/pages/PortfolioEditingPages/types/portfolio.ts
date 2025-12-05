import {
    FloodDefenseOptions,
    PerilsResultSetOptionsScenariosEnum,
    MeshType,
    MeshResultSetOptionsScenariosEnum,
} from '../../../api/openapi/auto-generated';
import {
    DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS,
    DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS,
    DEFAULT_MESH_RESULT_SET_OPTIONS,
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
    DEFAULT_SCORE_RESULT_SET_OPTIONS,
} from '../../../const';
import {
    BenchmarkLevel,
    DataVersion,
    EIVersion,
    OccupancyScheme,
    occupancySchemeFromValue,
    Peril,
    Score,
} from '../../../types';
import {
    BasementCode,
    basementCodeFromValue,
} from '../../../types/basementCodeEnum';
import { RoofCover, roofCoverFromValue } from '../../../types/roofCoverEnum';
import { VentType, ventTypeFromValue } from '../../../types/ventTypeEnum';
import { WindowPane, windowPaneFromValue } from '../../../types/windowPaneEnum';
import {
    WorkIntensity,
    workIntensityFromValue,
} from '../../../types/workIntensityEnum';
import { AnalysisType } from './analysisTypeEnum';

interface CustomAnalysis {
    perilMetrics: {
        perils: Peril[];
        years: number[];
        scenarios: PerilsResultSetOptionsScenariosEnum[];
        floodDefenseOptions: FloodDefenseOptions;
    };
    economicImpacts: {
        defaultBuildingAttributes: {
            occupancyScheme: OccupancyScheme;
            occupancyCode?: number;
            numberOfStories?: number;
            basementCode?: BasementCode;
            firstFloorElevation?: number;
            floorAreaSqm?: number;
        };
        defaultAssetValues: {
            total?: number;
            building?: number;
            contents?: number;
            inventory?: number;
            downtime?: number;
        };
        advancedParameters: {
            remoteWorkRatio?: number;
            financialBaseYear?: number;

            includeWorkerProductivity: boolean;
            includeCostOfCooling: boolean;
            workerProductivity: {
                workIntensity?: WorkIntensity;
            };
            costOfCooling: {
                electricityCostUsd?: number;
            };
            workerProductivityOrCostOfCooling: {
                coolingSystemProbability?: number;
            };
            includeWildfireLoss: boolean;
            wildfireLoss: {
                windowPane?: WindowPane;
                ventType?: VentType;
                roofCover?: RoofCover;
            };

            includeAcuteCombinedFlood: boolean;
            includeAcuteWind: boolean;

            includeUtilitiesCostOfWater: boolean;
            utilitiesCostOfWater: {
                waterConsumption?: number;
                waterShadowPriceRatio?: number;
            };
        };
        financialParameters: {
            includeFinancialMetrics: boolean;
            financialMetrics: {
                annualGrowth?: number;
                annualVolatility?: number;
                subIndustryCode?: string;
                salesMargin?: number;
                discountRate?: number;
                generatePortfolioLevelResults: boolean;
            };
        };
    };
    scores: {
        perils: Score[];
        includeBenchmarks: boolean;
        benchmarkLevels: BenchmarkLevel[];
    };
    floodMesh: {
        mesh: {
            width?: number;
            height?: number;
            type?: MeshType;
        };
        scenarios: MeshResultSetOptionsScenariosEnum[];
        years: number[];
        floodDefense: {
            enabled: boolean;
            zeroOutDefendedLocations: boolean;
        };
    };
}
export interface IPortfolio {
    name: string;
    locationCount: number;
    category: {
        id: string;
        label: string;
    } | null;
    dataVersion: DataVersion;
    eiVersion?: EIVersion;
    type: AnalysisType;

    runDisclosureAnalysis?: boolean;
    runAdaptationOpportunitiesAnalysis?: boolean;

    changeAnalysisType: boolean;
    isMockPortfolio: boolean;

    isPerilMetricsEnabled: boolean;
    isEconomicImpactsEnabled: boolean;
    isScoresEnabled: boolean;
    isFloodMeshEnabled: boolean;

    custom: CustomAnalysis;

    // Fake fields for custom validation errors not bound to specific fields
    hasAtLeastOneResultSet?: never;
}

export function defaultCustomAnalysisData(
    dataVersion: DataVersion
): CustomAnalysis {
    const perilDefaults = DEFAULT_PERIL_RESULT_SET_OPTIONS[dataVersion];
    const scoreDefaults = DEFAULT_SCORE_RESULT_SET_OPTIONS[dataVersion];
    const economicImpactDefaults =
        DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[dataVersion];
    const economicImpactAdditionalDefaults =
        DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS[dataVersion];
    const meshDefaults = DEFAULT_MESH_RESULT_SET_OPTIONS[dataVersion];

    return {
        perilMetrics: {
            perils: [...(perilDefaults?.perils ?? [])] as Peril[],
            years: [...(perilDefaults?.years ?? [])],
            scenarios: [...(perilDefaults?.scenarios ?? [])],
            floodDefenseOptions: {
                ...perilDefaults?.floodDefense,
            },
        },
        economicImpacts: {
            defaultBuildingAttributes: {
                occupancyScheme: economicImpactDefaults.occupancyScheme
                    ? occupancySchemeFromValue(
                          economicImpactDefaults.occupancyScheme
                      ) ?? 'OED'
                    : 'OED',
                occupancyCode: economicImpactDefaults.occupancyCode,
                numberOfStories: economicImpactDefaults.numberOfStories,
                basementCode: economicImpactDefaults.basementCode
                    ? basementCodeFromValue(economicImpactDefaults.basementCode)
                    : 'unknown',
            },
            defaultAssetValues: {
                total: economicImpactDefaults.totalValue,
                building: economicImpactDefaults.buildingValue,
                contents: economicImpactDefaults.contentsValue,
                inventory: economicImpactDefaults.inventoryValue,
                downtime: economicImpactDefaults.downtimeValue,
            },
            advancedParameters: {
                remoteWorkRatio: economicImpactDefaults.remoteWorkRatio,
                financialBaseYear: economicImpactDefaults.financialBaseYear,
                includeWorkerProductivity:
                    economicImpactAdditionalDefaults.includeWorkerProductivity
                        .value,
                includeCostOfCooling:
                    economicImpactAdditionalDefaults.includeCostOfCooling.value,
                includeAcuteCombinedFlood:
                    economicImpactAdditionalDefaults.includeAcuteCombinedFlood
                        .value,
                includeAcuteWind:
                    economicImpactAdditionalDefaults.includeAcuteWind.value,
                workerProductivity: {
                    workIntensity: economicImpactDefaults.workIntensity
                        ? workIntensityFromValue(
                              economicImpactDefaults.workIntensity
                          )
                        : undefined,
                },
                costOfCooling: {
                    electricityCostUsd: economicImpactDefaults.electricityCost,
                },
                workerProductivityOrCostOfCooling: {
                    coolingSystemProbability:
                        economicImpactDefaults.coolingSystemProbability,
                },
                includeWildfireLoss:
                    economicImpactAdditionalDefaults.includeWildfireLoss.value,
                wildfireLoss: {
                    windowPane: economicImpactDefaults.windowPane
                        ? windowPaneFromValue(economicImpactDefaults.windowPane)
                        : undefined,
                    ventType: economicImpactDefaults.ventType
                        ? ventTypeFromValue(economicImpactDefaults.ventType)
                        : undefined,
                    roofCover: economicImpactDefaults.roofCover
                        ? roofCoverFromValue(economicImpactDefaults.roofCover)
                        : undefined,
                },
                includeUtilitiesCostOfWater:
                    economicImpactAdditionalDefaults.includeUtilitiesCostOfWater
                        .value,
                utilitiesCostOfWater: {
                    waterConsumption: economicImpactDefaults.waterConsumption,
                    waterShadowPriceRatio:
                        economicImpactDefaults.waterShadowPriceRatio,
                },
            },
            financialParameters: {
                includeFinancialMetrics:
                    economicImpactAdditionalDefaults.includeFinancialMetrics
                        .value,
                financialMetrics: {
                    annualGrowth: economicImpactDefaults.annualGrowth,
                    annualVolatility: economicImpactDefaults.annualVolatility,
                    subIndustryCode: economicImpactDefaults.subIndustryCode,
                    salesMargin: economicImpactDefaults.salesMargin,
                    discountRate: economicImpactDefaults.discountRate,
                    generatePortfolioLevelResults:
                        economicImpactAdditionalDefaults
                            .generatePortfolioLevelResults.value,
                },
            },
        },
        scores: {
            perils: [...(scoreDefaults.perils ?? [])] as Score[],
            includeBenchmarks: scoreDefaults.includeBenchmarks ?? false,
            benchmarkLevels: [
                ...(scoreDefaults.benchmarkLevels ?? []),
            ] as BenchmarkLevel[],
        },
        floodMesh: {
            mesh: {
                type: MeshType.dynamic,
            },
            scenarios: [...(meshDefaults?.scenarios ?? [])],
            years: [...(meshDefaults.years ?? [])],
            floodDefense: {
                enabled: true,
                zeroOutDefendedLocations: true,
            },
        },
    };
}
