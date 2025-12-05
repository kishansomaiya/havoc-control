import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LossTypeSelectFormControl } from './LossTypeSelectFormControl';
import { ImpactType, LossType } from '../../types';

const setFieldValue = vi.fn();

vi.mock('formik', async () => {
    return {
        useFormikContext: () => ({
            values: { lossType: undefined },
            touched: {},
            errors: {},
            handleChange: vi.fn(),
            setFieldValue,
        }),
    };
});

vi.mock('../../hooks/useLossTypeOptions', () => ({
    useLossTypeOptions: () => [{ id: LossType.Total, title: 'Total' }],
}));

describe('LossTypeSelectFormControl', () => {
    beforeEach(() => vi.clearAllMocks());

    it('sets default to first option when options exist', () => {
        render(<LossTypeSelectFormControl impactType={ImpactType.Damage} />);
        expect(setFieldValue).toHaveBeenCalledWith('lossType', LossType.Total);
        expect(
            screen.getByTestId('damage-loss-type-field-label')
        ).toHaveTextContent('Damage Type');
    });

    it('uses initialValue when no options', async () => {
        vi.doMock('../../hooks/useLossTypeOptions', () => ({
            useLossTypeOptions: () => [],
        }));
        const Comp = await import('./LossTypeSelectFormControl').then(
            (mod) => mod.LossTypeSelectFormControl
        );
        render(
            <Comp
                impactType={ImpactType.Loss}
                initialValue={LossType.Total}
            />
        );
        expect(setFieldValue).toHaveBeenCalledWith('lossType', LossType.Total);
        expect(
            screen.getByTestId('damage-loss-type-field-label')
        ).toHaveTextContent('Loss Type');
    });
});
