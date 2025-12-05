import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
    it('renders title and string message', () => {
        render(
            <ConfirmModal
                title="My Title"
                message="A plain message"
            />
        );
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'My Title'
        );
        expect(screen.getByTestId('confirm-modal-message')).toHaveTextContent(
            'A plain message'
        );
    });

    it('renders ReactNode message when string is not provided', () => {
        render(
            <ConfirmModal
                title="Node Title"
                message={<div data-testid="custom-node">X</div>}
            />
        );
        expect(screen.getByTestId('custom-node')).toBeInTheDocument();
    });

    it('calls onConfirm when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(
            <ConfirmModal
                title="Title"
                message="msg"
                onConfirm={onConfirm}
            />
        );
        await user.click(screen.getByTestId('confirm-modal-button-confirm'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(
            <ConfirmModal
                title="Title"
                message="msg"
                onCancel={onCancel}
            />
        );
        await user.click(screen.getByTestId('confirm-modal-button-cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('hides cancel button when cancelLabel is empty', () => {
        render(
            <ConfirmModal
                title="Title"
                message="msg"
                cancelLabel=""
            />
        );
        expect(
            screen.queryByTestId('confirm-modal-button-cancel')
        ).not.toBeInTheDocument();
    });

    it('disables confirm when isDisabled and shows loading on confirm when isLoading', () => {
        render(
            <ConfirmModal
                title="Title"
                message="msg"
                isDisabled
                isLoading
            />
        );
        const confirm = screen.getByTestId('confirm-modal-button-confirm');
        expect(confirm).toBeDisabled();
        expect(confirm).toBeInTheDocument();
    });

    it('disables cancel button while loading', () => {
        render(
            <ConfirmModal
                title="Title"
                message="msg"
                isLoading
                onCancel={() => {}}
            />
        );
        const cancel = screen.getByTestId('confirm-modal-button-cancel');
        expect(cancel).toBeDisabled();
    });

    it('renders additional buttons with tooltip and calls their onClick', async () => {
        const user = userEvent.setup();
        const onExtra = vi.fn();
        render(
            <ConfirmModal
                title="Title"
                message="msg"
                buttons={[
                    {
                        label: 'Download',
                        variant: 'outlined',
                        testId: 'extra-btn',
                        onClick: onExtra,
                        tooltip: 'Tip text',
                    },
                ]}
            />
        );
        const btn = screen.getByTestId('extra-btn');
        await user.hover(btn);
        expect(await screen.findByText('Tip text')).toBeInTheDocument();
        await user.click(btn);
        expect(onExtra).toHaveBeenCalledTimes(1);
    });
});
