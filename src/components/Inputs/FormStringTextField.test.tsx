import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FormStringTextField } from './FormStringTextField';

describe('FormStringTextField', () => {
    it('renders with empty string when value is undefined and updates setField', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormStringTextField
                name="name"
                value={undefined}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('');
        await user.type(input, 'abc');
        expect(setField).toHaveBeenCalledWith('name', 'a');
        expect(setField).toHaveBeenCalledWith('name', 'b');
        expect(setField).toHaveBeenCalledWith('name', 'c');
    });

    it('does nothing when name is missing', async () => {
        const user = userEvent.setup();
        const setField = vi.fn();
        render(
            <FormStringTextField
                value={''}
                setField={setField}
            />
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await user.type(input, 'x');
        expect(setField).not.toHaveBeenCalled();
    });
});
