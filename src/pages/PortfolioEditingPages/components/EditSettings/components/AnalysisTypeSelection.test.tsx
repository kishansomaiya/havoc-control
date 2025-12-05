import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalysisTypeSelection } from './AnalysisTypeSelection';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import { IPortfolio } from '../../../types/portfolio';
import { ComponentProps } from 'react';
import { AnalysisTypeItem } from './AnalysisTypeItem';
import * as formikCtx from '../../../../../hooks/useFormikContextHelpers';
import * as AnalysisTypeItemModule from './AnalysisTypeItem';

let mockValues: { values: IPortfolio };
beforeEach(() => {
    mockValues = {
        values: {
            name: 'My Portfolio',
        } as IPortfolio,
    };
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation(
        () =>
            mockValues as unknown as ReturnType<
                typeof formikCtx.useFormikContextHelpers
            >
    );
    vi.spyOn(AnalysisTypeItemModule, 'AnalysisTypeItem').mockImplementation(
        (props: ComponentProps<typeof AnalysisTypeItem>) => (
            <button
                data-testid={`type-${props.type}`}
                disabled={props.disabled}
                onClick={() => {
                    if (!props.disabled) {
                        props.handleSelect(props.type);
                    }
                }}
            >
                {props.title}
            </button>
        )
    );
});

describe('AnalysisTypeSelection', () => {
    it('renders label and change type option checkbox', async () => {
        const user = userEvent.setup();
        const onTypeChange = vi.fn();
        const onChangeTypeChange = vi.fn();
        render(
            <AnalysisTypeSelection
                type={AnalysisType.PerilsAndScores}
                onTypeChange={onTypeChange}
                showChangeTypeOption
                changeType={false}
                onChangeTypeChange={onChangeTypeChange}
            />
        );
        expect(screen.getByTestId('analysis-type-label')).toBeInTheDocument();
        const checkbox = screen.getByTestId('change-analysis-type-checkbox');
        await user.click(checkbox);
        expect(onChangeTypeChange).toHaveBeenCalledWith(true);
    });

    it('disables Custom when runDisclosureAnalysis is true', () => {
        mockValues = {
            values: {
                name: 'My Portfolio',
                runDisclosureAnalysis: true,
            } as IPortfolio,
        };
        render(
            <AnalysisTypeSelection
                type={AnalysisType.PerilsAndScores}
                onTypeChange={vi.fn()}
                showChangeTypeOption={false}
                changeType={false}
                onChangeTypeChange={vi.fn()}
            />
        );
        expect(
            screen.getByTestId(`type-${AnalysisType.Custom}`)
        ).toBeDisabled();
    });

    it('disables items when changeType is false', () => {
        render(
            <AnalysisTypeSelection
                type={AnalysisType.PerilsAndScores}
                onTypeChange={vi.fn()}
                showChangeTypeOption
                changeType={false}
                onChangeTypeChange={vi.fn()}
            />
        );
        expect(
            screen.getByTestId(`type-${AnalysisType.PerilsAndScores}`)
        ).toBeDisabled();
        expect(
            screen.getByTestId(
                `type-${AnalysisType.PerilsScoresAndEconomicImpact}`
            )
        ).toBeDisabled();
        expect(
            screen.getByTestId(`type-${AnalysisType.Custom}`)
        ).toBeDisabled();
    });
});
