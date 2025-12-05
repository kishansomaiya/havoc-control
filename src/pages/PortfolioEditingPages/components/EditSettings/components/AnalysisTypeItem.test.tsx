import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AnalysisTypeItem } from './AnalysisTypeItem';
import { AnalysisType } from '../../../types/analysisTypeEnum';

describe('AnalysisTypeItem', () => {
    it('renders and selects when enabled', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <AnalysisTypeItem
                type={AnalysisType.Custom}
                isSelected={false}
                handleSelect={onSelect}
                title="Custom"
                description="desc"
            />
        );
        expect(screen.getByText('Custom')).toBeInTheDocument();
        await user.click(screen.getByTestId('analysis-type'));
        expect(onSelect).toHaveBeenCalledWith(AnalysisType.Custom);
    });

    it('does not select when disabled', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(
            <AnalysisTypeItem
                type={AnalysisType.PerilsAndScores}
                isSelected={true}
                handleSelect={onSelect}
                title="Default"
                description="desc"
                disabled
            />
        );
        await user.click(screen.getByTestId('analysis-type'));
        expect(onSelect).not.toHaveBeenCalled();
        // radio checked state is visible via aria-checked on the input role
        expect(screen.getByRole('radio', { name: 'Default' })).toBeChecked();
    });
});
