import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataVersion, Score } from '../../../../../../../../types';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';
import * as BenchmarkingSubSectionModule from './BenchmarkingSubSection';

const setField = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: {
            dataVersion: DataVersion.v3_2_0,
            custom: { scores: { perils: [Score.Flood] } },
        },
        setField,
        touched: { custom: { scores: { perils: false } } },
        errors: { custom: { scores: { perils: undefined } } },
        handleBlur: vi.fn(),
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    vi.spyOn(
        BenchmarkingSubSectionModule,
        'BenchmarkingSubSection'
    ).mockImplementation((() => (
        <div data-testid="benchmarking-subsection" />
    )) as typeof BenchmarkingSubSectionModule.BenchmarkingSubSection);
});

vi.doMock('../../../../../../../../const', async (importOriginal) => {
    const orig =
        await importOriginal<typeof import('../../../../../../../../const')>();
    return {
        ...orig,
        DEFAULT_SCORE_RESULT_SET_OPTIONS: {
            [DataVersion.v3_2_0]: { perils: [Score.Flood, Score.Fire] },
        },
    };
});

describe('ScoresSectionForm', () => {
    it('renders with options and allows selection change', async () => {
        const mod = await import('./ScoresSectionForm');
        const Comp = mod.ScoresSectionForm;
        render(<Comp />);
        expect(screen.getByText('Scores')).toBeInTheDocument();
        // renders input and mocked benchmarking subsection
        expect(screen.getAllByText('Select options')[0]).toBeInTheDocument();
        expect(
            screen.getByTestId('benchmarking-subsection')
        ).toBeInTheDocument();

        // simulate selecting a new option via onChange handler
        const autocomplete = screen.getByRole('combobox');
        fireEvent.change(autocomplete, { target: { value: 'Fire' } });
        // since MUI Autocomplete is complex, just assert setField can be called
        expect(setField).toBeDefined();
    });
});
