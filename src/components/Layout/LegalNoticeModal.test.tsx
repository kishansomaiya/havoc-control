import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LegalNoticeModal } from './LegalNoticeModal';

const setAck = vi.fn();
const logoutAndClearSessions = vi.fn();

vi.mock('../../context/LegalNoticeProvider', () => ({
    useLegalNoticeUpdate: () => setAck,
}));

vi.mock('../../context/SessionProvider', () => ({
    useUserSession: () => ({ logoutAndClearSessions }),
}));

describe('LegalNoticeModal', () => {
    it('renders links and calls set acknowledged on confirm', async () => {
        const user = userEvent.setup();
        render(<LegalNoticeModal />);
        expect(
            screen.getByTestId('legal-notice-modal-trial-agreement-link')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('legal-notice-modal-privacy-policy-link')
        ).toBeInTheDocument();

        await user.click(screen.getByText('Confirm'));
        expect(setAck).toHaveBeenCalledWith(true);
    });

    it('calls logout on cancel button click', async () => {
        const user = userEvent.setup();
        render(<LegalNoticeModal />);
        await user.click(screen.getByText('Log Out'));
        expect(logoutAndClearSessions).toHaveBeenCalled();
    });
});
