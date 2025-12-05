import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabSelect, TabOption, TabSelectProps, TabValue } from './Tabs';
import { vitest } from 'vitest';

const defaultOptions: TabOption[] = [
    { value: 'one', label: 'Option One' },
    { value: 'two', label: 'Option Two' },
    { value: 'three', label: 'Option Three' },
];

const renderComponent = <T extends TabValue = string>(
    props: Partial<TabSelectProps<T>> = {}
) => {
    const defaultProps: TabSelectProps<T> = {
        onChange: vitest.fn(),
        options: defaultOptions,
    };

    const mergedProps = { ...defaultProps, ...props };

    render(<TabSelect<T> {...mergedProps} />);

    // Return helpers for use in the tests
    return {
        handleChange: mergedProps.onChange,
        options: mergedProps.options,
    };
};

describe('TabSelect Component', () => {
    it('should render all tabs with correct labels', () => {
        const { options } = renderComponent({ value: 'one' });

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(options.length);

        expect(
            screen.getByRole('tab', { name: 'Option One' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('tab', { name: 'Option Two' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('tab', { name: 'Option Three' })
        ).toBeInTheDocument();
    });

    it('should have the correct tab selected based on the value prop', () => {
        renderComponent({ value: 'two' });

        const selectedTab = screen.getByRole('tab', { selected: true });
        expect(selectedTab).toHaveTextContent('Option Two');

        const unselectedTab = screen.getByRole('tab', { name: 'Option One' });
        expect(unselectedTab).toHaveAttribute('aria-selected', 'false');
    });

    it('should call onChange with the correct value when a new tab is clicked', async () => {
        const user = userEvent.setup();
        const { handleChange } = renderComponent({ value: 'one' });

        const tabToClick = screen.getByRole('tab', { name: 'Option Three' });
        await user.click(tabToClick);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith('three');
    });

    it('should handle numeric values correctly', async () => {
        const numericOptions: TabOption[] = [
            { value: 100, label: 'One Hundred' },
            { value: 200, label: 'Two Hundred' },
        ];

        const user = userEvent.setup();
        const { handleChange } = renderComponent<number>({
            value: 100,
            options: numericOptions,
        });

        const tabToClick = screen.getByRole('tab', { name: 'Two Hundred' });
        await user.click(tabToClick);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(200);
    });

    it('should render correctly with a single option', () => {
        renderComponent({
            value: 'single',
            options: [{ value: 'single', label: 'Single Option' }],
        });

        const tab = screen.getByRole('tab');
        expect(tab).toBeInTheDocument();
        expect(tab).toHaveTextContent('Single Option');
        expect(tab).toHaveAttribute('aria-selected', 'true');
    });
});
