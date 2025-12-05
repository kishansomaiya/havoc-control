import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FormIntegerTextField } from './FormIntegerTextField';

describe('FormIntegerTextField', () => {
    it('initializes from value and updates setField on change with integer', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormIntegerTextField
                name="qty"
                value={3}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('3');
        await user.clear(input);
        await user.type(input, '42');
        expect(setField).toHaveBeenCalledWith('qty', 42);
    });

    it('clears field when emptied', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormIntegerTextField
                name="qty"
                value={5}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.clear(input);
        expect(setField).toHaveBeenCalledWith('qty', undefined);
    });

    it('prettifies on blur and coerces invalid to 0', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormIntegerTextField
                name="qty"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, 'abc');
        await user.tab();
        expect(setField).toHaveBeenCalledWith('qty', 0);
    });

    it('keeps integer floor and updates when decimal typed', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormIntegerTextField
                name="qty"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, '5.9');
        expect(setField).toHaveBeenCalledWith('qty', 5);
        await user.tab();
        expect(setField).toHaveBeenCalledWith('qty', 5);
    });
});
