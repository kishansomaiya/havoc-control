import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UsageTracking } from './UsageTracking';
import * as usageQuery from '../../../api/queries/usageQuery';
import * as usageMutation from '../../../api/mutations/useUsageMutation';

let mockUserLoading = false;
let mockTenantLoading = false;

vi.spyOn(usageQuery, 'useUserUsageQuery').mockImplementation(
    () =>
        ({
            data: { totalPortfolios: 2, totalUniqueLocations: 5 },
            isLoading: mockUserLoading,
        }) as unknown as ReturnType<typeof usageQuery.useUserUsageQuery>
);
vi.spyOn(usageQuery, 'useTenantUsageQuery').mockImplementation(
    () =>
        ({
            data: { totalPortfolios: 10, totalUniqueLocations: 50 },
            isLoading: mockTenantLoading,
        }) as unknown as ReturnType<typeof usageQuery.useTenantUsageQuery>
);

vi.spyOn(usageMutation, 'useTenantUserReportMutation').mockReturnValue({
    mutate: vi.fn(),
} as unknown as ReturnType<typeof usageMutation.useTenantUserReportMutation>);

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({
        user: {
            'custom:jupiter-tenant-id': 't1',
            'custom:jupiter-user-id': 'u1',
        },
    }),
}));

describe('UsageTracking', () => {
    it('renders stats and triggers download', async () => {
        const user = userEvent.setup();
        render(<UsageTracking />);
        expect(screen.getByText('Usage')).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('Your Organization')).toBeInTheDocument();
        await user.click(
            screen.getByRole('button', { name: /Download Report/i })
        );
    });

    it('shows spinner and disables download while both queries loading', () => {
        mockUserLoading = true;
        mockTenantLoading = true;
        render(<UsageTracking />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Download Report/i })
        ).toBeDisabled();
        mockUserLoading = false;
        mockTenantLoading = false;
    });

    it('renders table when only one query is loading (AND branch false)', () => {
        mockUserLoading = true;
        mockTenantLoading = false;
        render(<UsageTracking />);
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        mockUserLoading = false;
    });
});
