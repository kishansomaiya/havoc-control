import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PortfolioExtendedMenu } from './PortfolioExtendedMenu';
import { PipelineStatus } from '../../../api/openapi/auto-generated';
import { PortfolioCategories } from '../../../const/PortfolioCategories';
import { IPortfolioItem } from '../../../types';
vi.mock('./RenameAnalysisModal', () => ({
    RenameAnalysisModal: () => (
        <div data-testid="rename-analysis-modal-layer">modal</div>
    ),
}));

describe('PortfolioExtendedMenu', () => {
    const basePortfolio = {
        id: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'u1',
        updatedBy: 'u1',
        resultSets: [],
        pipelines: [
            {
                id: 'pl1',
                status: PipelineStatus.completed,
                errors: [],
                createdAt: new Date(),
            },
        ],
    } as IPortfolioItem;

    it('hides action button when on shared-with-me tab', () => {
        render(
            <PortfolioExtendedMenu
                portfolio={basePortfolio}
                selectedPortfolioCategoryTab={
                    PortfolioCategories.PortfoliosSharedWithMe
                }
            />
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('disables button when pipeline not completed', () => {
        render(
            <PortfolioExtendedMenu
                portfolio={{
                    ...basePortfolio,
                    pipelines: [
                        {
                            id: 'pl2',
                            status: PipelineStatus.pending,
                            errors: [],
                            createdAt: new Date(),
                        },
                    ],
                }}
            />
        );
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('opens menu and modal on Rename Analysis click', async () => {
        const user = userEvent.setup();
        render(<PortfolioExtendedMenu portfolio={basePortfolio} />);
        const button = screen.getByRole('button');
        expect(button).toBeEnabled();
        await user.click(button);

        await user.click(screen.getByTestId('rename-analysis-menu-item'));
        expect(
            screen.getByTestId('rename-analysis-modal-layer')
        ).toBeInTheDocument();
    });
});
