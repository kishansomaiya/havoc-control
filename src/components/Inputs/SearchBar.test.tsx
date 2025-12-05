import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SearchBar, SearchBarProps } from './SearchBar';
import { formatMessageTesting } from '../../localization/formatMessageTesting';
import { TestRoot } from '../../testing/TestRoot';

describe('SearchBar', () => {
    const defaultProps = {
        testId: 'test',
        value: '',
        placeholder: formatMessageTesting('search_bar.search'),
        onChange: vi.fn(),
    };
    const renderComponent = (props?: Partial<SearchBarProps>) => {
        return render(
            <SearchBar
                {...defaultProps}
                {...props}
            />,
            { wrapper: TestRoot }
        );
    };

    it('renders correctly with default props', () => {
        renderComponent();

        // Check if the search field is rendered
        const searchField = screen.getByTestId('test-search-field');
        expect(searchField).toBeInTheDocument();

        // Check if the search icon is rendered
        const searchIcon = screen.getByTestId('test-search-icon');
        expect(searchIcon).toBeInTheDocument();

        // Check if the clear icon is rendered
        const clearIcon = screen.getByTestId('test-search-clear-icon');
        expect(clearIcon).toBeInTheDocument();

        // Check if the placeholder is set correctly
        expect(
            screen.getByPlaceholderText(
                formatMessageTesting('search_bar.search')
            )
        ).toBeInTheDocument();
    });

    it('displays the provided value', () => {
        renderComponent({ value: 'test query' });

        const searchField = screen.getByTestId('test-search-field');
        const input = within(searchField).getByRole('textbox');
        expect(input).toHaveAttribute('value', 'test query');
    });

    it('calls onChange when input value changes', async () => {
        const user = userEvent.setup();
        let final = '';
        const targetString = 'new search';
        const onChange = vi.fn().mockImplementation((v: string) => {
            final += v;
        });
        renderComponent({ onChange });

        const searchField = screen.getByTestId('test-search-field');
        await user.type(searchField, targetString);

        expect(final).toEqual(targetString);
    });

    it('calls onClearIconClick when clear icon is clicked', async () => {
        const user = userEvent.setup();
        const onClearIconClick = vi.fn();
        renderComponent({ onClearIconClick: onClearIconClick });

        const clearIcon = screen.getByTestId('test-search-clear-icon');
        await user.click(clearIcon);

        expect(onClearIconClick).toHaveBeenCalledTimes(1);
    });

    it('shows error state when showError is true', () => {
        renderComponent({ showError: true });

        const searchField = screen.getByTestId('test-search-field');
        // MUI applies the error class to the root element
        const inputRoot = searchField.closest('.MuiOutlinedInput-root');

        expect(inputRoot).toHaveClass('Mui-error');
    });

    it('has correct accessibility attributes', () => {
        renderComponent();

        // Check search icon aria-label
        const searchIcon = screen.getByLabelText(
            formatMessageTesting('search_bar.search')
        );
        expect(searchIcon).toBeInTheDocument();

        // Check clear icon aria-label
        const clearIcon = screen.getByLabelText(
            formatMessageTesting('search_bar.clear')
        );
        expect(clearIcon).toBeInTheDocument();
    });

    it('applies the correct test IDs based on the testId prop', () => {
        renderComponent({ testId: 'custom' });

        expect(screen.getByTestId('custom-search-field')).toBeInTheDocument();
        expect(screen.getByTestId('custom-search-icon')).toBeInTheDocument();
        expect(
            screen.getByTestId('custom-search-clear-icon')
        ).toBeInTheDocument();
    });
});
