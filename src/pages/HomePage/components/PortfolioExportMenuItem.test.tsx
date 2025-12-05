import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioExportMenuItem } from './PortfolioExportMenuItem';
import { ResultSetStatus } from '../../../types';
import {
    ResultSetResponse,
    ResultSetType,
} from '../../../api/openapi/auto-generated';
import * as utils from '../../../utils';

describe('PortfolioExportMenuItem', () => {
    const baseResultSet: ResultSetResponse = {
        id: 'rs-1',
        status: ResultSetStatus.Completed,
        options: {
            type: 'scores' as unknown as ResultSetType,
        } as unknown as ResultSetResponse['options'],
        portfolio: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'u1',
        updatedBy: 'u1',
        name: 'RS',
        type: 'scores' as unknown as ResultSetResponse['type'],
        statistics: {
            numberOfLocations: 0,
            numberOfRows: 0,
        },
    };

    const handleExport = vi
        .fn()
        .mockResolvedValue([
            { url: 'https://x/file.csv', filename: 'file.csv' },
        ]);

    beforeEach(() => {
        handleExport.mockClear();
    });

    it('is disabled when no resultSet', () => {
        render(
            <PortfolioExportMenuItem
                title="Perils"
                isStandard
                handleExport={handleExport}
            />
        );
        expect(
            screen.getByTestId('portfolio-details-export-menu-item')
        ).toHaveAttribute('aria-disabled', 'true');
    });

    it('is disabled when resultSet is not completed', () => {
        render(
            <PortfolioExportMenuItem
                resultSet={{
                    ...baseResultSet,
                    status: ResultSetStatus.Pending,
                }}
                title="Perils"
                isStandard
                handleExport={handleExport}
            />
        );
        expect(
            screen.getByTestId('portfolio-details-export-menu-item')
        ).toHaveAttribute('aria-disabled', 'true');
    });

    it('calls handleExport and downloads files on click', async () => {
        const user = userEvent.setup();
        // Spy to assert that a download is initiated instead of performing an actual browser download
        const downloadFile = vi.spyOn(utils, 'downloadFile');
        render(
            <PortfolioExportMenuItem
                resultSet={baseResultSet}
                title="Perils"
                isStandard
                handleExport={handleExport}
            />
        );
        const item = screen.getByTestId('portfolio-details-export-menu-item');
        await user.click(item);
        expect(handleExport).toHaveBeenCalledWith('rs-1', true);
        expect(downloadFile).toHaveBeenCalledWith(
            'https://x/file.csv',
            'file.csv'
        );
    });

    it('hides itself when isHidden', () => {
        render(
            <PortfolioExportMenuItem
                resultSet={baseResultSet}
                title="Hidden"
                isStandard
                handleExport={handleExport}
                isHidden
            />
        );
        expect(
            screen.queryByTestId('portfolio-details-export-menu-item')
        ).not.toBeInTheDocument();
    });
});
