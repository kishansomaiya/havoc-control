import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdaptationAnalysisPreferences } from './AdaptationAnalysisPreferences';
import { TestRoot } from '../../../../testing/TestRoot';

// Mock the API mutation hook
vi.mock('../../../../api/queries/adaptationQueries', () => ({
    usePostAdaptationAnalysisSettings: vi.fn(() => ({
        mutateAsync: vi.fn().mockResolvedValue({}),
    })),
}));

const setViewFn = vi.fn();
const renderComponent = (props = {}) =>
    render(
        <AdaptationAnalysisPreferences
            setView={setViewFn}
            {...props}
        />,
        {
            wrapper: TestRoot,
        }
    );

describe('AdaptationAnalysisPreferences', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the main title', () => {
        renderComponent();
        expect(
            screen.getByTestId('adaptation-analysis-title')
        ).toBeInTheDocument();
    });

    it('renders perils checkboxes', () => {
        renderComponent();
        expect(
            screen.getByTestId('adaptation-analysis-perils-group')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId(
                'adaptation-analysis-peril-checkbox-combinedFlood'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-peril-checkbox-wind')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-peril-checkbox-fire')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-peril-checkbox-heat')
        ).toBeInTheDocument();
    });

    it('renders emissions radio group', () => {
        renderComponent();
        expect(
            screen.getByTestId('adaptation-analysis-emissions-group')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-emission-radio-ssp126')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-emission-radio-ssp245')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-emission-radio-ssp585')
        ).toBeInTheDocument();
    });

    it('save button is present', () => {
        renderComponent();
        expect(
            screen.getByTestId('adaptation-analysis-save-btn')
        ).toBeInTheDocument();
    });

    it('back button is present', () => {
        renderComponent();
        expect(
            screen.getByTestId('adaptation-analysis-back-btn')
        ).toBeInTheDocument();
    });

    it('calls setView with visualizations when save button is clicked', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        const { usePostAdaptationAnalysisSettings } = await import(
            '../../../../api/queries/adaptationQueries'
        );
        (usePostAdaptationAnalysisSettings as any).mockReturnValue({
            mutateAsync: mockMutateAsync,
        });

        renderComponent();
        const user = userEvent.setup();
        const saveButton = screen.getByTestId('adaptation-analysis-save-btn');

        await user.click(saveButton);

        expect(mockMutateAsync).toHaveBeenCalled();
        expect(setViewFn).toHaveBeenCalledWith('visualizations');
    });

    it('calls setView with assetSelection when back button is clicked and settings not confirmed', async () => {
        renderComponent();
        const user = userEvent.setup();
        const backButton = screen.getByTestId('adaptation-analysis-back-btn');

        await user.click(backButton);

        expect(setViewFn).toHaveBeenCalledWith('assetSelection');
    });

    it('calls setView with visualizations when back button is clicked and settings are confirmed', async () => {
        const analysisSettings = {
            settingsConfirmed: true,
            analysisSettings: {
                perils: ['combinedFlood'],
                emissionsScenario: 'ssp585',
                investmentHorizon: 10,
                includeBusinessInterruption: true,
                adaptationUnitCostRange: 1,
                discountRate: 0,
                growthFactor: 0,
            },
        };

        renderComponent({ analysisSettings });
        const user = userEvent.setup();
        const backButton = screen.getByTestId('adaptation-analysis-back-btn');

        await user.click(backButton);

        expect(setViewFn).toHaveBeenCalledWith('visualizations');
    });

    it('can check and uncheck a peril', async () => {
        renderComponent();
        const user = userEvent.setup();
        const floodCheckbox = screen.getByTestId(
            'adaptation-analysis-peril-checkbox-combinedFlood'
        );
        const input = floodCheckbox.querySelector(
            'input[type="checkbox"]'
        ) as HTMLInputElement;

        // All perils are checked by default
        expect(input).toBeChecked();

        await user.click(floodCheckbox);
        expect(input).not.toBeChecked();
    });

    it('shows and validates custom cost range input', async () => {
        renderComponent();
        const user = userEvent.setup();

        // Select custom cost range radio
        const customRadio = screen.getByTestId(
            'adaptation-analysis-cost_range-custom-radio'
        );
        await user.click(customRadio);

        // Custom input should appear
        const customInputWrapper = screen.getByTestId(
            'adaptation-analysis-cost_range-custom-input'
        );
        const customInput = customInputWrapper.querySelector(
            'input'
        ) as HTMLInputElement;

        expect(customInput).toBeInTheDocument();
        await user.type(customInput, '123');
        expect(customInput).toHaveValue('123');
    });

    it('shows and updates custom discount rate input', async () => {
        renderComponent();
        const user = userEvent.setup();

        // Select custom discount rate radio
        const customRadio = screen.getByTestId(
            'adaptation-analysis-discount_rate-custom-radio'
        );
        await user.click(customRadio);

        // Custom input should appear
        const customInputWrapper = screen.getByTestId(
            'adaptation-analysis-discount_rate-custom-input'
        );
        const customInput = customInputWrapper.querySelector(
            'input'
        ) as HTMLInputElement;

        expect(customInput).toBeInTheDocument();
        await user.type(customInput, '5');
        expect(customInput).toHaveValue('5');
    });

    it('shows and updates custom growth factor input', async () => {
        renderComponent();
        const user = userEvent.setup();

        // Find the growth factor custom radio button (it doesn't have a test-id, so we need to find it differently)
        const customRadio = screen.getByTestId(
            'adaptation-analysis-growth_factor-custom-radio'
        );
        await user.click(customRadio);

        // Custom input should appear
        const customInputWrapper = screen.getByTestId(
            'adaptation-analysis-growth_factor-custom-input'
        );
        const customInput = customInputWrapper.querySelector(
            'input'
        ) as HTMLInputElement;

        expect(customInput).toBeInTheDocument();
        await user.type(customInput, '2');
        expect(customInput).toHaveValue('2');
    });

    it('validates that custom inputs only accept valid numbers', async () => {
        renderComponent();
        const user = userEvent.setup();

        // Test custom cost range input validation
        const customCostRadio = screen.getByTestId(
            'adaptation-analysis-cost_range-custom-radio'
        );
        await user.click(customCostRadio);

        const customCostInputWrapper = screen.getByTestId(
            'adaptation-analysis-cost_range-custom-input'
        );
        const customCostInput = customCostInputWrapper.querySelector(
            'input'
        ) as HTMLInputElement;

        // Try to type invalid characters
        await user.type(customCostInput, 'abc');
        expect(customCostInput).toHaveValue('');

        // Type valid numbers
        await user.type(customCostInput, '123');
        expect(customCostInput).toHaveValue('123');
    });

    it('renders all sections with proper structure', () => {
        renderComponent();

        // Check that all main sections are rendered
        expect(
            screen.getByTestId('adaptation-analysis-preferences-body')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-perils-group')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-emissions-group')
        ).toBeInTheDocument();

        // Check that all peril checkboxes are rendered with correct test-ids
        expect(
            screen.getByTestId(
                'adaptation-analysis-peril-checkbox-combinedFlood'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-peril-checkbox-wind')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-peril-checkbox-fire')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('adaptation-analysis-peril-checkbox-heat')
        ).toBeInTheDocument();
    });

    it('initializes with default settings', () => {
        renderComponent();

        // Check that all perils are selected by default
        const combinedFloodCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-combinedFlood')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;
        const windCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-wind')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;
        const fireCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-fire')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;
        const heatCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-heat')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(combinedFloodCheckbox).toBeChecked();
        expect(windCheckbox).toBeChecked();
        expect(fireCheckbox).toBeChecked();
        expect(heatCheckbox).toBeChecked();

        // Check default emissions scenario (ssp585)
        const ssp585Radio = screen
            .getByTestId('adaptation-analysis-emission-radio-ssp585')
            .querySelector('input[type="radio"]') as HTMLInputElement;
        expect(ssp585Radio).toBeChecked();
    });

    it('populates form with existing analysis settings', () => {
        const analysisSettings = {
            settingsConfirmed: false,
            analysisSettings: {
                perils: ['combinedFlood', 'wind'],
                emissionsScenario: 'ssp126',
                investmentHorizon: 20,
                includeBusinessInterruption: false,
                adaptationUnitCostRange: 0.8,
                discountRate: 0.05,
                growthFactor: 0.02,
            },
        };

        renderComponent({ analysisSettings });

        // Check that only specified perils are selected
        const combinedFloodCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-combinedFlood')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;
        const windCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-wind')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;
        const fireCheckbox = screen
            .getByTestId('adaptation-analysis-peril-checkbox-fire')
            .querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(combinedFloodCheckbox).toBeChecked();
        expect(windCheckbox).toBeChecked();
        expect(fireCheckbox).not.toBeChecked();

        // Check emissions scenario
        const ssp126Radio = screen
            .getByTestId('adaptation-analysis-emission-radio-ssp126')
            .querySelector('input[type="radio"]') as HTMLInputElement;
        expect(ssp126Radio).toBeChecked();
    });

    it('sends correct data format when saving', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        const { usePostAdaptationAnalysisSettings } = await import(
            '../../../../api/queries/adaptationQueries'
        );
        (usePostAdaptationAnalysisSettings as any).mockReturnValue({
            mutateAsync: mockMutateAsync,
        });

        renderComponent();
        const user = userEvent.setup();
        const saveButton = screen.getByTestId('adaptation-analysis-save-btn');

        await user.click(saveButton);

        expect(mockMutateAsync).toHaveBeenCalledWith({
            analysisSettings: {
                perils: ['combinedFlood', 'wind', 'fire', 'heat'],
                emissionsScenario: 'ssp585',
                investmentHorizon: 10,
                includeBusinessInterruption: true,
                adaptationUnitCostRange: 1,
                discountRate: 0,
                growthFactor: 0,
            },
            settingsConfirmed: true,
        });
    });
});
