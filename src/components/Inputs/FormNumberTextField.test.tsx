import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FormNumberTextField } from './FormNumberTextField';

describe('FormNumberTextField', () => {
    it('updates setField with numeric value as typed', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormNumberTextField
                name="price"
                value={1.5}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('1.5');
        await user.clear(input);
        await user.type(input, '2.75');
        expect(setField).toHaveBeenCalledWith('price', 2.75);
    });

    it('clears field to undefined when emptied', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormNumberTextField
                name="price"
                value={3}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.clear(input);
        expect(setField).toHaveBeenCalledWith('price', undefined);
    });

    it('prettifies on blur and resets to numeric value', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormNumberTextField
                name="price"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, '2.2');
        await user.tab();
        expect(setField).toHaveBeenCalledWith('price', 2.2);
    });

    it('coerces invalid to 0 on blur when invalid number', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormNumberTextField
                name="price"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, 'abc');
        await user.tab();
        expect(setField).toHaveBeenCalledWith('price', 0);
    });
});
