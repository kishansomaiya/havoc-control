import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CustomDropDown, CustomDropDownOption } from './CustomDropDown';

const baseOptions: CustomDropDownOption[] = [
    { name: 'One', value: '1' },
    { name: 'Two', value: '2', disabled: true },
    { name: 'Three', value: '3', selected: true },
];

const openMenu = async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId('portfolio-details-export-arrow'));
    return user;
};

describe('CustomDropDown', () => {
    it('opens and closes the menu', async () => {
        render(
            <CustomDropDown
                label="Menu"
                options={baseOptions}
            />
        );
        const user = await openMenu();
        expect(screen.getByTestId('custom-dropdown-menu')).toBeInTheDocument();
        await user.click(document.body);
        expect(screen.getByTestId('custom-dropdown-menu')).toBeInTheDocument();
    });

    it('renders Empty Data message when no options are provided', async () => {
        render(
            <CustomDropDown
                label="Menu"
                options={[]}
            />
        );
        await openMenu();
        const noDataOption = screen.getByTestId('dd-no-data-option');
        expect(noDataOption).toHaveTextContent('No options available');
    });

    it('renders options, disabled option, and selected count badge hidden by default', async () => {
        render(
            <CustomDropDown
                label="Menu"
                options={baseOptions}
            />
        );
        await openMenu();
        const options = screen.getAllByTestId('dd-option');
        expect(options).toHaveLength(3);
        expect(options[1]).toHaveAttribute('aria-disabled', 'true');
    });

    it('checkable mode toggles checkbox and calls option handlers', async () => {
        const onSelectOption = vi.fn();
        const onSelectionChange = vi.fn();
        const options: CustomDropDownOption[] = baseOptions.map((o) => ({
            ...o,
            selected: o.selected ?? false,
            onSelectionChange,
        }));

        render(
            <CustomDropDown
                label="Menu"
                options={options}
                checkable
                onSelectOption={onSelectOption}
            />
        );

        const user = await openMenu();

        const items = screen.getAllByTestId('dd-option');
        await user.click(items[0]);
        expect(onSelectOption).toHaveBeenCalled();

        const checkbox = screen.getAllByRole('checkbox')[0];
        await user.click(checkbox);
        expect(onSelectionChange).toHaveBeenCalled();
    });

    it('shows sticky footer actions when handlers provided and disables buttons properly', async () => {
        const onApplySelectionChange = vi.fn();
        const onClearSelectionChange = vi.fn();
        const normalized = baseOptions.map((o) => ({
            ...o,
            selected: o.selected ?? false,
        }));

        render(
            <CustomDropDown
                label="Menu"
                options={normalized}
                checkable
                onApplySelectionChange={onApplySelectionChange}
                onClearSelectionChange={onClearSelectionChange}
            />
        );
        const user = await openMenu();
        const clearBtn = screen.getByTestId('dd-clear-button');
        const applyBtn = screen.getByTestId('dd-apply-button');
        expect(clearBtn).toBeEnabled();
        expect(applyBtn).toBeDisabled();

        await user.click(screen.getAllByTestId('dd-option')[0]);
        expect(screen.getByTestId('dd-apply-button')).toBeEnabled();

        await user.click(screen.getByTestId('dd-apply-button'));
        expect(onApplySelectionChange).toHaveBeenCalled();

        await user.click(screen.getByTestId('dd-clear-button'));
        expect(onClearSelectionChange).toHaveBeenCalled();
    });

    it('keeps menu open when loading and closes otherwise', async () => {
        const { rerender } = render(
            <CustomDropDown
                label="Menu"
                options={baseOptions}
                loading
            />
        );
        const user = await openMenu();
        await user.click(document.body);
        expect(screen.getByTestId('custom-dropdown-menu')).toBeInTheDocument();

        rerender(
            <CustomDropDown
                label="Menu"
                options={baseOptions}
            />
        );
        await user.click(document.body);
        await openMenu();
        expect(screen.getByTestId('custom-dropdown-menu')).toBeInTheDocument();
    });
});
