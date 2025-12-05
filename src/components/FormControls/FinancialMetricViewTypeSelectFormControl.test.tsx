import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinancialMetricViewTypeSelectFormControl } from './FinancialMetricViewTypeSelectFormControl';
import { FinancialMetricViewType } from '../../types';

const setFieldValue = vi.fn();

vi.mock('formik', async () => {
    return {
        useFormikContext: () => ({
            values: { viewType: undefined },
            touched: {},
            errors: {},
            handleChange: vi.fn(),
            setFieldValue,
        }),
    };
});

vi.mock('../../hooks/useFinancialMetricViewTypeOptions', () => ({
    useFinancialMetricViewTypeOptions: () => [
        {
            id: FinancialMetricViewType.TransmissionChannel,
            title: 'Transmission',
        },
        {
            id: FinancialMetricViewType.OperationalRisk,
            title: 'Operational Risk',
        },
        {
            id: FinancialMetricViewType.TechnicalPremium,
            title: 'Technical Premium',
        },
        { id: FinancialMetricViewType.MarketRisk, title: 'Market Risk' },
    ],
}));

describe('FinancialMetricViewTypeSelectFormControl', () => {
    beforeEach(() => vi.clearAllMocks());

    it('sets default to first option when options exist', () => {
        render(<FinancialMetricViewTypeSelectFormControl />);
        expect(setFieldValue).toHaveBeenCalledWith(
            'viewType',
            FinancialMetricViewType.TransmissionChannel
        );
    });

    it('uses initialValue when no options available', async () => {
        vi.doMock('../../hooks/useFinancialMetricViewTypeOptions', () => ({
            useFinancialMetricViewTypeOptions: () => [],
        }));
        const Comp = await import(
            './FinancialMetricViewTypeSelectFormControl'
        ).then((mod) => mod.FinancialMetricViewTypeSelectFormControl);
        render(
            <Comp initialValue={FinancialMetricViewType.TransmissionChannel} />
        );
        expect(setFieldValue).toHaveBeenCalledWith(
            'viewType',
            FinancialMetricViewType.TransmissionChannel
        );
    });

    it('sets error prop when touched and has errors', async () => {
        vi.doMock('formik', async () => {
            return {
                useFormikContext: () => ({
                    values: { viewType: undefined },
                    touched: { viewType: true },
                    errors: { viewType: 'Required' },
                    handleChange: vi.fn(),
                    setFieldValue,
                }),
            };
        });
        const Comp = await import(
            './FinancialMetricViewTypeSelectFormControl'
        ).then((mod) => mod.FinancialMetricViewTypeSelectFormControl);
        const { container } = render(<Comp />);
        const select = container.querySelector(
            '[data-testid="view-by-field-select"] .MuiOutlinedInput-notchedOutline'
        );
        expect(select).toBeTruthy();
    });
});
