import { describe, it, expect } from 'vitest';
import { portfolioFormSchema } from './portfolioFormSchema';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import { Scenario } from '../../../../../types';

const base = {
    name: 'Portfolio',
    category: {},
    dataVersion: 'v3.2.0',
    type: AnalysisType.Custom,
    changeAnalysisType: true,
    isPerilMetricsEnabled: false,
    isEconomicImpactsEnabled: false,
    isScoresEnabled: false,
    isFloodMeshEnabled: false,
    custom: {
        perilMetrics: {
            perils: ['Flood'],
            years: [2020],
            scenarios: ['SSP585'],
        },
        economicImpacts: {
            defaultBuildingAttributes: {
                occupancyScheme: 'ATC',
                occupancyCode: 0,
                numberOfStories: 0,
                firstFloorElevation: 0,
                floorAreaSqm: 0,
            },
            defaultAssetValues: {
                total: 0,
                building: 0,
                contents: 0,
                inventory: 0,
                downtime: 0,
            },
            advancedParameters: {
                remoteWorkRatio: 0,
                includeWorkerProductivity: false,
                includeCostOfCooling: false,
                workerProductivityOrCostOfCooling: {
                    coolingSystemProbability: 0,
                },
                includeUtilitiesCostOfWater: false,
            },
            financialParameters: {
                includeFinancialMetrics: false,
                financialMetrics: {},
            },
        },
        scores: {
            includeBenchmarks: false,
            benchmarkLevels: [],
            perils: ['Flood'],
        },
        floodMesh: { scenarios: ['SSP585'], years: [2020] },
    },
};

describe('portfolioFormSchema', () => {
    it('fails when no result set type selected in custom', async () => {
        const data = { ...base };
        await expect(portfolioFormSchema.validate(data)).rejects.toBeTruthy();
    });

    it('passes when at least one result set enabled', async () => {
        const data = { ...base, isScoresEnabled: true };
        await expect(portfolioFormSchema.validate(data)).resolves.toBeTruthy();
    });

    it('requires 2020 in peril metrics years', async () => {
        const data = { ...base, isScoresEnabled: true };
        data.custom.perilMetrics.years = [2050];
        await expect(portfolioFormSchema.validate(data)).rejects.toBeTruthy();
    });

    it('requires Baseline when year 1995 present', async () => {
        const data = { ...base, isScoresEnabled: true };
        data.custom.perilMetrics.years = [1995, 2020];
        data.custom.perilMetrics.scenarios = [Scenario.SSP585];
        await expect(portfolioFormSchema.validate(data)).rejects.toBeTruthy();
    });
});
