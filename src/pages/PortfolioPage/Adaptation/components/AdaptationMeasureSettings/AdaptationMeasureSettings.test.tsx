import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdaptationMeasureSettings } from './AdaptationMeasureSettings';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';
import { MessageKeys } from '../../../../../localization/useFormatMessage';
import { usePostAdaptationIndividualLocations } from '../../../../../api/queries/adaptationQueries';
import { useFetchInvestmentMatrix } from '../../../../../api/queries/adaptationQueries';

vi.mock('../../../../../api/queries/adaptationQueries', () => ({
    usePostAdaptationIndividualLocations: vi
        .fn()
        .mockImplementation(() => ({ mutateAsync: async () => {} })),
    useFetchInvestmentMatrix: vi.fn().mockImplementation(() => ({ data: [] })),
}));

vi.mocked(usePostAdaptationIndividualLocations, { partial: true });
vi.mocked(useFetchInvestmentMatrix, { partial: true });

vi.mock('@mui/x-data-grid', () => ({
    DataGrid: ({ columns }: { columns: any[] }) => (
        <div data-testid="data-grid">
            {columns.map((col) => (
                <div
                    key={col.field}
                    data-testid={`column-${col.field}`}
                >
                    {col.headerName}
                </div>
            ))}
        </div>
    ),
}));

describe('AdaptationMeasureSettings', () => {
    const mockSetView = vi.fn();
    const renderComponent = () =>
        render(
            <AdaptationMeasureSettings
                setView={mockSetView}
                analysisId={''}
                selectedLocationIds={[]}
            />,
            { wrapper: TestRoot }
        );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the dialog title', () => {
        renderComponent();
        const expectedTitle = formatMessageTesting(
            'adaptation.measure_settings.title'
        );
        expect(screen.getByText(expectedTitle)).toBeInTheDocument();
    });

    it('renders the description', () => {
        renderComponent();
        const expectedDescription = formatMessageTesting(
            'adaptation.measure_settings.description'
        );
        expect(screen.getByText(expectedDescription)).toBeInTheDocument();
    });

    it('renders all tab headers correctly', () => {
        renderComponent();

        expect(
            screen.getByText(
                formatMessageTesting(
                    'adaptation.measure_settings.tabs.loss_financial_metrics'
                )
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.measure_settings.tabs.flood')
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.measure_settings.tabs.wind')
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatMessageTesting(
                    'adaptation.measure_settings.tabs.wildfire'
                )
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.measure_settings.tabs.heat')
            )
        ).toBeInTheDocument();
    });

    it('renders all column headers for LOSS & FINANCIAL METRICS tab correctly', () => {
        renderComponent();

        const expectedHeaders = [
            'adaptation.measure_settings.table.location_id',
            'adaptation.measure_settings.table.location_name',
            'adaptation.measure_settings.table.occupancy',
            'adaptation.measure_settings.table.implementation_year',
            'adaptation.measure_settings.table.unadapted_aal',
            'adaptation.measure_settings.table.adapted_aal',
            'adaptation.measure_settings.table.delta',
            'adaptation.measure_settings.table.capex',
            'adaptation.measure_settings.table.npv',
            'adaptation.measure_settings.table.breakeven_year',
        ] as const;

        expectedHeaders.forEach((header) => {
            expect(
                screen.getByText(formatMessageTesting(header))
            ).toBeInTheDocument();
        });
    });

    it('renders all column headers for FLOOD tab correctly', async () => {
        const user = userEvent.setup();
        renderComponent();

        const floodTab = screen.getByText(
            formatMessageTesting('adaptation.measure_settings.tabs.flood')
        );
        await user.click(floodTab);

        const expectedHeaders = [
            'adaptation.measure_settings.table.location_id',
            'adaptation.measure_settings.table.location_name',
            'adaptation.measure_settings.table.occupancy',
            'adaptation.measure_settings.table.elevate_structure',
            'adaptation.measure_settings.table.site_level_protection',
            'adaptation.measure_settings.table.flood_proofing',
        ] as const;

        expectedHeaders.forEach((header) => {
            expect(
                screen.getByText(formatMessageTesting(header))
            ).toBeInTheDocument();
        });
    });

    it('renders all column headers for WIND tab correctly', async () => {
        const user = userEvent.setup();
        renderComponent();

        const windTab = screen.getByText(
            formatMessageTesting('adaptation.measure_settings.tabs.wind')
        );
        await user.click(windTab);

        const expectedHeaders = [
            'adaptation.measure_settings.table.location_id',
            'adaptation.measure_settings.table.location_name',
            'adaptation.measure_settings.table.occupancy',
            'adaptation.measure_settings.table.wind_engineering_retrofit',
        ] as const;

        expectedHeaders.forEach((header) => {
            expect(
                screen.getByText(formatMessageTesting(header))
            ).toBeInTheDocument();
        });
    });

    it('renders all column headers for WILDFIRE tab correctly', async () => {
        const user = userEvent.setup();
        renderComponent();

        const wildfireTab = screen.getByText(
            formatMessageTesting('adaptation.measure_settings.tabs.wildfire')
        );
        await user.click(wildfireTab);

        const expectedHeaders = [
            'adaptation.measure_settings.table.location_id',
            'adaptation.measure_settings.table.location_name',
            'adaptation.measure_settings.table.occupancy',
            'adaptation.measure_settings.table.non_flammable_roof_material',
            'adaptation.measure_settings.table.double_pane_windows',
            'adaptation.measure_settings.table.ember_resistant_vents',
        ] as const;

        expectedHeaders.forEach((header) => {
            expect(
                screen.getByText(formatMessageTesting(header))
            ).toBeInTheDocument();
        });
    });

    it('renders all column headers for HEAT tab correctly', async () => {
        const user = userEvent.setup();
        renderComponent();

        const heatTab = screen.getByText(
            formatMessageTesting('adaptation.measure_settings.tabs.heat')
        );
        await user.click(heatTab);

        const expectedHeaders: MessageKeys[] = [
            'adaptation.measure_settings.table.location_id',
            'adaptation.measure_settings.table.location_name',
            'adaptation.measure_settings.table.occupancy',
            'adaptation.measure_settings.table.install_air_conditioning',
            'adaptation.measure_settings.table.cool_roof',
        ];

        expectedHeaders.forEach((header) => {
            expect(
                screen.getByText(formatMessageTesting(header))
            ).toBeInTheDocument();
        });
    });

    it('displays search field with correct placeholder', () => {
        renderComponent();

        const searchField = screen.getByPlaceholderText(
            formatMessageTesting('search_bar.search')
        );
        expect(searchField).toBeInTheDocument();
    });

    it('shows confirmation dialog on cancel button click', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(
            screen.getByText(formatMessageTesting('general.cancel'))
        );

        expect(
            screen.getByText(
                formatMessageTesting(
                    'adaptation.measure_settings.confirm_cancel'
                )
            )
        ).toBeInTheDocument();
    });

    it('shows confirmation dialog on save button click', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(
            screen.getByText(formatMessageTesting('general.save'))
        );

        expect(
            screen.getByText(
                formatMessageTesting('adaptation.measure_settings.confirm_save')
            )
        ).toBeInTheDocument();
    });

    it('navigates back to visualizations after successful save', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(
            screen.getByText(formatMessageTesting('general.save'))
        );
        await user.click(screen.getByText(formatMessageTesting('general.yes')));

        // Wait for the success dialog timeout
        setTimeout(() => {
            expect(mockSetView).toHaveBeenCalledWith('visualizations');
        }, 2100); // slightly longer than the timeout in the component
    });

    it('navigates back to visualizations on cancel confirmation', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(
            screen.getByText(formatMessageTesting('general.cancel'))
        );
        await user.click(screen.getByText(formatMessageTesting('general.ok')));

        expect(mockSetView).toHaveBeenCalledWith('visualizations');
    });

    it('renders DataGrid with correct test id', () => {
        renderComponent();

        expect(screen.getByTestId('data-grid')).toBeInTheDocument();
    });
});
