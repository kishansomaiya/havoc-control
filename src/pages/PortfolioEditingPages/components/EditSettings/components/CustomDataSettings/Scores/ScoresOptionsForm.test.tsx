import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScoresOptionsForm } from './ScoresOptionsForm';
import * as formikCtx from '../../../../../../../hooks/useFormikContextHelpers';
import * as ScoresSectionFormModule from './Scores/ScoresSectionForm';

let formValues = { isScoresEnabled: true } as { isScoresEnabled: boolean };
const setFieldSpy = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation((() => ({
        get values() {
            return formValues;
        },
        setField: setFieldSpy,
    })) as unknown as typeof formikCtx.useFormikContextHelpers);
    vi.spyOn(ScoresSectionFormModule, 'ScoresSectionForm').mockImplementation(
        (() => (
            <div data-testid="scores-section-form" />
        )) as typeof ScoresSectionFormModule.ScoresSectionForm
    );
});

describe('ScoresOptionsForm', () => {
    it('renders accordion with switch and inner section when enabled', () => {
        render(<ScoresOptionsForm />);
        expect(screen.getByText('Scores')).toBeInTheDocument();
        expect(screen.getByTestId('scores-section-form')).toBeInTheDocument();
    });

    it('toggles isScoresEnabled via switch', () => {
        formValues = { isScoresEnabled: false };
        setFieldSpy.mockReset();
        render(<ScoresOptionsForm />);
        const input = screen.getByRole('checkbox', { name: 'Scores' });
        fireEvent.click(input);
        expect(setFieldSpy).toHaveBeenCalledWith('isScoresEnabled', true);
    });
});
