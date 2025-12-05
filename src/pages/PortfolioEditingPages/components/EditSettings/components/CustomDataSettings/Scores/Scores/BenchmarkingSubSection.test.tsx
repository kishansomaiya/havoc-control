import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BenchmarkingSubSection } from './BenchmarkingSubSection';
import { BenchmarkLevel } from '../../../../../../../../types';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

const setField = vi.fn();
let mockScores = {
    includeBenchmarks: true,
    benchmarkLevels: [BenchmarkLevel.Country] as BenchmarkLevel[],
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation((() => ({
        get values() {
            return {
                custom: { scores: mockScores },
            };
        },
        errors: { custom: { scores: {} } },
        setField,
    })) as unknown as typeof formikCtx.useFormikContextHelpers);
});

describe('BenchmarkingSubSection', () => {
    it('renders include checkbox and options when enabled', () => {
        render(<BenchmarkingSubSection />);
        expect(screen.getByText('Include Benchmarking')).toBeInTheDocument();
        expect(screen.getByText('Benchmarking Options')).toBeInTheDocument();
        expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('toggles include and level checkboxes', () => {
        render(<BenchmarkingSubSection />);
        const include = screen.getByRole('checkbox', {
            name: 'Include Benchmarking',
        });
        fireEvent.click(include);
        expect(setField).toHaveBeenCalledWith(
            'custom.scores.includeBenchmarks',
            false
        );

        const anyLevel = screen.getAllByRole('checkbox')[1];
        fireEvent.click(anyLevel);
        expect(setField).toHaveBeenCalled();
    });

    it('selects all levels when Select All checked', () => {
        mockScores = {
            includeBenchmarks: true,
            benchmarkLevels: [],
        } as typeof mockScores;
        setField.mockClear();
        render(<BenchmarkingSubSection />);
        const selectAll = screen.getByRole('checkbox', { name: 'Select All' });
        fireEvent.click(selectAll);
        expect(setField).toHaveBeenCalledWith('custom.scores.benchmarkLevels', [
            BenchmarkLevel.Country,
            BenchmarkLevel.Admin1,
            BenchmarkLevel.Admin2,
        ]);
    });
});
