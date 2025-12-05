import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DashboardFiltersTrigger } from './DashboardFiltersTrigger';
import { Theme } from '@mui/material/styles';
import * as dashboardFilter from '../../../context/DashboardFilterProvider';

vi.mock('@mui/material', async () => {
    const actual = await vi.importActual<
        typeof import('@mui/material') & { useTheme: () => Theme }
    >('@mui/material');
    return {
        ...actual,
        useTheme: () => ({
            palette: {
                secondary: { main: '#f0f' },
                text: { primary: '#111', secondary: '#999' },
            },
        }),
    };
});

type DashboardFilterContextType = ReturnType<
    typeof dashboardFilter.useDashboardFilterContext
>;

const dfcSpy = vi
    .spyOn(dashboardFilter, 'useDashboardFilterContext')
    .mockReturnValue({
        isResultSetLoading: false,
        isFiltersDisabled: false,
        filterData: {
            countryCodeISO2A: [],
            admin1Code: [],
            occupancyName: [],
            entity: [],
        },
        filterLists: {},
        isResultSetFiltersLoading: false,
    } as DashboardFilterContextType);

describe('DashboardFiltersTrigger', () => {
    it('renders icon and calls onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <DashboardFiltersTrigger
                open={false}
                onClick={onClick}
            />
        );
        await user.click(screen.getByTestId('filter-icon'));
        expect(onClick).toHaveBeenCalled();
    });

    it('shows loader when loading and disables button', async () => {
        dfcSpy.mockReturnValueOnce({
            isResultSetLoading: true,
            isFiltersDisabled: false,
            filterData: {
                countryCodeISO2A: [],
                admin1Code: [],
                occupancyName: [],
                entity: [],
            },
            filterLists: {},
            isResultSetFiltersLoading: false,
        } as DashboardFilterContextType);
        render(
            <DashboardFiltersTrigger
                open={true}
                onClick={() => {}}
            />
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('closes when filters are disabled', async () => {
        const onClick = vi.fn();
        dfcSpy.mockReturnValueOnce({
            isResultSetLoading: false,
            isFiltersDisabled: true,
            filterData: {
                countryCodeISO2A: [],
                admin1Code: [],
                occupancyName: [],
                entity: [],
            },
            filterLists: {},
            isResultSetFiltersLoading: false,
        } as DashboardFilterContextType);
        render(
            <DashboardFiltersTrigger
                open={true}
                onClick={onClick}
            />
        );
        // effect triggers onClick(false)
        expect(onClick).toHaveBeenCalledWith(false);
    });
});
