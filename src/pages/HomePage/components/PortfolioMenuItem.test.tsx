import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PortfolioMenuItem } from './PortfolioMenuItem';

describe('PortfolioMenuItem', () => {
    it('renders title and triggers onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn().mockResolvedValue(undefined);
        render(
            <PortfolioMenuItem
                title="My Download"
                onClick={onClick}
            />
        );

        const item = screen.getByTestId('portfolio-details-menu-item');
        expect(item).toHaveTextContent('My Download');
        await user.click(item);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows Downloading text and disables while running', async () => {
        const user = userEvent.setup();
        let resolveClick: () => void;
        const onClick = vi.fn().mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveClick = resolve;
                })
        );
        render(
            <PortfolioMenuItem
                title="Tool"
                onClick={onClick}
            />
        );

        const item = screen.getByTestId('portfolio-details-menu-item');
        await user.click(item);
        expect(item).toHaveTextContent('Downloading');
        expect(item).toHaveAttribute('aria-disabled', 'true');

        // Finish promise
        // @ts-expect-error resolveClick is assigned above
        resolveClick();
    });

    it('is disabled when disabled prop is true', () => {
        render(
            <PortfolioMenuItem
                title="Disabled"
                disabled
                onClick={vi.fn()}
            />
        );
        expect(
            screen.getByTestId('portfolio-details-menu-item')
        ).toHaveAttribute('aria-disabled', 'true');
    });
});
