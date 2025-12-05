import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RunAnalysisOption } from './RunAnalysisOption';

describe('RunDisclosureAnalysis', () => {
    it('renders title/description and toggles via container click', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <RunAnalysisOption
                isSelected={false}
                onChange={onChange}
                title="Run Disclosure Analysis"
                description="Details"
                testId="run-disclosure-analysis"
            />
        );
        expect(
            screen.getByTestId('run-disclosure-analysis-title')
        ).toHaveTextContent('Run Disclosure Analysis');
        expect(
            screen.getByTestId('run-disclosure-analysis-description')
        ).toHaveTextContent('Details');
        await user.click(screen.getByTestId('run-disclosure-analysis'));
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('disabled prevents toggle', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <RunAnalysisOption
                isSelected={false}
                onChange={onChange}
                title="Run"
                description="Desc"
                disabled
                testId="run-disclosure-analysis"
            />
        );
        await user.click(screen.getByTestId('run-disclosure-analysis'));
        expect(onChange).not.toHaveBeenCalled();
    });
});

describe('RunDisclosureAnalysis', () => {
    it('renders label and toggles when enabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <RunAnalysisOption
                isSelected={false}
                onChange={onChange}
                title="Run Disclosure Analysis"
                description="desc"
                testId="run-disclosure-analysis"
            />
        );
        await user.click(screen.getByTestId('run-disclosure-analysis'));
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <RunAnalysisOption
                isSelected={true}
                onChange={onChange}
                title="Run Disclosure Analysis"
                description="desc"
                disabled
                testId="run-disclosure-analysis"
            />
        );
        await user.click(screen.getByTestId('run-disclosure-analysis'));
        expect(onChange).not.toHaveBeenCalled();
    });
});
