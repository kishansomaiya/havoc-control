import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DownloadSLRSelection } from './DownloadSLRSelection';

describe('DownloadSLRSelection', () => {
    it('renders label and helper text', () => {
        render(
            <DownloadSLRSelection
                name="option"
                value="All"
                label="All Locations"
                isSelected={false}
                onChange={vi.fn()}
                helperText="Some help"
            />
        );

        expect(
            screen.getByTestId('download-slr-modal-radio-button-name')
        ).toHaveTextContent('All Locations');
        expect(
            screen.getByTestId('download-slr-modal-radio-button-helptext')
        ).toHaveTextContent('Some help');
    });

    it('calls onChange when clicked if enabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <DownloadSLRSelection
                name="option"
                value="Specify"
                label="Specify Location ID"
                isSelected={false}
                onChange={onChange}
            />
        );

        await user.click(screen.getByRole('radio'));
        expect(onChange).toHaveBeenCalledWith('option', 'Specify');
    });

    it('does not call onChange when disabled and shows tooltip icon when tooltip provided', async () => {
        const onChange = vi.fn();
        render(
            <DownloadSLRSelection
                name="option"
                value="all"
                label="All Locations"
                isSelected={false}
                onChange={onChange}
                disabled
                tooltip="Disabled tip"
            />
        );

        // radio is disabled and has a tooltip icon
        expect(screen.getByRole('radio')).toBeDisabled();
        expect(onChange).not.toHaveBeenCalled();
        expect(
            screen.getByTestId('download-slr-modal-radio-button-tooltip')
        ).toBeInTheDocument();
    });

    it('reflects selected and disabled states on radio', () => {
        const { rerender } = render(
            <DownloadSLRSelection
                name="option"
                value="all"
                label="All Locations"
                isSelected={false}
                onChange={vi.fn()}
            />
        );
        expect(screen.getByRole('radio')).not.toBeChecked();

        rerender(
            <DownloadSLRSelection
                name="option"
                value="all"
                label="All Locations"
                isSelected
                onChange={vi.fn()}
                disabled
            />
        );
        expect(screen.getByRole('radio')).toBeChecked();
        expect(screen.getByRole('radio')).toBeDisabled();
    });
});
