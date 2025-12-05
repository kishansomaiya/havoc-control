import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComponentProps } from 'react';
import Typography from '@mui/material/Typography';
import { Switch, SwitchProps } from './Switch';
import userEvent from '@testing-library/user-event';

const renderComponent = (props: SwitchProps = {}) => {
    return render(<Switch {...props} />);
};

describe('Switch', () => {
    it('should render the switch component', () => {
        renderComponent();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render with a label and associate it with the switch', () => {
        const labelText = 'Enable Notifications';
        renderComponent({ label: labelText });

        const label = screen.getByText(labelText);
        expect(label).toBeInTheDocument();

        const switchControl = screen.getByRole('checkbox');
        expect(switchControl).toHaveAccessibleName(labelText);
    });

    it('should not render a label if the label prop is not provided', () => {
        renderComponent();
        const switchControl = screen.getByRole('checkbox');
        expect(switchControl).not.toHaveAccessibleName();
    });

    it('should use the provided id for the switch and label', () => {
        const labelText = 'My Switch';
        const customId = 'my-custom-switch-id';
        renderComponent({ id: customId, label: labelText });

        const switchControl = screen.getByRole('checkbox');
        expect(switchControl).toHaveAttribute('id', customId);

        // getByLabelText finds the control associated with the label text.
        expect(screen.getByLabelText(labelText)).toBe(switchControl);
    });

    it('should generate an id from the label if no id is provided', () => {
        const labelText = 'My Switch Label';
        renderComponent({ label: labelText });

        const switchControl = screen.getByRole('checkbox');
        expect(switchControl).toHaveAttribute('id', 'mySwitchLabel');
        expect(screen.getByLabelText(labelText)).toBe(switchControl);
    });

    it('should be checked when the checked prop is true', () => {
        renderComponent({ label: 'Test', checked: true });
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should not be checked when the checked prop is false', () => {
        renderComponent({ label: 'Test', checked: false });
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should call onCheckedChange with the new value when toggled', async () => {
        const user = userEvent.setup();
        const onCheckedChange = vi.fn();
        const { rerender } = renderComponent({
            label: 'Toggle me',
            checked: false,
            onCheckedChange,
        });

        const switchControl = screen.getByRole('checkbox');
        await user.click(switchControl);

        expect(onCheckedChange).toHaveBeenCalledTimes(1);
        expect(onCheckedChange).toHaveBeenCalledWith(true);

        // Rerender with the new checked state and check the toggle back
        rerender(
            <Switch
                label="Toggle me"
                checked={true}
                onCheckedChange={onCheckedChange}
            />
        );
        await user.click(switchControl);
        expect(onCheckedChange).toHaveBeenCalledTimes(2);
        expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    });

    it('should be disabled when the disabled prop is true', () => {
        renderComponent({ label: 'Disabled Switch', disabled: true });
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('should apply the correct label variant', () => {
        const labelText = 'Variant Label';
        const variant = 'h6' as ComponentProps<typeof Typography>['variant'];
        renderComponent({ label: labelText, labelVariant: variant });

        const label = screen.getByText(labelText);
        expect(label.tagName).toBe('H6');
    });
});
