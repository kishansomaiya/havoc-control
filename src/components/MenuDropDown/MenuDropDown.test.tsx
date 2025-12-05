import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MenuDropDown } from './MenuDropDown';

const renderComponent = (
    props?: Partial<React.ComponentProps<typeof MenuDropDown>>
) => {
    const user = userEvent.setup();
    const renderResult = render(
        <MenuDropDown {...props}>
            <div data-testid="menu-item-1">Item 1</div>
            <div data-testid="menu-item-2">Item 2</div>
        </MenuDropDown>
    );
    return { user, ...renderResult };
};

describe('MenuDropDown', () => {
    it('renders the chevron-down icon and menu is closed by default', () => {
        renderComponent();
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('toggles open/close on icon click and shows children', async () => {
        const { user } = renderComponent();
        const clickable = document.querySelector('svg');
        expect(clickable).toBeTruthy();
        await user.click(clickable as Element);

        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();
        expect(screen.getByTestId('menu-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('menu-item-2')).toBeInTheDocument();

        const clickable2 = document.querySelector('svg');
        await user.click(clickable2 as Element);
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('closes when clicking away from the menu', async () => {
        const { user } = renderComponent();
        const clickable = document.querySelector('svg');
        await user.click(clickable as Element);
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();

        await user.click(document.body);
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('closes on item selection when closeOnSelect=true', async () => {
        const { user } = renderComponent({ closeOnSelect: true });
        const clickable = document.querySelector('svg');
        await user.click(clickable as Element);
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();

        await user.click(screen.getByTestId('menu-item-1'));
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('remains open on item selection when closeOnSelect=false', async () => {
        const { user } = renderComponent({ closeOnSelect: false });
        const clickable = document.querySelector('svg');
        await user.click(clickable as Element);
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();

        await user.click(screen.getByTestId('menu-item-2'));
        expect(screen.getByTestId('menu-drop-down-list')).toBeInTheDocument();
    });
});
