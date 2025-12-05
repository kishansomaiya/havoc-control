import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as DashboardFilterProvider from '../../../context/DashboardFilterProvider';
import { DashboardFilters } from './DashboardFilters';
import * as CustomDropDownModule from '../../../components/CustomDropDown/CustomDropDown';

interface MockOption {
    name: string;
    value: string;
    selected?: boolean;
}

interface MockDashboardFilter {
    countryCodeISO2A?: MockOption[];
    admin1Code?: MockOption[];
    occupancyName?: MockOption[];
    entity?: MockOption[];
}

const mockUpdate = vi.fn();

const mockContextState: {
    filterData: MockDashboardFilter;
    isResultSetFiltersLoading: boolean;
} = {
    filterData: {
        countryCodeISO2A: [
            { name: 'US', value: 'US', selected: false },
            { name: 'DE', value: 'DE', selected: false },
        ],
        admin1Code: [{ name: 'CA', value: 'CA', selected: false }],
        occupancyName: [{ name: 'Office', value: 'office', selected: false }],
        entity: [{ name: 'Entity1', value: 'e1', selected: false }],
    },
    isResultSetFiltersLoading: false,
};

type MockCustomDropDownProps = {
    label: string;
    checkable?: boolean;
    showCountBadge?: boolean;
    options?: MockOption[];
    loading?: boolean;
    onApplySelectionChange?: (options: MockOption[]) => void;
    onClearSelectionChange?: () => void;
};

vi.spyOn(CustomDropDownModule, 'CustomDropDown').mockImplementation(
    (props: MockCustomDropDownProps) => (
        <div>
            <div data-testid={`dropdown-label-${props.label}`}>
                {props.label}
            </div>
            <div data-testid={`len-${props.label}`}>
                {props.options?.length ?? 0}
            </div>
            <div data-testid={`loading-${props.label}`}>
                {String(Boolean(props.loading))}
            </div>
            <button
                data-testid={`apply-${props.label}`}
                onClick={() =>
                    props.onApplySelectionChange?.([
                        { name: 'X', value: 'x', selected: true },
                        { name: 'Y', value: 'y', selected: false },
                        // include one without selected to hit default false branch
                        { name: 'Z', value: 'z' },
                    ])
                }
            />
            <button
                data-testid={`clear-${props.label}`}
                onClick={() => props.onClearSelectionChange?.()}
            />
        </div>
    )
);

vi.spyOn(
    DashboardFilterProvider,
    'useDashboardFilterContext'
).mockImplementation(
    () =>
        ({
            filterData: mockContextState.filterData,
            isResultSetFiltersLoading:
                mockContextState.isResultSetFiltersLoading,
        }) as ReturnType<
            typeof DashboardFilterProvider.useDashboardFilterContext
        >
);
vi.spyOn(
    DashboardFilterProvider,
    'useDashboardFilterContextUpdate'
).mockReturnValue(
    mockUpdate as ReturnType<
        typeof DashboardFilterProvider.useDashboardFilterContextUpdate
    >
);

beforeEach(() => {
    mockUpdate.mockClear();
    // reset to defaults before each test
    mockContextState.filterData = {
        countryCodeISO2A: [
            { name: 'US', value: 'US', selected: false },
            { name: 'DE', value: 'DE', selected: false },
        ],
        admin1Code: [{ name: 'CA', value: 'CA', selected: false }],
        occupancyName: [{ name: 'Office', value: 'office', selected: false }],
        entity: [{ name: 'Entity1', value: 'e1', selected: false }],
    };
    mockContextState.isResultSetFiltersLoading = false;
});

describe('DashboardFilters', () => {
    it('renders dropdown labels and triggers apply/clear updates', async () => {
        const user = userEvent.setup();
        render(<DashboardFilters />);

        expect(
            screen.getByTestId('dropdown-label-Country')
        ).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-label-State')).toBeInTheDocument();
        expect(
            screen.getByTestId('dropdown-label-Occupancy Name')
        ).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-label-Entity')).toBeInTheDocument();

        await user.click(screen.getByTestId('apply-Country'));
        expect(mockUpdate).toHaveBeenCalled();

        await user.click(screen.getByTestId('clear-State'));
        expect(mockUpdate).toHaveBeenCalled();
    });

    it('does not update when filter key is missing (early return branch)', async () => {
        const user = userEvent.setup();
        // remove a key to exercise the early return paths
        mockContextState.filterData = {
            countryCodeISO2A: [{ name: 'US', value: 'US' }],
            admin1Code: [{ name: 'CA', value: 'CA' }],
            occupancyName: [{ name: 'Office', value: 'office' }],
            // entity intentionally omitted
        };
        render(<DashboardFilters />);

        await user.click(screen.getByTestId('apply-Entity'));
        await user.click(screen.getByTestId('clear-Entity'));
        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('propagates loading flag to dropdowns', async () => {
        mockContextState.isResultSetFiltersLoading = true;
        render(<DashboardFilters />);

        expect(screen.getByTestId('loading-Country').textContent).toBe('true');
        expect(screen.getByTestId('loading-State').textContent).toBe('true');
        expect(screen.getByTestId('loading-Occupancy Name').textContent).toBe(
            'true'
        );
        expect(screen.getByTestId('loading-Entity').textContent).toBe('true');
    });

    it('updates internal state when filterData changes (useEffect coverage)', async () => {
        const user = userEvent.setup();
        const { rerender } = render(<DashboardFilters />);

        expect(screen.getByTestId('len-Country').textContent).toBe('2');
        expect(screen.getByTestId('len-State').textContent).toBe('1');

        mockContextState.filterData = {
            ...mockContextState.filterData,
            countryCodeISO2A: [
                { name: 'US', value: 'US' },
                { name: 'DE', value: 'DE' },
                { name: 'FR', value: 'FR' },
            ],
            admin1Code: [
                { name: 'CA', value: 'CA' },
                { name: 'NY', value: 'NY' },
            ],
        };

        rerender(<DashboardFilters />);

        // after rerender, the effect syncs local state to new filterData
        expect(screen.getByTestId('len-Country').textContent).toBe('3');
        expect(screen.getByTestId('len-State').textContent).toBe('2');

        // also ensure apply still works with new data
        await user.click(screen.getByTestId('apply-State'));
        expect(mockUpdate).toHaveBeenCalled();
    });
});
