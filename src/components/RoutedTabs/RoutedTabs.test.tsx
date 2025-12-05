import { render, screen, fireEvent } from '@testing-library/react';
import { RoutedTabs } from './RoutedTabs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock navigation to assert side-effects
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const tabs = [
    { label: 'Tab 1', route: 'tab1' },
    { label: 'Tab 2', route: 'tab2' },
];

const clickTabByLabel = (label: string) => {
    const labelEl = screen.getByText(label);
    const tabEl = labelEl.closest('[data-testid="tab-item"]') as HTMLElement;
    fireEvent.click(tabEl);
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('RoutedTabs', () => {
    it('renders with minimal props', () => {
        render(
            <MemoryRouter initialEntries={['/tab1']}>
                <RoutedTabs tabs={tabs} />
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    });

    it('calls onClickImportant first and does not navigate when disabled', () => {
        const onClickImportant = vi.fn();
        const onClick = vi.fn();
        render(
            <MemoryRouter initialEntries={['/tab1']}>
                <RoutedTabs
                    tabs={[
                        { label: 'Tab 1', route: 'tab1' },
                        {
                            label: 'Tab 2',
                            route: 'tab2',
                            disabled: true,
                            onClickImportant,
                            onClick,
                        },
                    ]}
                />
            </MemoryRouter>
        );
        clickTabByLabel('Tab 2');
        expect(onClickImportant).toHaveBeenCalledTimes(1);
        expect(onClick).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does nothing when clicking current tab (no navigate, no onClick)', () => {
        const onClick = vi.fn();
        render(
            <MemoryRouter initialEntries={['/tab2']}>
                <RoutedTabs
                    tabs={[
                        { label: 'Tab 1', route: 'tab1' },
                        { label: 'Tab 2', route: 'tab2', onClick },
                    ]}
                />
            </MemoryRouter>
        );
        clickTabByLabel('Tab 2');
        expect(onClick).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('executes onClick and does not navigate when provided', () => {
        const onClick = vi.fn();
        render(
            <MemoryRouter initialEntries={['/tab1']}>
                <RoutedTabs
                    tabs={[
                        { label: 'Tab 1', route: 'tab1' },
                        { label: 'Tab 2', route: 'tab2', onClick },
                    ]}
                />
            </MemoryRouter>
        );
        clickTabByLabel('Tab 2');
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates when clicking a different tab without onClick and not disabled/loading', () => {
        render(
            <MemoryRouter initialEntries={['/tab1']}>
                <RoutedTabs tabs={tabs} />
            </MemoryRouter>
        );
        clickTabByLabel('Tab 2');
        expect(mockNavigate).toHaveBeenCalledWith('tab2');
    });

    it('shows loading indicator and prevents navigation when isLoading is true', () => {
        render(
            <MemoryRouter initialEntries={['/tab1']}>
                <RoutedTabs
                    tabs={[
                        { label: 'Tab 1', route: 'tab1' },
                        { label: 'Tab 2', route: 'tab2', isLoading: true },
                    ]}
                />
            </MemoryRouter>
        );
        // CircularProgress should render
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        clickTabByLabel('Tab 2');
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
