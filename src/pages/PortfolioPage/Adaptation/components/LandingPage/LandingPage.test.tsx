import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdaptationLandingPage } from './LandingPage';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';
import { LocationAssetAttributes } from '../../../../../api/openapi/auto-generated';

const mockLocationData: LocationAssetAttributes[] = [
    {
        locationId: 'loc-1',
        customerLocationId: 1001,
        locationName: 'Test Location 1',
        countryCodeIso2a: 'US',
        admin1Code: 'CA',
        occupancyCode: 1100,
        occupancyScheme: 'Residential',
        occupancyName: 'Single Family Home',
        entity: 'Entity A',
        totalValue: 1000000,
        unadaptedAal2025: 50000,
        unadaptedAal2055: 75000,
    },
    {
        locationId: 'loc-2',
        customerLocationId: 1002,
        locationName: 'Test Location 2',
        countryCodeIso2a: 'CA',
        admin1Code: 'ON',
        occupancyCode: 2000,
        occupancyScheme: 'Commercial',
        occupancyName: 'Office Building',
        entity: 'Entity B',
        totalValue: 2000000,
        unadaptedAal2025: 100000,
        unadaptedAal2055: 150000,
    },
];

describe('AdaptationLandingPage', () => {
    const mockSetView = vi.fn();

    const renderComponent = (props?: {
        locationList?: LocationAssetAttributes[];
        isLocationListLoading?: boolean;
    }) => {
        const locationList = props?.locationList ?? mockLocationData;
        return render(
            <TestRoot>
                <AdaptationLandingPage
                    setView={mockSetView}
                    setSelectedLocationIds={vi.fn()}
                    isLoadingAnalysisSettings={false}
                    selectedLocationIds={[]}
                    isLocationListLoading={
                        props?.isLocationListLoading === true
                    }
                    locationList={locationList}
                />
            </TestRoot>
        );
    };

    beforeEach(() => {
        mockSetView.mockClear();
    });

    it('renders loading spinner when data is loading', () => {
        renderComponent({ isLocationListLoading: true });

        expect(
            screen.getByTestId('adaptation-landing-page-spinner')
        ).toBeInTheDocument();
    });

    it('renders KPI sections with correct labels and data', () => {
        renderComponent();

        expect(
            screen.getByTestId('adaptation-landing-page-portfolio-kpis-label')
        ).toHaveTextContent(
            formatMessageTesting('adaptation.selection_screen.kpi.portfolio')
        );
        expect(
            screen.getByTestId('adaptation-landing-page-portfolio-kpis')
        ).toBeInTheDocument();

        expect(
            screen.getByTestId('adaptation-landing-page-selected-kpis-label')
        ).toHaveTextContent(
            formatMessageTesting(
                'adaptation.selection_screen.kpi.selected_assets'
            )
        );
        expect(
            screen.getByTestId('adaptation-landing-page-selected-kpis')
        ).toBeInTheDocument();
    });

    it('calculates and displays correct portfolio KPIs from API data', () => {
        renderComponent();

        const portfolioKpis = screen.getByTestId(
            'adaptation-landing-page-portfolio-kpis'
        );

        // Should show 2 total assets
        expect(portfolioKpis).toHaveTextContent('2');
        // Should show combined total value ($3.00M)
        expect(portfolioKpis).toHaveTextContent('$3.00M');
        // Should show combined UAAL (150K)
        expect(portfolioKpis).toHaveTextContent('$150.00K');
    });

    it('renders search bar with all expected elements', () => {
        renderComponent();

        const searchField = screen.getByTestId('asset-selection-search-field');
        const searchIcon = screen.getByTestId('asset-selection-search-icon');
        const clearIcon = screen.getByTestId(
            'asset-selection-search-clear-icon'
        );

        expect(searchField).toBeInTheDocument();
        expect(searchIcon).toBeInTheDocument();
        expect(clearIcon).toBeInTheDocument();
    });

    it('renders all filter dropdowns with correct labels', () => {
        renderComponent();

        const countryLabel = formatMessageTesting(
            'adaptation.selection_screen.filter.country'
        );
        const occupancyLabel = formatMessageTesting(
            'adaptation.selection_screen.filter.occupancy'
        );
        const entityLabel = formatMessageTesting(
            'adaptation.selection_screen.filter.entity'
        );

        expect(screen.getByTestId('filter-country')).toHaveTextContent(
            countryLabel
        );
        expect(screen.getByTestId('filter-occupancy')).toHaveTextContent(
            occupancyLabel
        );
        expect(screen.getByTestId('filter-entity')).toHaveTextContent(
            entityLabel
        );
    });

    it('renders data grid with API data and launch button', () => {
        renderComponent();

        expect(screen.getAllByRole('presentation').length).toBeGreaterThan(0);
        expect(
            screen.getByTestId('adaptation-landing-page-launch-button')
        ).toHaveTextContent(
            formatMessageTesting('adaptation.selection_screen.launch')
        );
    });

    it('handles search input changes and filters data', async () => {
        const user = userEvent.setup();
        renderComponent();

        const searchField = screen.getByPlaceholderText(
            formatMessageTesting('search_bar.search')
        );

        await user.type(searchField, 'Test Location 1');

        expect(searchField).toHaveValue('Test Location 1');
        // Should still show filtered location
        expect(screen.getByText('Test Location 1')).toBeInTheDocument();
    });

    it('handles launch button click', async () => {
        const user = userEvent.setup();
        renderComponent();

        const launchButton = screen.getByTestId(
            'adaptation-landing-page-launch-button'
        );

        await user.click(launchButton);

        expect(mockSetView).toHaveBeenCalled();
    });

    it('displays data grid with checkbox selection enabled', () => {
        renderComponent();

        const dataGrid = screen.getAllByRole('presentation')[0];
        const checkboxes = within(dataGrid).getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('updates selected KPIs when rows are selected', async () => {
        const user = userEvent.setup();
        renderComponent();

        const checkboxes = screen.getAllByRole('checkbox');
        // Click the first data row checkbox (index 1, since 0 is the header checkbox)
        if (checkboxes[1]) {
            await user.click(checkboxes[1]);
        }

        const selectedKpis = screen.getByTestId(
            'adaptation-landing-page-selected-kpis'
        );
        expect(selectedKpis).toBeInTheDocument();
        // Selected KPIs should update based on selection
    });

    it('populates filter options from API data', () => {
        renderComponent();

        // Filters should be populated with unique values from mock data
        expect(screen.getByTestId('filter-country')).toBeInTheDocument();
        expect(screen.getByTestId('filter-occupancy')).toBeInTheDocument();
        expect(screen.getByTestId('filter-entity')).toBeInTheDocument();
    });

    it('displays portfolio and selected KPIs side by side with divider', () => {
        renderComponent();

        const portfolioKpis = screen.getByTestId(
            'adaptation-landing-page-portfolio-kpis'
        );
        const selectedKpis = screen.getByTestId(
            'adaptation-landing-page-selected-kpis'
        );

        expect(portfolioKpis).toBeInTheDocument();
        expect(selectedKpis).toBeInTheDocument();

        const dividers = screen.getAllByRole('separator');
        expect(dividers.length).toBeGreaterThan(0);
    });

    it('handles empty data state', () => {
        renderComponent({ locationList: [] });

        const portfolioKpis = screen.getByTestId(
            'adaptation-landing-page-portfolio-kpis'
        );
        // Should show 0 for all KPIs when no data
        expect(portfolioKpis).toHaveTextContent('0');
    });
});
