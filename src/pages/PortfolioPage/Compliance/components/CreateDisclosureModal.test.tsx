import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as userContext from '../../../../context/UserContextProvider';
import { CreateDisclosureModal } from './CreateDisclosureModal';
import { IPortfolioItem } from '../../../../types';

const useUserContextSpy = vi
    .spyOn(userContext, 'useUserContext')
    .mockReturnValue({ canAccessDisclosureResultSet: true } as ReturnType<
        typeof userContext.useUserContext
    >);

const portfolio = { id: 'p1', name: 'P1' } as IPortfolioItem;

describe('CreateDisclosureModal', () => {
    it('renders content and triggers callbacks', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(
            <CreateDisclosureModal
                portfolio={portfolio}
                onConfirm={onConfirm}
                onCancel={onCancel}
                isLoading={false}
            />
        );
        expect(
            screen.getByTestId('create-disclosure-modal-title')
        ).toBeInTheDocument();
        await user.click(
            screen.getByTestId('create-disclosure-modal-button-confirm')
        );
        expect(onConfirm).toHaveBeenCalled();
        await user.click(
            screen.getByTestId('create-disclosure-modal-button-cancel')
        );
        expect(onCancel).toHaveBeenCalled();
    });

    it('does not confirm when access is denied', async () => {
        useUserContextSpy.mockReturnValueOnce({
            canAccessDisclosureResultSet: false,
        } as ReturnType<typeof userContext.useUserContext>);
        const mod = await import('./CreateDisclosureModal');
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(
            <mod.CreateDisclosureModal
                portfolio={portfolio}
                onConfirm={onConfirm}
                onCancel={() => {}}
                isLoading={false}
            />
        );
        await user.click(
            screen.getByTestId('create-disclosure-modal-button-confirm')
        );
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
