import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormikValuesChangeListener } from './FormikValuesChangeListener';

vi.mock('../../hooks/useDebounce', () => ({
    useDebounce: (fn: (v: unknown) => void) => fn,
}));

describe('FormikValuesChangeListener', () => {
    it('calls onValuesChange with provided values (debounced)', () => {
        const onValuesChange = vi.fn();
        const values = { a: 1, b: 2 };
        render(
            <FormikValuesChangeListener
                values={values}
                onValuesChange={onValuesChange}
            />
        );
        expect(onValuesChange).toHaveBeenCalledWith(values);
    });
});
