import {
    LossAssetAttributes,
    RoofCover,
    VentType,
    WindowPane,
} from '../../api/openapi/auto-generated';
import { DataVersion } from '../../types';

type LossAssetAttributeFlags = {
    [key in keyof LossAssetAttributes]: boolean | undefined;
};

export const FINANCIAL_BASE_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

export const ECONOMIC_IMPACT_DISABLED_OPTIONS: {
    [key in DataVersion]: LossAssetAttributeFlags;
} = {
    [DataVersion.v3_3_0]: {},
    [DataVersion.v3_2_0]: {},
    [DataVersion.v3_1_0]: {},
    [DataVersion.v3_0_0]: {
        /* Include Wildfire Loss */
        windowPane: true,
        ventType: true,
        roofCover: true,
        /* Include Utilities - Cost of Water */
        waterConsumption: true,
        waterShadowPriceRatio: true,
    },
    [DataVersion.v2_6_2]: {
        /* Default building attributes */
        firstFloorElevation: true,
        floorAreaSqm: true,
        /* Default asset values */
        downtimeValue: true,
        /* Advanced parameters */
        remoteWorkRatio: true,
        financialBaseYear: true,
        /* Include worker productivity and cost of cooling */
        electricityCostUsd: true,
        coolingSystemProbability: true,
        workIntensity: true,
        /* Include Wildfire Loss */
        windowPane: true,
        ventType: true,
        roofCover: true,
        /* Include Utilities - Cost of Water */
        waterConsumption: true,
        waterShadowPriceRatio: true,
        /* Include Financial Metrics */
        annualGrowth: true,
        annualVolatility: true,
        subIndustryCode: true,
        salesMargin: true,
        discountRate: true,
    },
};

export interface BooleanOption {
    value: boolean;
    disabled?: boolean;
}

export const DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS: {
    [key in DataVersion]: {
        includeWorkerProductivity: BooleanOption;
        includeCostOfCooling: BooleanOption;
        includeAcuteCombinedFlood: BooleanOption;
        includeAcuteWind: BooleanOption;
        includeWildfireLoss: BooleanOption;
        includeUtilitiesCostOfWater: BooleanOption;
        includeFinancialMetrics: BooleanOption;
        generatePortfolioLevelResults: BooleanOption;
    };
} = {
    [DataVersion.v3_3_0]: {
        includeWorkerProductivity: {
            value: true,
        },
        includeCostOfCooling: { value: true },
        includeWildfireLoss: { value: true },
        includeAcuteCombinedFlood: { value: true },
        includeAcuteWind: { value: true },
        includeUtilitiesCostOfWater: { value: true },
        includeFinancialMetrics: { value: true },
        generatePortfolioLevelResults: { value: true },
    },
    [DataVersion.v3_2_0]: {
        includeWorkerProductivity: {
            value: true,
        },
        includeCostOfCooling: { value: true },
        includeWildfireLoss: { value: true },
        includeAcuteCombinedFlood: { value: true },
        includeAcuteWind: { value: true },
        includeUtilitiesCostOfWater: { value: true },
        includeFinancialMetrics: { value: true },
        generatePortfolioLevelResults: { value: true },
    },
    [DataVersion.v3_1_0]: {
        includeWorkerProductivity: {
            value: true,
        },
        includeCostOfCooling: { value: true },
        includeWildfireLoss: { value: true },
        includeAcuteCombinedFlood: { value: true },
        includeAcuteWind: { value: true },
        includeUtilitiesCostOfWater: { value: true },
        includeFinancialMetrics: { value: true },
        generatePortfolioLevelResults: { value: true },
    },
    [DataVersion.v3_0_0]: {
        includeWorkerProductivity: { value: true },
        includeCostOfCooling: { value: true },
        includeWildfireLoss: { value: false, disabled: true },
        includeAcuteCombinedFlood: { value: true },
        includeAcuteWind: { value: true },
        includeUtilitiesCostOfWater: { value: false, disabled: true },
        includeFinancialMetrics: { value: true },
        generatePortfolioLevelResults: { value: false, disabled: true },
    },
    [DataVersion.v2_6_2]: {
        includeWorkerProductivity: {
            value: false,
            disabled: true,
        },
        includeCostOfCooling: {
            value: false,
            disabled: true,
        },
        includeWildfireLoss: { value: false, disabled: true },
        includeAcuteCombinedFlood: { value: false, disabled: true },
        includeAcuteWind: { value: false, disabled: true },
        includeUtilitiesCostOfWater: { value: false, disabled: true },
        includeFinancialMetrics: { value: false, disabled: true },
        generatePortfolioLevelResults: { value: false, disabled: true },
    },
};

export const DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS: {
    [key in DataVersion]: LossAssetAttributes;
} = {
    [DataVersion.v3_3_0]: {
        /* Default building attributes */
        occupancyScheme: 'OED',
        occupancyCode: 1000,
        numberOfStories: 0,
        basementCode: 1,
        firstFloorElevation: undefined,
        floorAreaSqm: undefined,
        /* Default asset values */
        totalValue: 0,
        buildingValue: 0,
        contentsValue: 0,
        inventoryValue: 0,
        downtimeValue: 0,
        /* Advanced parameters */
        remoteWorkRatio: undefined,
        financialBaseYear: 2020,
        /* Include worker productivity and cost of cooling */
        electricityCostUsd: undefined,
        coolingSystemProbability: undefined,
        workIntensity: undefined,
        /* Include Wildfire Loss */
        windowPane: undefined,
        ventType: undefined,
        roofCover: undefined,
        /* Include Utilities - Cost of Water */
        waterConsumption: undefined,
        waterShadowPriceRatio: undefined,
        /* Financial Metrics */
        /* Include Financial Metrics */
        annualGrowth: undefined,
        annualVolatility: undefined,
        subIndustryCode: undefined,
        salesMargin: undefined,
        discountRate: undefined,
    },
    [DataVersion.v3_2_0]: {
        /* Default building attributes */
        occupancyScheme: 'OED',
        occupancyCode: 1000,
        numberOfStories: 0,
        basementCode: 1,
        firstFloorElevation: undefined,
        floorAreaSqm: undefined,
        /* Default asset values */
        totalValue: 0,
        buildingValue: 0,
        contentsValue: 0,
        inventoryValue: 0,
        downtimeValue: 0,
        /* Advanced parameters */
        remoteWorkRatio: undefined,
        financialBaseYear: 2020,
        /* Include worker productivity and cost of cooling */
        electricityCostUsd: undefined,
        coolingSystemProbability: undefined,
        workIntensity: undefined,
        /* Include Wildfire Loss */
        windowPane: undefined,
        ventType: undefined,
        roofCover: undefined,
        /* Include Utilities - Cost of Water */
        waterConsumption: undefined,
        waterShadowPriceRatio: undefined,
        /* Financial Metrics */
        /* Include Financial Metrics */
        annualGrowth: undefined,
        annualVolatility: undefined,
        subIndustryCode: undefined,
        salesMargin: undefined,
        discountRate: undefined,
    },
    [DataVersion.v3_1_0]: {
        /* Default building attributes */
        occupancyScheme: 'OED',
        occupancyCode: 1000,
        numberOfStories: 0,
        basementCode: 1,
        firstFloorElevation: undefined,
        floorAreaSqm: undefined,
        /* Default asset values */
        totalValue: 0,
        buildingValue: 0,
        contentsValue: 0,
        inventoryValue: 0,
        downtimeValue: 0,
        /* Advanced parameters */
        remoteWorkRatio: undefined,
        financialBaseYear: 2020,
        /* Include worker productivity and cost of cooling */
        electricityCostUsd: undefined,
        coolingSystemProbability: undefined,
        workIntensity: undefined,
        /* Include Wildfire Loss */
        windowPane: undefined,
        ventType: undefined,
        roofCover: undefined,
        /* Include Utilities - Cost of Water */
        waterConsumption: undefined,
        waterShadowPriceRatio: undefined,
        /* Financial Metrics */
        /* Include Financial Metrics */
        annualGrowth: undefined,
        annualVolatility: undefined,
        subIndustryCode: undefined,
        salesMargin: undefined,
        discountRate: undefined,
    },
    [DataVersion.v3_0_0]: {
        /* Default building attributes */
        occupancyScheme: 'OED',
        occupancyCode: 1000,
        numberOfStories: 0,
        basementCode: 1,
        firstFloorElevation: undefined,
        floorAreaSqm: undefined,
        /* Default asset values */
        totalValue: 0,
        buildingValue: 0,
        contentsValue: 0,
        inventoryValue: 0,
        downtimeValue: 0,
        /* Advanced parameters */
        remoteWorkRatio: undefined,
        financialBaseYear: 2020,
        /* Include worker productivity and cost of cooling */
        electricityCostUsd: undefined,
        coolingSystemProbability: undefined,
        workIntensity: undefined,
        /* Include Wildfire Loss */
        windowPane: undefined,
        ventType: undefined,
        roofCover: undefined,
        /* Include Utilities - Cost of Water */
        waterConsumption: undefined,
        waterShadowPriceRatio: undefined,
        /* Financial Metrics */
        /* Include Financial Metrics */
        annualGrowth: undefined,
        annualVolatility: undefined,
        subIndustryCode: undefined,
        salesMargin: undefined,
        discountRate: undefined,
    },
    [DataVersion.v2_6_2]: {
        /* Default building attributes */
        occupancyScheme: 'ATC',
        occupancyCode: 0,
        numberOfStories: 0,
        basementCode: 1,
        firstFloorElevation: undefined,
        floorAreaSqm: undefined,
        /* Default asset values */
        totalValue: 0,
        buildingValue: 0,
        contentsValue: 0,
        inventoryValue: 0,
        downtimeValue: 0,
        /* Advanced parameters */
        remoteWorkRatio: undefined,
        financialBaseYear: 2020,
        /* Include worker productivity and cost of cooling */
        electricityCostUsd: undefined,
        coolingSystemProbability: undefined,
        workIntensity: undefined,
        /* Include Wildfire Loss */
        windowPane: undefined,
        ventType: undefined,
        roofCover: undefined,
        /* Include Utilities - Cost of Water */
        waterConsumption: undefined,
        waterShadowPriceRatio: undefined,
        /* Financial Metrics */
        /* Include Financial Metrics */
        annualGrowth: undefined,
        annualVolatility: undefined,
        subIndustryCode: undefined,
        salesMargin: undefined,
        discountRate: undefined,
    },
};

export const DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS_RES: LossAssetAttributes =
    {
        /* Default building attributes */
        occupancyScheme: 'OED',
        occupancyCode: 1000,
        numberOfStories: 0,
        basementCode: 1,
        firstFloorElevation: undefined,
        floorAreaSqm: undefined,
        /* Default asset values */
        totalValue: 0,
        buildingValue: 0,
        contentsValue: 0,
        inventoryValue: 0,
        downtimeValue: 0,
        /* Advanced parameters */
        remoteWorkRatio: undefined,
        financialBaseYear: 2020,
        /* Include worker productivity and cost of cooling */
        electricityCost: undefined,
        electricityCostUsd: undefined,
        coolingSystemProbability: undefined,
        workIntensity: undefined,
        /* Include Wildfire Loss */
        windowPane: WindowPane.unknown,
        ventType: VentType.unknown,
        roofCover: RoofCover.unknown,
        /* Include Utilities - Cost of Water */
        waterConsumption: undefined,
        waterShadowPriceRatio: undefined,
        /* Financial Metrics */
        /* Include Financial Metrics */
        annualGrowth: undefined,
        annualVolatility: undefined,
        subIndustryCode: undefined,
        salesMargin: undefined,
        discountRate: undefined,
    };

export const DEFAULT_ENABLED_PRPL: {
    [key in DataVersion]: boolean;
} = {
    [DataVersion.v3_3_0]: true,
    [DataVersion.v3_2_0]: true,
    [DataVersion.v3_1_0]: true,
    [DataVersion.v3_0_0]: false,
    [DataVersion.v2_6_2]: false, // Even if 2.6.2 is depricated, need to set here to avoid static type errors
};
