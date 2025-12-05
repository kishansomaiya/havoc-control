import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PortfolioPageTemplate } from './PortfolioPageTemplate';

describe('PortfolioPageTemplate', () => {
    it('renders title, subtitle, cancel and right toolbar button', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        const right = <button data-testid="right-btn">Right</button>;
        const tabs = <div data-testid="tabs">Tabs</div>;
        const content = <div data-testid="content">Content</div>;

        render(
            <PortfolioPageTemplate
                title="Create New Portfolio"
                subTitle="3 locations"
                rightToolBarButton={right}
                tabs={tabs}
                tabContent={content}
                onCancel={onCancel}
            />
        );

        expect(screen.getByTestId('create-portfolio-title')).toHaveTextContent(
            'Create New Portfolio'
        );
        expect(
            screen.getByTestId('edit-duplicate-portfolio-locations-qty')
        ).toHaveTextContent('3 locations');
        expect(screen.getByTestId('right-btn')).toBeInTheDocument();
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
        expect(screen.getByTestId('content')).toBeInTheDocument();

        await user.click(
            screen.getByTestId('create-edit-portfolio-cancel-button')
        );
        expect(onCancel).toHaveBeenCalled();
    });

    it('hides subtitle and cancel when not provided', () => {
        const right = <button data-testid="right-btn">Right</button>;

        render(
            <PortfolioPageTemplate
                title="Edit"
                rightToolBarButton={right}
                tabs={<div />}
                tabContent={<div />}
            />
        );

        expect(screen.getByTestId('create-portfolio-title')).toHaveTextContent(
            'Edit'
        );
        expect(
            screen.queryByTestId('edit-duplicate-portfolio-locations-qty')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('create-edit-portfolio-cancel-button')
        ).not.toBeInTheDocument();
    });
});
