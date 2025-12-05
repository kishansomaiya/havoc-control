import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditPortfolioSettings } from './EditPortfolioSettings';
import { MutableRefObject } from 'react';
import { IPortfolio } from 'pages/PortfolioEditingPages/types/portfolio';
import { FormikProps } from 'formik';
import { IPortfolioItem } from '../../../../types';
import * as PrimaryInformationFormModule from './components/PrimaryInformationForm';
import * as AnalysisTypeSelectionModule from './components/AnalysisTypeSelection';
import * as CustomDataSettingsFormModule from './components/CustomDataSettings/CustomDataSettingsForm';
import * as DataSettingsFormModule from './components/DataSettings/DataSettingsForm';
import * as PortfolioInfoModule from '../../../HomePage/components/PortfolioInfo';
import { IntlProvider } from 'react-intl';
import { TestRoot } from '../../../../testing/TestRoot';
import { AnalysisType } from '../../types/analysisTypeEnum';

// Mock translations (replace with your actual locale messages if needed)
const messages = {
    'create_portfolio.edit_settings.additional_analysis': 'Additional Analysis',
    'create_portfolio.edit_settings.run_adaptation_analysis': 'Run Adaptation Analysis',
    'create_portfolio.edit_settings.run_adaptation_analysis_description': 'Adaptation Analysis Description',
    'create_portfolio.edit_settings.run_adaptation_analysis_tooltip': 'Adaptation Analysis Tooltip',
    'create_portfolio.edit_settings.run_disclosure_analysis': 'Run Disclosure Analysis',
    'create_portfolio.edit_settings.run_disclosure_analysis_description': 'Disclosure Analysis Description',
    'create_portfolio.edit_settings.run_disclosure_analysis_tooltip': 'Disclosure Analysis Tooltip',
};

vi.mock('../../../../featureFlags/useFeatureFlags', () => ({
    useFeatureFlags: vi.fn(() => ({ adaptationModuleEnabled: true })),
}));

// Custom render function to include IntlProvider
const renderWithProviders = (ui: JSX.Element) =>
    render(
        <IntlProvider locale="en" messages={messages}>
            <TestRoot>{ui}</TestRoot>
        </IntlProvider>
    );

beforeEach(() => {
    vi.clearAllMocks();
    // Mock child components to avoid rendering their full logic
    vi.spyOn(
        PrimaryInformationFormModule,
        'PrimaryInformationForm'
    ).mockImplementation((({ dataTestId }: { dataTestId?: string }) => (
        <div data-testid={dataTestId || 'edit-settings-primary-info'} />
    )) as typeof PrimaryInformationFormModule.PrimaryInformationForm);
    vi.spyOn(
        AnalysisTypeSelectionModule,
        'AnalysisTypeSelection'
    ).mockImplementation((({ dataTestId }: { dataTestId?: string }) => (
        <div data-testid={dataTestId || 'edit-settings-analysis-type'} />
    )) as typeof AnalysisTypeSelectionModule.AnalysisTypeSelection);
    vi.spyOn(
        CustomDataSettingsFormModule,
        'CustomDataSettingsForm'
    ).mockImplementation(() => <div data-testid="custom-settings" />);
    vi.spyOn(DataSettingsFormModule, 'DataSettingsForm').mockImplementation(
        () => <div data-testid="data-settings" />
    );
    vi.spyOn(PortfolioInfoModule, 'PortfolioInfo').mockImplementation(() => (
        <div data-testid="portfolio-info" />
    ));
});

describe('EditPortfolioSettings', () => {
    const baseInitialValues = {
        name: '',
        category: { id: 1, label: 'Cat' },
        dataVersion: 'v3.2.0',
        type: 'custom',
        changeAnalysisType: true,
        isPerilMetricsEnabled: true,
        isEconomicImpactsEnabled: false,
        isScoresEnabled: true,
        isFloodMeshEnabled: false,
        runDisclosureAnalysis: false,
        custom: {
            perilMetrics: { perils: [], years: [], scenarios: [] },
            economicImpacts: {
                defaultBuildingAttributes: {},
                defaultAssetValues: {},
                advancedParameters: {
                    includeWorkerProductivity: false,
                    includeCostOfCooling: false,
                    includeWildfireLoss: false,
                    includeUtilitiesCostOfWater: false,
                },
                financialParameters: { includeFinancialMetrics: false },
            },
            scores: {
                includeBenchmarks: false,
                benchmarkLevels: [],
                perils: [],
            },
            floodMesh: { scenarios: [], years: [] },
        },
    } as unknown as IPortfolio;

    it('renders static labels and child sections', () => {
        const formRef = {
            current: null,
        } as MutableRefObject<FormikProps<IPortfolio> | null>;
        renderWithProviders(
            <EditPortfolioSettings
                initialFormValues={baseInitialValues}
                onFormSubmit={vi.fn()}
                onFormValidationChange={vi.fn()}
                onEiConfigurationChange={vi.fn()}
                formRef={formRef}
                showChangeTypeOption={false}
                isNewPortfolio={true}
            />
        );

        expect(screen.getByTestId('edit-settings-form')).toBeInTheDocument();
        expect(screen.getByTestId('data-settings-label')).toBeInTheDocument();
        expect(
            screen.getByTestId('edit-settings-primary-info')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('edit-settings-analysis-type')
        ).toBeInTheDocument();
        expect(screen.getByTestId('custom-settings')).toBeInTheDocument();
    });

    it('renders DataSettingsForm when type is not custom', () => {
        const formRef = {
            current: null,
        } as MutableRefObject<FormikProps<IPortfolio> | null>;
        renderWithProviders(
            <EditPortfolioSettings
                initialFormValues={{
                    ...baseInitialValues,
                    type: AnalysisType.PerilsAndScores,
                    changeAnalysisType: true,
                }}
                onFormSubmit={vi.fn()}
                onFormValidationChange={vi.fn()}
                onEiConfigurationChange={vi.fn()}
                formRef={formRef}
                showChangeTypeOption={false}
                isNewPortfolio={true}
            />
        );
        expect(screen.getByTestId('data-settings-label')).toBeInTheDocument();
        expect(screen.getByTestId('data-settings')).toBeInTheDocument();
    });

    it('renders PortfolioInfo when changeAnalysisType is false', () => {
        const formRef = {
            current: null,
        } as MutableRefObject<FormikProps<IPortfolio> | null>;
        renderWithProviders(
            <EditPortfolioSettings
                initialFormValues={{
                    ...baseInitialValues,
                    changeAnalysisType: false,
                }}
                onFormSubmit={vi.fn()}
                onFormValidationChange={vi.fn()}
                onEiConfigurationChange={vi.fn()}
                formRef={formRef}
                showChangeTypeOption={false}
                isNewPortfolio={true}
                currentPortfolioWithResultSets={{ id: 'id' } as IPortfolioItem}
            />
        );
        expect(screen.getByTestId('portfolio-info')).toBeInTheDocument();
    });
});