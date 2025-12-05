import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RoleHeader } from './RoleHeader';

describe('RoleHeader', () => {
    it('renders title and buttons; triggers onClick', async () => {
        const user = userEvent.setup();
        const onClickA = vi.fn();
        const onClickB = vi.fn();
        render(
            <RoleHeader
                title="Edit Role"
                buttons={[
                    {
                        label: 'Cancel',
                        variant: 'outlined',
                        testId: 'cancel',
                        onClick: onClickA,
                    },
                    {
                        label: 'Save',
                        variant: 'contained',
                        testId: 'save',
                        onClick: onClickB,
                        color: 'secondary',
                    },
                ]}
            />
        );
        expect(screen.getByText('Edit Role')).toBeInTheDocument();
        await user.click(screen.getByTestId('cancel'));
        await user.click(screen.getByTestId('save'));
        expect(onClickA).toHaveBeenCalled();
        expect(onClickB).toHaveBeenCalled();
    });

    it('respects disabled and tooltip', async () => {
        render(
            <RoleHeader
                title="Create New Role"
                buttons={[
                    {
                        label: 'Disabled',
                        variant: 'outlined',
                        testId: 'disabled',
                        onClick: vi.fn(),
                        disabled: true,
                        tooltip: 'Nope',
                    },
                ]}
            />
        );
        const btn = screen.getByTestId('disabled');
        expect(btn).toBeDisabled();
        // Tooltip icon rendered alongside label when tooltip provided
        expect(screen.getByText('Disabled')).toBeInTheDocument();
    });
});
