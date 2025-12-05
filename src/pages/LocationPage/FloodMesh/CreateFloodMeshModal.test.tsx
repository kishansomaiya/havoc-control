import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CreateFloodMeshModal } from './components/CreateFloodMeshModal';
import { IPortfolioItem } from '../../../types';
import { MeshType } from '../../../api/openapi/auto-generated';
import { MemoryRouter } from 'react-router-dom';

// Rationale: user context controls feature flags like large grid access; keeping
// a focused stub avoids wiring flagsmith and app-level providers in tests.
vi.mock('../../../context/UserContextProvider', () => ({
    useUserContext: () => ({ canAccessLargeGrid: false }),
}));

describe('CreateFloodMeshModal', () => {
    const basePortfolio: IPortfolioItem = {
        id: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'u1',
        updatedBy: 'u1',
        resultSets: [],
        pipelines: [],
    } as unknown as IPortfolioItem;

    it('renders and shows disabled 15x15 option when canAccessLargeGrid is false', () => {
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(
            <MemoryRouter>
                <CreateFloodMeshModal
                    portfolio={basePortfolio}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('create-flood-mesh-modal-title')
        ).toBeInTheDocument();
        const fixedRadioLabel = screen.getByTestId(
            'create-flood-mesh-radio-button-15x15'
        );
        const fixedRadioInput = fixedRadioLabel.querySelector(
            'input'
        ) as HTMLInputElement;
        expect(fixedRadioInput).toBeDisabled();
    });

    it('calls onCancel and onConfirm', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(
            <MemoryRouter>
                <CreateFloodMeshModal
                    portfolio={basePortfolio}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </MemoryRouter>
        );
        await user.click(
            screen.getByTestId('create-flood-mesh-modal-button-cancel')
        );
        expect(onCancel).toHaveBeenCalled();

        await user.click(
            screen.getByTestId('create-flood-mesh-modal-button-confirm')
        );
        const firstCallArg = onConfirm.mock.calls[0][0];
        expect(firstCallArg).toEqual({ type: MeshType.dynamic });
    });
});
