import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DownloadSLRModal } from './DownloadSLRModal';
import { IPortfolioItem } from '../../../types';
import type { PerilsResultSetOptions } from '../../../api/openapi/auto-generated';
import { TestRoot } from '../../../testing/TestRoot';

const userContextValue = {
    canAccessKnowledgeBase: true,
    canAccessDisclosureResultSet: true,
};

describe('DownloadSLRModal', () => {
    const portfolio: IPortfolioItem = {
        id: 'p1',
        locationCount: 5,
        resultSets: [
            {
                id: 'perils-1',
                options: {
                    scenarios: ['SSP245', 'SSP585'],
                } as unknown as PerilsResultSetOptions,
            },
            { id: 'scores-1', options: {} },
            { id: 'ei-1', options: { defaults: {} } },
            { id: 'disc-1', options: {} },
        ] as unknown as IPortfolioItem['resultSets'],
        pipelines: [
            {
                id: 'pl1',
                createdAt: new Date(),
                errors: [],
                perilsResultSetId: 'perils-1',
                scoresResultSetId: 'scores-1',
                impactsResultSetId: 'ei-1',
                disclosureResultSetId: 'disc-1',
            },
        ] as unknown as IPortfolioItem['pipelines'],
    } as IPortfolioItem;
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    beforeEach(() => {
        onConfirm.mockClear();
        onCancel.mockClear();
    });

    it('renders title and base controls', () => {
        render(
            <TestRoot userContextValue={userContextValue}>
                <DownloadSLRModal
                    portfolio={portfolio as IPortfolioItem}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </TestRoot>
        );
        expect(
            screen.getByTestId('download-slr-modal-title')
        ).toHaveTextContent('Bulk Download Single-Location Reports');
        expect(
            screen.getByTestId('download-slr-modal-button-confirm')
        ).toBeDisabled();
    });

    it('enables All Locations option unless count exceeds threshold and allows entering location id when Specify selected', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot userContextValue={userContextValue}>
                <DownloadSLRModal
                    portfolio={
                        { ...portfolio, locationCount: 5 } as IPortfolioItem
                    }
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </TestRoot>
        );
        // Select Specify is default; input should be enabled
        const inputWrapper = screen.getByTestId(
            'download-slr-modal-location-id-input'
        );
        const textbox = inputWrapper.querySelector('input') as HTMLInputElement;
        await user.type(textbox, '12a3');
        // Non-numeric filtered; expect 123
        expect(textbox.value).toBe('123');
    });

    it('disables All Locations option when locationCount is large', () => {
        render(
            <TestRoot userContextValue={userContextValue}>
                <DownloadSLRModal
                    portfolio={
                        {
                            ...portfolio,
                            locationCount: 100000,
                        } as IPortfolioItem
                    }
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </TestRoot>
        );
        // underlying input's aria-label is lowercase value
        const allRadio = screen.getByRole('radio', { name: 'all' });
        expect(allRadio).toBeDisabled();
    });

    it('submits correct payload for Specify with CSRD type', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot userContextValue={userContextValue}>
                <DownloadSLRModal
                    portfolio={portfolio as IPortfolioItem}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </TestRoot>
        );

        // Choose CSRD clicking label
        await user.click(screen.getByText('CSRD Report'));
        const inputWrapper = screen.getByTestId(
            'download-slr-modal-location-id-input'
        );
        const textbox = inputWrapper.querySelector('input') as HTMLInputElement;
        await user.clear(textbox);
        await user.type(textbox, '42');
        expect(
            screen.getByTestId('download-slr-modal-button-confirm')
        ).toBeEnabled();
        await user.click(
            screen.getByTestId('download-slr-modal-button-confirm')
        );

        expect(onConfirm).toHaveBeenCalled();
        const payload = onConfirm.mock.calls[0][0];
        expect(payload.disclosureResultSetId).toBeDefined();
        expect(payload.locationIds).toEqual([42]);
    });

    it('toggles scenario and format disabled when CSRD selected', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot userContextValue={userContextValue}>
                <DownloadSLRModal
                    portfolio={portfolio as IPortfolioItem}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </TestRoot>
        );

        // Switch to CSRD
        await user.click(screen.getByText('CSRD Report'));
        // Scenario and format radios should be disabled (aria-labels lowercase)
        expect(screen.getByRole('radio', { name: 'ssp245' })).toBeDisabled();
        expect(screen.getByRole('radio', { name: 'ssp585' })).toBeDisabled();
        expect(screen.getByRole('radio', { name: 'basic' })).toBeDisabled();
        expect(screen.getByRole('radio', { name: 'standard' })).toBeDisabled();
        expect(screen.getByRole('radio', { name: 'advanced' })).toBeDisabled();
    });

    it('calls onCancel', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot userContextValue={userContextValue}>
                <DownloadSLRModal
                    portfolio={portfolio as IPortfolioItem}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    isLoading={false}
                />
            </TestRoot>
        );
        await user.click(
            screen.getByTestId('download-slr-modal-button-cancel')
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
