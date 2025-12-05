import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RenameAnalysisModal } from './RenameAnalysisModal';
import { IPortfolioItem } from '../../../types';
import { QueryClient } from '@tanstack/react-query';
import { ResultSetsApi } from '../../../api/openapi/auto-generated';
import type { ResultSetResponse } from '../../../api/openapi/auto-generated/models/ResultSetResponse';
import type { Options4 } from '../../../api/openapi/auto-generated/models/Options4';
import type { ResultSetStatus } from '../../../api/openapi/auto-generated/models/ResultSetStatus';
import type { ResultSetResponseStatistics } from '../../../api/openapi/auto-generated/models/ResultSetResponseStatistics';
import { TestRoot } from '../../../testing/TestRoot';

const queryClient = new QueryClient();

const userContextValue = {
    canAccessKnowledgeBase: true,
    canAccessDisclosureResultSet: true,
};

describe('RenameAnalysisModal', () => {
    const portfolio = {
        id: 'p1',
        pipelines: [
            {
                perilsResultSetId: 'p',
                scoresResultSetId: 's',
                impactsResultSetId: 'e',
                meshResultSetId: 'm',
                disclosureResultSetId: 'd',
            },
        ],
        resultSets: [
            { id: 'p', name: 'Perils' },
            { id: 's', name: 'Scores' },
            { id: 'e', name: 'Impacts' },
            { id: 'm', name: 'Mesh' },
            { id: 'd', name: 'Disclosure' },
        ],
    } as IPortfolioItem;

    beforeEach(() => {
        vi.restoreAllMocks();
        queryClient.clear();
    });

    it('renders fields and enables Save when valid', async () => {
        const user = userEvent.setup();
        // Spy to mock the API client method so no real request is sent and a controlled response is returned
        const updateSpy = vi
            .spyOn(
                ResultSetsApi.prototype,
                'updateResultSetResultSetsResultSetIdPut'
            )
            .mockResolvedValue({
                options: {} as unknown as Options4,
                id: 'rs-1',
                name: 'Perils New',
                portfolio: 'p1',
                status: 'COMPLETED' as unknown as ResultSetStatus,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 'u1',
                updatedBy: 'u1',
                statistics: {} as unknown as ResultSetResponseStatistics,
            } as ResultSetResponse);

        render(
            <TestRoot userContextValue={userContextValue}>
                <RenameAnalysisModal
                    portfolio={portfolio as IPortfolioItem}
                    onClose={vi.fn()}
                />
            </TestRoot>
        );

        expect(
            screen.getByTestId('rename-analysis-modal-title')
        ).toBeInTheDocument();
        // Change one field
        const perils = screen.getByLabelText('Perils Analysis Name');
        await user.clear(perils);
        await user.type(perils, 'Perils New');

        const save = screen.getByRole('button', { name: 'Save' });
        expect(save).toBeEnabled();
        await user.click(save);

        expect(updateSpy).toHaveBeenCalled();
    });

    it('closes on Cancel if not loading', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <TestRoot userContextValue={userContextValue}>
                <RenameAnalysisModal
                    portfolio={portfolio as IPortfolioItem}
                    onClose={onClose}
                />
            </TestRoot>
        );
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onClose).toHaveBeenCalled();
    });
});
