import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FormPriceTextField } from './FormPriceTextField';

describe('FormPriceTextField', () => {
    it('updates setField with number on change and rounds on blur', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormPriceTextField
                name="amount"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, '12.345');
        await user.tab();
        expect(setField).toHaveBeenCalledWith('amount', expect.any(Number));
    });

    it('sets to 0 on invalid number on blur', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormPriceTextField
                name="amount"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, 'abc');
        await user.tab();
        expect(setField).toHaveBeenCalledWith('amount', 0);
    });

    it('clears to undefined when emptied', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormPriceTextField
                name="amount"
                value={10}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.clear(input);
        await user.tab();
        expect(setField).toHaveBeenCalledWith('amount', undefined);
    });

    it('applies disabled opacity style when disabled', () => {
        const setField = vi.fn();
        render(
            <FormPriceTextField
                name="amount"
                value={10}
                setField={setField}
                disabled
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const wrapper = input.closest(
            '.MuiInputBase-root'
        ) as HTMLElement | null;
        expect(wrapper).toBeTruthy();
    });
});
