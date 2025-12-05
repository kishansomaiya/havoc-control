import { act, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
    ComplianceDataSettingsProvider,
    useComplianceCategories,
    useUpdateComplianceCategories,
    useComplianceEUMetrics,
    useUpdateComplianceEUMetrics,
} from './ComplienceDataSettingsContext';
import { DisclosureCategory } from '../../../../api/openapi/auto-generated';

const Consumer = () => {
    const categories = useComplianceCategories();
    const setCategories = useUpdateComplianceCategories();
    const euMetrics = useComplianceEUMetrics();
    const setEUMetrics = useUpdateComplianceEUMetrics();

    return (
        <div>
            <div data-testid="cats">{categories.join(',')}</div>
            <div data-testid="metrics">{euMetrics.join(',')}</div>
            <button
                onClick={() =>
                    setCategories([
                        DisclosureCategory.temperature,
                        DisclosureCategory.water,
                    ])
                }
            >
                set-cats
            </button>
            <button onClick={() => setEUMetrics(['m1', 'm2'])}>
                set-metrics
            </button>
        </div>
    );
};

describe('ComplienceDataSettingsContext', () => {
    it('provides defaults and allows updates', async () => {
        localStorage.clear();
        render(
            <ComplianceDataSettingsProvider>
                <Consumer />
            </ComplianceDataSettingsProvider>
        );

        expect(screen.getByTestId('cats').textContent?.length).toBeGreaterThan(
            0
        );
        expect(screen.getByTestId('metrics').textContent).toBe('');

        await act(async () => {
            screen.getByText('set-cats').click();
            screen.getByText('set-metrics').click();
        });

        expect(screen.getByTestId('cats').textContent).toContain('temperature');
        expect(screen.getByTestId('metrics').textContent).toBe('m1,m2');
    });
});
