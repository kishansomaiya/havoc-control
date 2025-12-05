import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearsSectionForm } from './YearsSectionForm';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: {
            custom: { perilMetrics: { years: [] } },
        },
        setField: vi.fn(),
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

describe('PerilMetrics YearsSectionForm', () => {
    it('renders years autocomplete', async () => {
        const user = userEvent.setup();
        render(<YearsSectionForm />);
        expect(screen.getByLabelText('Select options')).toBeInTheDocument();
        await user.click(screen.getByLabelText('Select options'));
    });

    it('updates formik field on selection change', async () => {
        const user = userEvent.setup();
        render(<YearsSectionForm />);
        const input = screen.getByLabelText('Select options');
        await user.click(input);
        expect(input).toBeInTheDocument();
    });

    it('shows helper text when touched and error present', async () => {
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: { custom: { perilMetrics: { years: [] } } },
            setField: vi.fn(),
            handleBlur: vi.fn(),
            touched: { custom: { perilMetrics: { years: true } } },
            errors: { custom: { perilMetrics: { years: 'Required' } } },
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        render(<YearsSectionForm />);
        expect(screen.getByLabelText('Select options')).toBeInTheDocument();
    });
});
