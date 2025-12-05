import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BenchmarkLevelSelectFormControl } from './BenchmarkLevelSelectFormControl';
import type { ScoresResultSetOptions } from '../../api/openapi/auto-generated';
import { BenchmarkLevel } from 'types/benchmarlLevel';

const setFieldValue = vi.fn();
const handleChange = vi.fn();

vi.mock('formik', async () => {
    return {
        useFormikContext: () => ({
            values: { benchmarkLevel: '' },
            touched: {},
            errors: {},
            handleChange,
            setFieldValue,
        }),
    };
});

vi.mock('../../hooks/useBenchmarkLevelOptions', () => ({
    useBenchmarkLevelOptions: () => [
        { id: 10, title: 'Option A' },
        { id: 20, title: 'Option B' },
    ],
}));

describe('BenchmarkLevelSelectFormControl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const resultSetOptions = {} as ScoresResultSetOptions;

    it('sets default to first option when options exist', () => {
        render(
            <BenchmarkLevelSelectFormControl
                resultSetOptions={resultSetOptions}
            />
        );
        expect(setFieldValue).toHaveBeenCalledWith('benchmarkLevel', 10);
        expect(screen.getByTestId('benchmark-field-label')).toHaveTextContent(
            'Score type'
        );
    });

    it('respects provided initialValue when options array still provides falsy first', async () => {
        vi.doMock('../../hooks/useBenchmarkLevelOptions', () => ({
            useBenchmarkLevelOptions: () => [
                { id: 0 as unknown as number, title: 'Zero' },
                { id: 20, title: 'Option B' },
            ],
        }));
        const Comp = await import('./BenchmarkLevelSelectFormControl').then(
            (m) => m.BenchmarkLevelSelectFormControl
        );
        render(
            <Comp
                resultSetOptions={{} as ScoresResultSetOptions}
                initialValue={10 as unknown as BenchmarkLevel}
            />
        );
        // Since id 0 is falsy, component falls back to initialValue
        expect(setFieldValue).toHaveBeenCalledWith('benchmarkLevel', 10);
    });
});
