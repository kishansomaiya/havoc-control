import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocationPage } from './LocationPage';
import { RoutedTabsProps } from 'components/RoutedTabs/RoutedTabs';
import * as portfoliosQuery from '../../api/queries/portfoliosQuery';
import * as locationsQuery from '../../api/queries/locationsQuery';
import * as alertProvider from '../../context/AlertProvider';
import * as userContextProvider from '../../context/UserContextProvider';
import * as portfoliosMutation from '../../api/mutations/portfoliosMutation';
import * as utils from '../../utils';

// Keep lightweight presentational stubs for modals only
vi.mock('../HomePage/components/DownloadSLRModal', () => ({
    DownloadSLRModal: () => (
        <div data-testid="download-slr-modal-layer">modal</div>
    ),
}));
vi.mock('./FloodMesh/components/CreateFloodMeshModal', () => ({
    CreateFloodMeshModal: () => (
        <div data-testid="create-flood-mesh-modal-layer">modal</div>
    ),
}));

// Simple tabs stub to trigger onClick without navigating
vi.mock('../../components/RoutedTabs/RoutedTabs', () => ({
    RoutedTabs: ({ tabs }: RoutedTabsProps) => (
        <div data-testid="location-tabs">
            {tabs.map((t) => (
                <button
                    key={t.route}
                    onClick={t.onClick}
                    disabled={t.disabled}
                >
                    {t.label}
                </button>
            ))}
        </div>
    ),
}));

describe('LocationPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithRoute = (path = '/location/p1/1') =>
        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route
                        path="/location/:portfolioId/:locationId"
                        element={<LocationPage />}
                    />
                </Routes>
            </MemoryRouter>
        );

    const mockPathDependencies = () => {
        vi.spyOn(portfoliosQuery, 'usePortfolioQuery').mockReturnValue({
            portfolio: {
                id: 'p1',
                name: 'P',
                locationCount: 1,
                createdBy: 'u1',
            } as unknown as ReturnType<
                typeof portfoliosQuery.usePortfolioQuery
            >['portfolio'],
            isPortfolioLoading: false,
            isPortfolioError: false,
            refetchPortfolio: vi.fn() as unknown as ReturnType<
                typeof portfoliosQuery.usePortfolioQuery
            >['refetchPortfolio'],
        });
        vi.spyOn(
            portfoliosQuery,
            'usePortfolioResultSetsQuery'
        ).mockReturnValue({
            resultSets: [],
            isResultSetsLoading: false,
            isResultSetsError: false,
            refetchResultSets: vi.fn() as unknown as ReturnType<
                typeof portfoliosQuery.usePortfolioResultSetsQuery
            >['refetchResultSets'],
        });
        vi.spyOn(locationsQuery, 'useLocationsQuery').mockReturnValue({
            locations: [
                {
                    id: 1 as unknown as number,
                    geometry: { latitude: 1, longitude: 2 },
                    extras: {
                        locationName: 'Loc',
                        streetAddress: 'A',
                        cityName: 'C',
                        admin1Code: 'S',
                        countryCodeISO2A: 'US',
                    },
                },
            ] as unknown as ReturnType<
                typeof locationsQuery.useLocationsQuery
            >['locations'],
            isLocationsLoading: false,
            isLocationsError: false,
        });
        vi.spyOn(alertProvider, 'useAddAlert').mockReturnValue(vi.fn());
        vi.spyOn(userContextProvider, 'useUserContext').mockReturnValue({
            user: undefined,
            hasFidelity: false,
            canAccessKnowledgeBase: true,
            canAccessLargeGrid: false,
            canAccessDisclosureResultSet: false,
            isAdministrator: false,
            isPortfolioSharer: false,
            isPortfolioSharingEnabled: false,
            hasPortfolioAccessPermissions: false,
            isPortfolioCreator: false,
            isPortfolioAdministrator: false,
            hasPortfolioCreationReadOnlyAccess: false,
            isPermissionsLoading: false,
            checkIfUsercanAccessObjectAsAdminOrCreator: () => true,
        } as unknown as ReturnType<typeof userContextProvider.useUserContext>);
        vi.spyOn(
            portfoliosMutation,
            'useDownloadPortfolioSLRMutation'
        ).mockReturnValue({
            downloadPortfolioSLR: vi.fn(async () => ({
                files: [],
                metadata: undefined,
            })) as unknown as ReturnType<
                typeof portfoliosMutation.useDownloadPortfolioSLRMutation
            >['downloadPortfolioSLR'],
            isPortfolioSLRDownloading: false,
            isPortfolioSLRError: false,
            downloadPortfolioSLRError: null,
        });
        vi.spyOn(
            portfoliosMutation,
            'useDownloadSLRFilesMutation'
        ).mockReturnValue({
            downloadSLRFiles: vi.fn(async () => {}) as unknown as ReturnType<
                typeof portfoliosMutation.useDownloadSLRFilesMutation
            >['downloadSLRFiles'],
            isSLRFilesDownloading: false,
            isSLRFilesDownloadError: false,
            downloadSLRFilesError: null,
        });
        vi.spyOn(
            portfoliosMutation,
            'useCreatePortfolioFloodMeshResultSetMutation'
        ).mockReturnValue({
            createPortfolioFloodMeshResultSet: vi.fn(async () => ({
                id: 'rs1',
            })) as unknown as ReturnType<
                typeof portfoliosMutation.useCreatePortfolioFloodMeshResultSetMutation
            >['createPortfolioFloodMeshResultSet'],
            isPortfolioFloodMeshResultSetCreating: false,
            isPortfolioFloodMeshResultSetCreateError: false,
            createPortfolioFloodMeshResultSetError: null,
            cancelCreatePortfolioFloodMeshResultSet: vi.fn(),
            abortControllerRef: { current: null } as unknown as ReturnType<
                typeof portfoliosMutation.useCreatePortfolioFloodMeshResultSetMutation
            >['abortControllerRef'],
        });
        vi.spyOn(utils, 'getPerilsResultSet').mockReturnValue({
            id: 'perils',
            status: 'Completed',
        } as unknown as ReturnType<typeof utils.getPerilsResultSet>);
        vi.spyOn(utils, 'getScoresResultSet').mockReturnValue({
            id: 'scores',
            status: 'Completed',
        } as unknown as ReturnType<typeof utils.getScoresResultSet>);
        vi.spyOn(utils, 'getFloodResultSet').mockReturnValue(
            undefined as unknown as ReturnType<typeof utils.getFloodResultSet>
        );
        vi.spyOn(utils, 'checkIsDownloadSLRDisabled').mockReturnValue(false);
        vi.spyOn(utils, 'getDefaultPortfolioPageUrl').mockReturnValue(
            '/portfolio/p1/overview'
        );
        vi.spyOn(utils, 'currencyValueFormatter').mockImplementation(
            ({ value }: { value: number }) => `$${value}`
        );
        vi.spyOn(utils, 'getPortfolioResultDataVersion').mockReturnValue('dv');
    };

    it('shows loading spinner when loading', async () => {
        vi.spyOn(portfoliosQuery, 'usePortfolioQuery').mockReturnValue({
            portfolio: undefined,
            isPortfolioLoading: true,
            isPortfolioError: false,
            refetchPortfolio: vi.fn() as unknown as ReturnType<
                typeof portfoliosQuery.usePortfolioQuery
            >['refetchPortfolio'],
        });
        vi.spyOn(
            portfoliosQuery,
            'usePortfolioResultSetsQuery'
        ).mockReturnValue({
            resultSets: [],
            isResultSetsLoading: false,
            isResultSetsError: false,
            refetchResultSets: vi.fn() as unknown as ReturnType<
                typeof portfoliosQuery.usePortfolioResultSetsQuery
            >['refetchResultSets'],
        });
        vi.spyOn(locationsQuery, 'useLocationsQuery').mockReturnValue({
            locations: [],
            isLocationsLoading: true,
            isLocationsError: false,
        });
        // Ensure mutation hooks do not call react-query
        vi.spyOn(
            portfoliosMutation,
            'useDownloadPortfolioSLRMutation'
        ).mockReturnValue({
            downloadPortfolioSLR: vi.fn() as unknown as ReturnType<
                typeof portfoliosMutation.useDownloadPortfolioSLRMutation
            >['downloadPortfolioSLR'],
            isPortfolioSLRDownloading: false,
            isPortfolioSLRError: false,
            downloadPortfolioSLRError: null,
        });
        vi.spyOn(
            portfoliosMutation,
            'useDownloadSLRFilesMutation'
        ).mockReturnValue({
            downloadSLRFiles: vi.fn() as unknown as ReturnType<
                typeof portfoliosMutation.useDownloadSLRFilesMutation
            >['downloadSLRFiles'],
            isSLRFilesDownloading: false,
            isSLRFilesDownloadError: false,
            downloadSLRFilesError: null,
        });
        vi.spyOn(
            portfoliosMutation,
            'useCreatePortfolioFloodMeshResultSetMutation'
        ).mockReturnValue({
            createPortfolioFloodMeshResultSet: vi.fn() as unknown as ReturnType<
                typeof portfoliosMutation.useCreatePortfolioFloodMeshResultSetMutation
            >['createPortfolioFloodMeshResultSet'],
            isPortfolioFloodMeshResultSetCreating: false,
            isPortfolioFloodMeshResultSetCreateError: false,
            createPortfolioFloodMeshResultSetError: null,
            cancelCreatePortfolioFloodMeshResultSet: vi.fn(),
            abortControllerRef: { current: null } as unknown as ReturnType<
                typeof portfoliosMutation.useCreatePortfolioFloodMeshResultSetMutation
            >['abortControllerRef'],
        });
        render(
            <MemoryRouter initialEntries={['/location/p1/1']}>
                <Routes>
                    <Route
                        path="/location/:portfolioId/:locationId"
                        element={<LocationPage />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders header info and enables report button; opens SLR modal', async () => {
        mockPathDependencies();
        const user = userEvent.setup();
        renderWithRoute();
        expect(screen.getByTestId('location-header')).toBeInTheDocument();
        const report = screen.getByTestId('location-report-button');
        expect(report).toBeEnabled();
        await user.click(report);
        expect(
            screen.getByTestId('download-slr-modal-layer')
        ).toBeInTheDocument();
    });

    it('opens Create Flood Mesh modal when Flood Mesh tab click triggers onClick', async () => {
        mockPathDependencies();
        const user = userEvent.setup();
        renderWithRoute();
        const buttons = screen.getAllByRole('button');
        const floodMeshBtn = buttons.find(
            (b) => b.textContent === 'Flood Mesh'
        );
        if (!floodMeshBtn) throw new Error('No flood mesh button');
        await user.click(floodMeshBtn);
        expect(
            screen.getByTestId('create-flood-mesh-modal-layer')
        ).toBeInTheDocument();
    });
});
