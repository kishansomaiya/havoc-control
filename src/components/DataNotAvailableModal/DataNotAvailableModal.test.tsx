import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DataNotAvailableModal } from './DataNotAvailableModal';

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router', async (orig) => {
    await orig();
    return {
        useNavigate: () => mockNavigate,
        useLocation: () => ({ key: mockUseLocation() }),
    };
});

describe('DataNotAvailableModal', () => {
    it('navigates back when key is not "default"', async () => {
        mockUseLocation.mockReturnValue('some-key');
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <MemoryRouter>
                <DataNotAvailableModal
                    defaultRoute="/home"
                    onClose={onClose}
                />
            </MemoryRouter>
        );
        await user.click(screen.getByTestId('confirm-modal-button-confirm'));
        expect(onClose).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('navigates to default route when key is "default"', async () => {
        mockUseLocation.mockReturnValue('default');
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <MemoryRouter>
                <DataNotAvailableModal
                    defaultRoute="/home"
                    onClose={onClose}
                />
            </MemoryRouter>
        );
        await user.click(screen.getByTestId('confirm-modal-button-confirm'));
        expect(onClose).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
});
