import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import * as ReactRouter from 'react-router';
import * as portfoliosQuery from '../../api/queries/portfoliosQuery';
import * as userContext from '../../context/UserContextProvider';
import * as utils from '../../utils';
import { TestRoot } from '../../testing/TestRoot';
import type { ResultSetResponse } from '../../api/openapi/auto-generated/models/ResultSetResponse';
import * as RoutedTabsModule from '../../components/RoutedTabs/RoutedTabs';
import * as DashboardFiltersTriggerModule from './DashboardFilters/DashboardFiltersTrigger';
import * as DashboardFiltersModule from './DashboardFilters/DashboardFilters';
import * as DashboardFilterProviderModule from '../../context/DashboardFilterProvider';
import * as portfoliosMutation from '../../api/mutations/portfoliosMutation';
import * as CreateDisclosureModalModule from './Compliance/components/CreateDisclosureModal';

const navigateSpy = vi.fn();

vi.spyOn(RoutedTabsModule, 'RoutedTabs').mockImplementation(
    ({ tabs }: RoutedTabsModule.RoutedTabsProps) => (
        <div data-testid="tabs">
            {tabs.map((t) => (
                <button
                    key={t.route}
                    data-testid={`tab-${t.route}`}
                    disabled={Boolean(t.disabled)}
                    onClick={() => {}}
                    aria-busy={false}
                >
                    {t.route}
                </button>
            ))}
        </div>
    )
);

vi.spyOn(
    DashboardFiltersTriggerModule,
    'DashboardFiltersTrigger'
).mockImplementation(({ onClick }: { onClick: (value: boolean) => void }) => (
    <button
        data-testid="filters-trigger"
        onClick={() => onClick(true)}
    />
));

vi.spyOn(DashboardFiltersModule, 'DashboardFilters').mockImplementation(() => (
    <div data-testid="filters" />
));

vi.spyOn(
    DashboardFilterProviderModule,
    'DashboardFilterContextProvider'
).mockImplementation(({ children }: { children: React.ReactNode }) => (
    <>{children}</>
));

vi.spyOn(
    portfoliosMutation,
    'useCreatePortfolioDisclosureResultSetMutation'
).mockReturnValue({
    createPortfolioDisclosureResultSet: vi.fn(),
    isPortfolioDisclosureResultSetCreating: false,
} as unknown as ReturnType<
    typeof portfoliosMutation.useCreatePortfolioDisclosureResultSetMutation
>);

vi.spyOn(
    CreateDisclosureModalModule,
    'CreateDisclosureModal'
).mockImplementation(
    ({
        onConfirm,
        onCancel,
    }: {
        onConfirm: () => void;
        onCancel: () => void;
    }) => (
        <div data-testid="create-disclosure">
            <button onClick={onConfirm}>confirm</button>
            <button onClick={onCancel}>cancel</button>
        </div>
    )
);
describe('PortfolioPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        navigateSpy.mockClear();
        // Router hooks
        vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy);
        vi.spyOn(ReactRouter, 'useParams').mockReturnValue({
            portfolioId: 'p1',
        } as unknown as ReturnType<typeof ReactRouter.useParams>);
        // Default query hook returns
        vi.spyOn(portfoliosQuery, 'usePortfolioQuery').mockReturnValue({
            isPortfolioLoading: false,
            portfolio: {
                id: 'p1',
                name: 'P',
                createdBy: 'u1',
                pipelines: [{ id: 'pl1' }],
            },
            isPortfolioError: false,
            refetchPortfolio: vi.fn(),
        } as unknown as ReturnType<typeof portfoliosQuery.usePortfolioQuery>);
        vi.spyOn(
            portfoliosQuery,
            'usePortfolioResultSetsQuery'
        ).mockReturnValue({
            resultSets: [],
            isResultSetsLoading: false,
            isResultSetsError: false,
            refetchResultSets: vi.fn(),
        } as unknown as ReturnType<
            typeof portfoliosQuery.usePortfolioResultSetsQuery
        >);
        // User context
        vi.spyOn(userContext, 'useUserContext').mockReturnValue({
            canAccessDisclosureResultSet: false,
            checkIfUsercanAccessObjectAsAdminOrCreator: () => false,
        } as unknown as ReturnType<typeof userContext.useUserContext>);
        // Utils defaults
        vi.spyOn(utils, 'getPerilsResultSet').mockReturnValue(undefined);
        vi.spyOn(utils, 'getEconomicImpactsResultSet').mockReturnValue(
            undefined
        );
        vi.spyOn(utils, 'getScoresResultSet').mockReturnValue(undefined);
        vi.spyOn(utils, 'getFloodResultSet').mockReturnValue(undefined);
        vi.spyOn(utils, 'getPortfolioResultSetLabel').mockReturnValue('Label');
        vi.spyOn(utils, 'isDisclosureAllowedDataVersion').mockReturnValue(
            false
        );
    });

    it('shows loader while portfolio loads', async () => {
        (
            portfoliosQuery.usePortfolioQuery as unknown as ReturnType<
                typeof vi.fn
            >
        ).mockReturnValue({
            isPortfolioLoading: true,
            portfolio: undefined,
            isPortfolioError: false,
            refetchPortfolio: vi.fn(),
        } as unknown as ReturnType<typeof portfoliosQuery.usePortfolioQuery>);
        const Comp = (await import('./PortfolioPage')).PortfolioPage;
        render(
            <TestRoot>
                <MemoryRouter>
                    <Comp />
                </MemoryRouter>
            </TestRoot>
        );
        expect(
            screen.getByTestId('portfolio-overview-circular-progress')
        ).toBeInTheDocument();
    });

    it('disables tabs based on missing result sets and rights', async () => {
        const Comp = (await import('./PortfolioPage')).PortfolioPage;
        render(
            <TestRoot>
                <MemoryRouter>
                    <Comp />
                </MemoryRouter>
            </TestRoot>
        );
        // hazard disabled when no perils
        expect(screen.getByTestId('tab-hazard')).toBeDisabled();
        // impacts disabled when no EI
        expect(screen.getByTestId('tab-impacts')).toBeDisabled();
        // overview and scoring disabled when no score result set
        expect(screen.getByTestId('tab-')).toBeDisabled();
        expect(screen.getByTestId('tab-scoring')).toBeDisabled();
        // compliance disabled when no rights
        expect(screen.getByTestId('tab-compliance')).toBeDisabled();
    });

    it('shows Filter panel when trigger clicked', async () => {
        const user = userEvent.setup();
        const Comp = (await import('./PortfolioPage')).PortfolioPage;
        render(
            <TestRoot>
                <MemoryRouter>
                    <Comp />
                </MemoryRouter>
            </TestRoot>
        );
        await user.click(screen.getByTestId('filters-trigger'));
        expect(screen.getByTestId('filters')).toBeInTheDocument();
    });

    it('redirects to home when portfolio has no pipelines', async () => {
        (
            portfoliosQuery.usePortfolioQuery as unknown as ReturnType<
                typeof vi.fn
            >
        ).mockReturnValue({
            isPortfolioLoading: false,
            portfolio: {
                id: 'p1',
                name: 'P',
                createdBy: 'u1',
                pipelines: [],
            },
            isPortfolioError: false,
            refetchPortfolio: vi.fn(),
        } as unknown as ReturnType<typeof portfoliosQuery.usePortfolioQuery>);
        const Comp = (await import('./PortfolioPage')).PortfolioPage;
        render(
            <TestRoot>
                <MemoryRouter>
                    <Comp />
                </MemoryRouter>
            </TestRoot>
        );
        await new Promise((r) => setTimeout(r, 0));
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('marks compliance tab disabled when result set pending (no access path)', async () => {
        const minimalResultSet = (
            status: 'pending' | 'completed' | 'failed' = 'completed',
            type:
                | 'perils'
                | 'damages'
                | 'scores'
                | 'mesh'
                | 'disclosure' = 'perils'
        ) => ({ status, options: { type } }) as unknown as ResultSetResponse;
        vi.spyOn(utils, 'getPerilsResultSet').mockReturnValue(
            minimalResultSet('completed', 'perils')
        );
        vi.spyOn(utils, 'getEconomicImpactsResultSet').mockReturnValue(
            minimalResultSet('completed', 'damages')
        );
        vi.spyOn(utils, 'getScoresResultSet').mockReturnValue(
            minimalResultSet('completed', 'scores')
        );
        vi.spyOn(utils, 'getFloodResultSet').mockReturnValue(undefined);
        vi.spyOn(utils, 'isDisclosureAllowedDataVersion').mockReturnValue(true);
        vi.spyOn(utils, 'getComplianceResultSet').mockReturnValue(
            minimalResultSet('pending', 'disclosure')
        );
        (
            userContext.useUserContext as unknown as ReturnType<typeof vi.fn>
        ).mockReturnValue({
            canAccessDisclosureResultSet: true,
            checkIfUsercanAccessObjectAsAdminOrCreator: () => true,
        } as unknown as ReturnType<typeof userContext.useUserContext>);
        const Comp = (await import('./PortfolioPage')).PortfolioPage;
        render(
            <TestRoot>
                <MemoryRouter>
                    <Comp />
                </MemoryRouter>
            </TestRoot>
        );
        const compBtn = screen.getByTestId('tab-compliance');
        expect(compBtn).toBeDisabled();
    });
});
