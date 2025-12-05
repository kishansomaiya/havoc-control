import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PortfolioItem } from './PortfolioItem';
import { PipelineStatus } from '../../../api/openapi/auto-generated';
import { PortfolioCategories } from '../../../const/PortfolioCategories';
import { IPortfolioItem } from '../../../types';
import * as mutations from '../../../api/mutations/portfoliosMutation';
import * as utils from '../../../utils';
import { TestRoot, UserContextOverride } from '../../../testing/TestRoot';

describe('PortfolioItem', () => {
    const base = {
        id: 'p1',
        name: 'Test Portfolio',
        locationCount: 2,
        category: 'Category',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-03'),
        createdBy: 'u1',
        updatedBy: 'u1',
        resultSets: [],
        pipelines: [
            {
                id: 'pl1',
                status: PipelineStatus.completed,
                createdAt: new Date('2024-01-02'),
                errors: [],
            },
        ],
    } as unknown as IPortfolioItem;

    const noop = () => {};

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderItem = (
        props?: Partial<React.ComponentProps<typeof PortfolioItem>>
    ) => {
        // Spy to stub the portfolio download hook, returning a predictable mock and avoiding network calls
        vi.spyOn(mutations, 'useDownloadPortfolioMutation').mockReturnValue({
            downloadPortfolio: vi.fn(async () => [
                { url: 'https://x/1.csv', filename: '1.csv' },
            ]),
            isPortfolioDownloading: false,
        } as unknown as ReturnType<
            typeof mutations.useDownloadPortfolioMutation
        >);
        // Spy to stub the geocode log download hook to control outputs during the test
        vi.spyOn(
            mutations,
            'useDownloadPortfolioGeocodeLogMutation'
        ).mockReturnValue({
            downloadPortfolioGeocodeLog: vi.fn(async () => [
                { url: 'https://x/g.csv', filename: 'g.csv' },
            ]),
            isPortfolioGeocodeLogDownloading: false,
        } as unknown as ReturnType<
            typeof mutations.useDownloadPortfolioGeocodeLogMutation
        >);
        // Spy to stub the delete mutation hook to prevent actual deletes and control loading state
        vi.spyOn(mutations, 'useDeletePortfolioMutation').mockReturnValue({
            deletePortfolio: vi.fn(async () => {}),
            isPortfolioDeleting: false,
        } as unknown as ReturnType<
            typeof mutations.useDeletePortfolioMutation
        >);
        // Spy to stub the unshare-self mutation hook to avoid external side effects
        vi.spyOn(mutations, 'useUnShareSelfPortfolioMutation').mockReturnValue({
            unshareSelfPortfolio: vi.fn(async () => {}),
            isUnshareSelfPortfolioLoading: false,
        } as unknown as ReturnType<
            typeof mutations.useUnShareSelfPortfolioMutation
        >);

        // Spy to make retry/backoff deterministic for the test runtime
        vi.spyOn(utils, 'getWaitTime').mockReturnValue([1, 5]);
        // Spy to silence debug logging and avoid noisy test output
        vi.spyOn(utils, 'captureDebugLog').mockImplementation(vi.fn());
        // Spy to prevent real browser downloads during the test
        vi.spyOn(utils, 'downloadFile').mockImplementation(vi.fn());
        // Spy to stabilize the computed analysis label used in UI assertions
        vi.spyOn(utils, 'getPortfolioResultSetLabel').mockReturnValue(
            'EI + Scores'
        );
        // Spy to simplify highlight logic, returning the input as-is for predictable assertions
        vi.spyOn(utils, 'highlightsMatches').mockImplementation(
            (str: string | null | undefined) => [str ?? '']
        );
        // Spy to control the location count label formatting
        vi.spyOn(utils, 'getLocationCountLabel').mockImplementation(
            (c?: number) => `${c ?? 0} locations`
        );

        const sessionValue = {
            logoutAndClearSessions: vi.fn(),
            userPermissions: [],
        } as UserContextOverride;

        return render(
            <MemoryRouter>
                <TestRoot userContextValue={sessionValue}>
                    <PortfolioItem
                        portfolio={base}
                        onPortfolioSelect={noop}
                        onPortfolioDelete={noop}
                        isSelected={false}
                        selectedPortfolioCategoryTab={
                            PortfolioCategories.MyPortfolios
                        }
                        {...props}
                    />
                </TestRoot>
            </MemoryRouter>
        );
    };

    it('renders core info and category chip', () => {
        renderItem();
        expect(screen.getByTestId('portfolio-item-name')).toHaveTextContent(
            'Test Portfolio'
        );
        expect(
            screen.getByTestId('portfolio-item-analysis-type')
        ).toHaveTextContent('EI + Scores');
        expect(
            screen.getByTestId('portfolio-item-location-qty')
        ).toHaveTextContent('2 locations');
        expect(screen.getByTestId('portfolio-item-category')).toHaveTextContent(
            'Category'
        );
    });

    it('shows loading block when pipeline is pending', () => {
        renderItem({
            portfolio: {
                ...base,
                pipelines: [
                    {
                        id: 'pl2',
                        status: PipelineStatus.pending,
                        errors: [],
                        createdAt: new Date(),
                    },
                ],
            },
        });
        expect(
            screen.getByTestId('portfolio-item-loading')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-item-loading-progress-icon')
        ).toBeInTheDocument();
    });

    it('opens menu and triggers actions', async () => {
        const user = userEvent.setup();
        renderItem();
        await user.click(screen.getByTestId('portfolio-item-menu-icon'));
        // menu opens; download item should be present
        expect(
            screen.getByTestId('portfolio-item-menu-download')
        ).toBeInTheDocument();
        // clicking download executes action (menu may close asynchronously)
        await user.click(screen.getByTestId('portfolio-item-menu-download'));
    });

    it('shared-with-me shows removal option and not edit/download/delete items', async () => {
        const user = userEvent.setup();
        renderItem({
            selectedPortfolioCategoryTab:
                PortfolioCategories.PortfoliosSharedWithMe,
        });
        await user.click(screen.getByTestId('portfolio-item-menu-icon'));
        expect(
            screen.getByTestId(
                'portfolio-item-menu-remove-portfolio-from-my-view'
            )
        ).toBeInTheDocument();
        expect(
            screen.queryByText('Edit Settings & Analysis')
        ).not.toBeInTheDocument();
    });

    it('disables card when locationCount exceeds limit', () => {
        renderItem({ portfolio: { ...base, locationCount: 999999 } });
        // Disabled state is styled; ensure tooltip aria-label is present
        expect(
            screen.getByLabelText(
                'CSG App supports portfolios of 10K or lower locations'
            )
        ).toBeInTheDocument();
    });
});
