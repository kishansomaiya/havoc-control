import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdditionalAnalyses } from './AdditionalAnalyses';
import { IPortfolio } from '../../../types/portfolio';
import { DataVersion } from '../../../../../types';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import * as formikCtx from '../../../../../hooks/useFormikContextHelpers';
import * as userContext from '../../../../../context/UserContextProvider';
import * as localization from '../../../../../localization/useFormatMessage';
import * as utils from '../../../../../utils';
import { TestRoot } from '../../../../../testing/TestRoot';

let mockValues: { values: IPortfolio; setField: ReturnType<typeof vi.fn> };
let mockCanAccessDisclosureResultSet: boolean;
const mockSetField = vi.fn();
const mockFormatMessage = vi.fn((id: string) => id); 

vi.mock('../../../../../featureFlags/useFeatureFlags', () => ({
    useFeatureFlags: vi.fn(() => ({ adaptationModuleEnabled: true })), // Default to true for tests
}));

beforeEach(() => {
    mockValues = {
        values: {
            name: 'My Portfolio',
            dataVersion: DataVersion.v3_2_0,
            type: AnalysisType.PerilsAndScores,
            runAdaptationOpportunitiesAnalysis: false,
            runDisclosureAnalysis: false,
        } as IPortfolio,
        setField: mockSetField,
    };
    mockCanAccessDisclosureResultSet = true;

    vi.clearAllMocks();

    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation(
        () => mockValues as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>
    );

    vi.spyOn(userContext, 'useUserContext').mockReturnValue({
        canAccessDisclosureResultSet: mockCanAccessDisclosureResultSet,
    } as ReturnType<typeof userContext.useUserContext>);

    vi.spyOn(localization, 'useFormatMessage').mockReturnValue( mockFormatMessage as unknown as ReturnType<typeof localization.useFormatMessage>);

    vi.spyOn(utils, 'isAdaptationOpportunitiesAnalysisAllowedDataVersion').mockReturnValue(true);
    vi.spyOn(utils, 'isDisclosureAllowedDataVersion').mockReturnValue(true);
});

const renderWithProviders = (ui: JSX.Element) => render(<TestRoot>{ui}</TestRoot>);

describe('AdditionalAnalysis', () => {
    it('renders label', () => {
        renderWithProviders(<AdditionalAnalyses />);
        expect(
            screen.getByTestId('additional-analyses-label')
        ).toBeInTheDocument();
        expect(screen.getByTestId('additional-analyses-label')).toHaveTextContent(
            'create_portfolio.edit_settings.additional_analysis'
        );
    });

    it('renders adaptation opportunities analysis option', () => {
        renderWithProviders(<AdditionalAnalyses />);
        expect(
            screen.getByTestId('run-adaptation-opportunities-analysis')
        ).toBeInTheDocument();
    });

    it('renders disclosure analysis option when user has access', () => {
        renderWithProviders(<AdditionalAnalyses />);
        expect(
            screen.getByTestId('run-disclosure-analysis')
        ).toBeInTheDocument();
    });

    it('enables adaptation analysis only when type is PerilsScoresAndEconomicImpact', () => {
        mockValues.values.type = AnalysisType.PerilsScoresAndEconomicImpact;
        renderWithProviders(<AdditionalAnalyses />);
        const adaptationOption = screen.getByTestId(
            'run-adaptation-opportunities-analysis'
        );
        expect(adaptationOption).toHaveStyle({ opacity: 1 });
    });

    it('disables disclosure analysis when type is Custom', () => {
        mockValues.values.type = AnalysisType.Custom;
        renderWithProviders(<AdditionalAnalyses />);
        const disclosureOption = screen.getByTestId('run-disclosure-analysis');
        expect(disclosureOption).toHaveStyle({ opacity: 0.5 });
    });

    it('disables adaptation when isRunAdaptationOpportunitiesAnalysisEnabled is false', () => {
        renderWithProviders(
            <AdditionalAnalyses
                isRunAdaptationOpportunitiesAnalysisEnabled={false}
            />
        );
        const adaptationOption = screen.getByTestId(
            'run-adaptation-opportunities-analysis'
        );
        expect(adaptationOption).toHaveStyle({ opacity: 0.5 });
    });

    it('disables disclosure when isRunDisclosureEnabled is false', () => {
        renderWithProviders(<AdditionalAnalyses isRunDisclosureEnabled={false} />);
        const disclosureOption = screen.getByTestId('run-disclosure-analysis');
        expect(disclosureOption).toHaveStyle({ opacity: 0.5 });
    });
});