import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PerilMetricsOptionsForm } from './PerilMetricsOptionsForm';
import * as formikCtx from '../../../../../../../hooks/useFormikContextHelpers';
import * as PerilsSectionFormModule from './Perils/PerilsSectionForm';
import * as YearsSectionFormModule from './Years/YearsSectionForm';
import * as ScenariosSectionFormModule from './Scenarios/ScenariosSectionForm';
import * as FloodDefenseSectionFormModule from './FloodDefense/FloodDefenseSectionForm';

const setFieldsMock = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: {
            name: 'Test',
            locationCount: 0,
            category: null,
            dataVersion: '3.2.0',
            type: 'PerilsScoresAndEconomicImpact',
            changeAnalysisType: false,
            isMockPortfolio: false,
            isPerilMetricsEnabled: true,
            isEconomicImpactsEnabled: false,
            isScoresEnabled: false,
            isFloodMeshEnabled: false,
            custom: {
                perilMetrics: {
                    perils: [],
                    years: [],
                    scenarios: [],
                    floodDefenseOptions: {
                        enabled: true,
                        zeroOutDefendedLocations: true,
                    },
                },
                economicImpacts: {
                    defaultBuildingAttributes: {
                        occupancyScheme: 'OED',
                    },
                    defaultAssetValues: {},
                    advancedParameters: {
                        includeWorkerProductivity: false,
                        includeCostOfCooling: false,
                        includeWildfireLoss: false,
                        includeAcuteCombinedFlood: false,
                        includeAcuteWind: false,
                        includeUtilitiesCostOfWater: false,
                        utilitiesCostOfWater: {},
                    },
                    financialParameters: {
                        includeFinancialMetrics: false,
                        financialMetrics: {
                            generatePortfolioLevelResults: false,
                        },
                    },
                },
                scores: {
                    perils: [],
                    includeBenchmarks: false,
                    benchmarkLevels: [],
                },
                floodMesh: {
                    mesh: { type: 'dynamic' },
                    scenarios: [],
                    years: [],
                    floodDefense: {
                        enabled: false,
                        zeroOutDefendedLocations: false,
                    },
                },
            },
        },
        setFields: setFieldsMock,
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    vi.spyOn(PerilsSectionFormModule, 'PerilsSectionForm').mockImplementation(
        (() => (
            <div data-testid="perils-section" />
        )) as typeof PerilsSectionFormModule.PerilsSectionForm
    );
    vi.spyOn(YearsSectionFormModule, 'YearsSectionForm').mockImplementation(
        (() => (
            <div data-testid="years-section" />
        )) as typeof YearsSectionFormModule.YearsSectionForm
    );
    vi.spyOn(
        ScenariosSectionFormModule,
        'ScenariosSectionForm'
    ).mockImplementation((() => (
        <div data-testid="scenarios-section" />
    )) as typeof ScenariosSectionFormModule.ScenariosSectionForm);
    vi.spyOn(
        FloodDefenseSectionFormModule,
        'FloodDefenseSectionForm'
    ).mockImplementation((() => (
        <div data-testid="flooddefense-section" />
    )) as typeof FloodDefenseSectionFormModule.FloodDefenseSectionForm);
});

describe('PerilMetricsOptionsForm', () => {
    it('renders and toggles switch', async () => {
        const user = userEvent.setup();
        render(<PerilMetricsOptionsForm />);
        expect(screen.getByText('Peril Metrics')).toBeInTheDocument();
        expect(screen.getByTestId('perils-section')).toBeInTheDocument();
        expect(screen.getByTestId('years-section')).toBeInTheDocument();
        expect(screen.getByTestId('scenarios-section')).toBeInTheDocument();
        expect(screen.getByTestId('flooddefense-section')).toBeInTheDocument();

        const toggle = screen.getByRole('checkbox');
        await user.click(toggle);
        expect(setFieldsMock).toHaveBeenCalled();
    });
});
