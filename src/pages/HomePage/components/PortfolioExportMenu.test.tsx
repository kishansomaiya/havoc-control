import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioExportMenu } from './PortfolioExportMenu';
import { PortfolioCategories } from '../../../const/PortfolioCategories';
import { IPortfolioItem, ResultSetStatus, DataVersion } from '../../../types';
import { TestRoot } from '../../../testing/TestRoot';

const userContextValue = {
    canAccessKnowledgeBase: true,
    canAccessDisclosureResultSet: true,
};

describe('PortfolioExportMenu', () => {
    const portfolio = {
        id: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'u1',
        updatedBy: 'u1',
        resultSets: [
            {
                id: 'perils',
                status: ResultSetStatus.Completed,
                options: {
                    dataVersion: DataVersion.v3_2_0,
                    scenarios: ['ssp245', 'ssp585'],
                },
            },
            {
                id: 'scores',
                status: ResultSetStatus.Completed,
                options: { dataVersion: DataVersion.v3_2_0 },
            },
        ],
        pipelines: [
            {
                id: 'pl1',
                status: 'completed',
                errors: [],
                createdAt: new Date(),
                perilsResultSetId: 'perils',
                scoresResultSetId: 'scores',
            },
        ],
    } as unknown as IPortfolioItem;

    const openMenu = async () => {
        const user = userEvent.setup();
        await user.click(screen.getByTestId('portfolio-details-export-button'));
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('opens menu and shows core sections', async () => {
        render(
            <TestRoot userContextValue={userContextValue}>
                <PortfolioExportMenu
                    portfolio={portfolio}
                    selectedPortfolioCategoryTab={
                        PortfolioCategories.MyPortfolios
                    }
                />
            </TestRoot>
        );
        await openMenu();
        expect(
            screen.getByTestId('portfolio-details-export-menu')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-details-export-menu-standard')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-details-export-menu-enhanced')
        ).toBeInTheDocument();
    });

    it('shows Single-Location Reports menu item and opens modal', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot userContextValue={userContextValue}>
                <PortfolioExportMenu
                    portfolio={portfolio}
                    selectedPortfolioCategoryTab={
                        PortfolioCategories.MyPortfolios
                    }
                />
            </TestRoot>
        );
        await openMenu();
        await user.click(
            screen.getByTestId(
                'portfolio-details-export-menu-single-loc-report'
            )
        );
        expect(
            screen.getByTestId('download-slr-modal-layer')
        ).toBeInTheDocument();
    });

    it('hides enhanced section on shared-with-me', async () => {
        render(
            <TestRoot userContextValue={userContextValue}>
                <PortfolioExportMenu
                    portfolio={portfolio}
                    selectedPortfolioCategoryTab={
                        PortfolioCategories.PortfoliosSharedWithMe
                    }
                />
            </TestRoot>
        );
        await openMenu();
        expect(
            screen.queryByTestId('portfolio-details-export-menu-enhanced')
        ).not.toBeInTheDocument();
    });
});
