import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricSelectFormControl } from './MetricSelectFormControl';
import type { ResultSetDataSchema } from '../../api/openapi/auto-generated';
import { Score } from '../../types';

const setFieldValue = vi.fn();

vi.mock('formik', async () => {
    return {
        useFormikContext: () => ({
            values: { metric: '' },
            touched: {},
            errors: {},
            handleChange: vi.fn(),
            setFieldValue,
        }),
    };
});

vi.mock('../../hooks/useHazardFilterOptions', () => ({
    useMetricSelectOptions: () => [
        { id: 'DEFAULT_A', enhancedName: 'Default A' },
        { id: 'METRIC_B', enhancedName: 'Metric B' },
    ],
}));

describe('MetricSelectFormControl', () => {
    beforeEach(() => vi.clearAllMocks());

    const schema: ResultSetDataSchema[] = [];
    const score = Score.Flood as Score;

    it('sets default metric (first DEFAULT_* match or first option)', () => {
        render(
            <MetricSelectFormControl
                resultSetSchema={schema}
                score={score}
            />
        );
        expect(setFieldValue).toHaveBeenCalledWith('metric', 'DEFAULT_A');
    });

    it('uses initialValue when options empty', async () => {
        await vi.resetModules();
        vi.doMock('../../hooks/useHazardFilterOptions', () => ({
            useMetricSelectOptions: () => [],
        }));
        const Comp = await import('./MetricSelectFormControl').then(
            (mod) => mod.MetricSelectFormControl
        );
        render(
            <Comp
                resultSetSchema={schema}
                score={score}
                initialValue={'FALLBACK'}
            />
        );
        expect(setFieldValue).toHaveBeenCalledWith('metric', 'FALLBACK');
    });
});
