import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PortfolioCategoriesTab from './PortfolioCategoriesTab';
import { PortfolioCategories } from '../../const/PortfolioCategories';

describe('PortfolioCategoriesTab', () => {
    const categories = [
        {
            name: 'My Portfolios',
            value: PortfolioCategories.MyPortfolios,
            isVisible: true,
        },
        {
            name: 'Shared With Me',
            value: PortfolioCategories.PortfoliosSharedWithMe,
            isVisible: true,
        },
        {
            name: 'Hidden',
            value: PortfolioCategories.MyTeamsPortfolios,
            isVisible: false,
        },
    ];

    it('renders only visible tabs and sets controlled value', () => {
        render(
            <PortfolioCategoriesTab
                currentPortfolioCategory={PortfolioCategories.MyPortfolios}
                onPortfolioCategoryChange={vi.fn()}
                portfolioCategories={categories}
            />
        );

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);
        expect(
            screen.getByRole('tab', { name: 'My Portfolios' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('tab', { name: 'Shared With Me' })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('tab', { name: 'Hidden' })
        ).not.toBeInTheDocument();
    });

    it('calls onPortfolioCategoryChange when selecting a different tab', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <PortfolioCategoriesTab
                currentPortfolioCategory={PortfolioCategories.MyPortfolios}
                onPortfolioCategoryChange={onChange}
                portfolioCategories={categories}
            />
        );

        await user.click(screen.getByRole('tab', { name: 'Shared With Me' }));
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            PortfolioCategories.PortfoliosSharedWithMe
        );
    });

    it('renders with zero tabs when none are visible', () => {
        render(
            <PortfolioCategoriesTab
                currentPortfolioCategory={undefined}
                onPortfolioCategoryChange={vi.fn()}
                portfolioCategories={categories.map((c) => ({
                    ...c,
                    isVisible: false,
                }))}
            />
        );
        expect(screen.queryAllByRole('tab')).toHaveLength(0);
    });
});
