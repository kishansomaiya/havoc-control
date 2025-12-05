import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectProps } from './Select';

const mockOptions = [
    { label: 'Option One', value: '1' },
    { label: 'Option Two', value: '2' },
    { label: 'Option Three', value: '3' },
];

const renderComponent = (props: SelectProps) => {
    const user = userEvent.setup();
    const renderResult = render(<Select {...props} />);
    return {
        user,
        ...renderResult,
    };
};

describe('Select', () => {
    it('should render the select component with its label', () => {
        const labelText = 'Choose an option';
        renderComponent({
            label: labelText,
            value: '',
            options: mockOptions,
        });

        // The select is identified by the 'combobox' role
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).toHaveAccessibleName(labelText);
    });

    it('should not render a label if the label prop is not provided', () => {
        renderComponent({ value: '', options: mockOptions });
        expect(screen.queryByLabelText(/./)).not.toBeInTheDocument();
    });

    it('should display the correct initial value', () => {
        renderComponent({
            label: 'My Select',
            value: '2',
            options: mockOptions,
        });
        // The displayed value in a MuiSelect is the text content of the combobox button
        expect(screen.getByRole('combobox')).toHaveTextContent('Option Two');
    });

    it('should use the provided id for the select and label', () => {
        const labelText = 'My Select';
        const customId = 'my-custom-select-id';
        renderComponent({
            id: customId,
            label: labelText,
            value: '1',
            options: mockOptions,
        });

        const select = screen.getByRole('combobox');
        expect(select).toHaveAttribute('id', customId);
        expect(select).toHaveAccessibleName(labelText);
    });

    it('should generate an id from the label if no id is provided', () => {
        const labelText = 'My Select Label';
        renderComponent({
            label: labelText,
            value: '1',
            options: mockOptions,
        });

        const select = screen.getByRole('combobox');
        expect(select).toHaveAttribute('id', 'mySelectLabel');
    });

    it('should open the dropdown and show options when clicked', async () => {
        const { user } = renderComponent({
            label: 'My Select',
            value: '1',
            options: mockOptions,
        });

        await user.click(screen.getByRole('combobox'));

        // Check that all options are now visible in the document
        for (const option of mockOptions) {
            expect(
                await screen.findByRole('option', { name: option.label })
            ).toBeInTheDocument();
        }
    });

    it('should call onChange with the new value when an option is selected', async () => {
        const onChange = vi.fn();
        const { user } = renderComponent({
            label: 'My Select',
            value: '1',
            options: mockOptions,
            onChange,
        });

        // Open the select dropdown
        await user.click(screen.getByRole('combobox'));

        // Find and click the second option
        const optionToSelect = await screen.findByRole('option', {
            name: 'Option Two',
        });
        await user.click(optionToSelect);

        // Assert that onChange was called correctly
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('2');
    });

    it('should render without options if none are provided', async () => {
        const { user } = renderComponent({
            label: 'Empty Select',
            value: '',
            options: [],
        });

        await user.click(screen.getByRole('combobox'));

        // No options should be found
        expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });
});
