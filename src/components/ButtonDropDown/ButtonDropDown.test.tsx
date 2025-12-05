import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ButtonDropDown } from './ButtonDropDown';
import { Box } from '@mui/material';

const defaultLabel = 'Actions';

const CustomIcon = ({ testId }: { testId: string }) => (
    <Box
        component="span"
        data-testid={testId}
    />
);

const renderComponent = (
    props?: Partial<React.ComponentProps<typeof ButtonDropDown>>
) => {
    const user = userEvent.setup();
    const renderResult = render(
        <ButtonDropDown
            buttonLabel={defaultLabel}
            {...props}
        >
            <div data-testid="menu-item-1">Item 1</div>
            <div data-testid="menu-item-2">Item 2</div>
        </ButtonDropDown>
    );
    return { user, ...renderResult };
};

describe('ButtonDropDown', () => {
    it('renders a button with the provided label and menu is closed by default', () => {
        renderComponent();
        const button = screen.getByRole('button', { name: defaultLabel });
        expect(button).toBeInTheDocument();
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('opens the menu when the button is clicked and shows children', async () => {
        const { user } = renderComponent();
        await user.click(screen.getByRole('button', { name: defaultLabel }));
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();
        expect(screen.getByTestId('menu-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('menu-item-2')).toBeInTheDocument();
    });

    it('shows custom openIcon/closeIcon depending on state', async () => {
        const { user } = renderComponent({
            openIcon: <CustomIcon testId="open-icon" />,
            closeIcon: <CustomIcon testId="close-icon" />,
        });

        expect(screen.getByTestId('close-icon')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: defaultLabel }));
        expect(await screen.findByTestId('open-icon')).toBeInTheDocument();
    });

    it('honors explicit icon prop and does not switch icons when opened', async () => {
        const { user } = renderComponent({
            icon: <CustomIcon testId="fixed-icon" />,
        });
        expect(screen.getByTestId('fixed-icon')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: defaultLabel }));
        expect(await screen.findByTestId('fixed-icon')).toBeInTheDocument();
        expect(screen.getByTestId('menu-drop-down-list')).toBeInTheDocument();
    });

    it('closes when clicking away from the menu', async () => {
        const { user } = renderComponent();
        await user.click(screen.getByRole('button', { name: defaultLabel }));
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();

        await user.click(document.body);
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('closes when an item is selected and closeOnSelect=true', async () => {
        const { user } = renderComponent({ closeOnSelect: true });
        await user.click(screen.getByRole('button', { name: defaultLabel }));
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();

        await user.click(screen.getByTestId('menu-item-1'));
        expect(
            screen.queryByTestId('menu-drop-down-list')
        ).not.toBeInTheDocument();
    });

    it('stays open when an item is selected and closeOnSelect=false', async () => {
        const { user } = renderComponent({ closeOnSelect: false });
        await user.click(screen.getByRole('button', { name: defaultLabel }));
        expect(
            await screen.findByTestId('menu-drop-down-list')
        ).toBeInTheDocument();

        await user.click(screen.getByTestId('menu-item-2'));
        expect(screen.getByTestId('menu-drop-down-list')).toBeInTheDocument();
    });

    it('supports MUI button variants through buttonStyle prop', async () => {
        const { rerender } = render(
            <ButtonDropDown
                buttonLabel={defaultLabel}
                buttonStyle="contained"
            >
                <div />
            </ButtonDropDown>
        );
        const button = screen.getByRole('button', { name: defaultLabel });
        expect(button.className).toMatch(/MuiButton-contained/);

        rerender(
            <ButtonDropDown
                buttonLabel={defaultLabel}
                buttonStyle="outlined"
            >
                <div />
            </ButtonDropDown>
        );
        expect(
            screen.getByRole('button', { name: defaultLabel }).className
        ).toMatch(/MuiButton-outlined/);

        rerender(
            <ButtonDropDown
                buttonLabel={defaultLabel}
                buttonStyle="text"
            >
                <div />
            </ButtonDropDown>
        );
        expect(
            screen.getByRole('button', { name: defaultLabel }).className
        ).toMatch(/MuiButton-text/);
    });
});
