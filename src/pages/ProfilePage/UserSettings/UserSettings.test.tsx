import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserSettings } from './UserSettings';
import * as usersQuery from '../../../api/queries/usersQuery';
import * as UsageTrackingModule from '../UsageTracking/UsageTracking';
import * as ClientCredsModule from '../ClientCredsSettings/ClientCredsSettings';
import * as utils from '../../../utils';
import * as featureFlags from '../../../featureFlags/useFeatureFlags';

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({
        user: { name: 'Test User', email: 'test@example.com' },
    }),
}));

let mockUserPermissions: unknown[] = [];
vi.spyOn(usersQuery, 'useGetUserPermissionsQuery').mockImplementation(
    () =>
        ({
            userPermissions: mockUserPermissions,
        }) as ReturnType<typeof usersQuery.useGetUserPermissionsQuery>
);

let usageVisible = true;
vi.spyOn(UsageTrackingModule, 'UsageTracking').mockImplementation(() =>
    usageVisible ? <div>Usage</div> : null
);

vi.spyOn(ClientCredsModule, 'ClientCredsGrid').mockImplementation(() => (
    <div data-testid="client-creds-grid" />
));

vi.spyOn(utils, 'checkIfUserIsPortfolioCreator').mockReturnValue(true);
vi.spyOn(utils, 'checkIsUserCanAccessEI_3_1_1').mockReturnValue(true);
vi.spyOn(featureFlags, 'useFeatureFlags').mockReturnValue({
    data330Enabled: false,
} as ReturnType<typeof featureFlags.useFeatureFlags>);

describe('UserSettings', () => {
    it('renders primary information and usage tracking when user is creator', () => {
        mockUserPermissions = [{}];
        render(<UserSettings />);
        expect(screen.getByText(/Primary Information/i)).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText(/^Version$/)).toBeInTheDocument();
        expect(screen.getByText('Usage')).toBeInTheDocument();
        // When EI_3_1_1 is accessible (default true), supported EI versions should include 3.1.1
        expect(
            screen.getByText('3.0.0, 3.1.0, 3.1.1, 3.2.0')
        ).toBeInTheDocument();
    });

    it('hides usage tracking when user is not creator and shows non-3.1.1 EI versions', () => {
        mockUserPermissions = [];
        // Drive component branch via the utility returning false
        vi.spyOn(utils, 'checkIfUserIsPortfolioCreator').mockReturnValue(false);
        // And ensure EI_3_1_1 access is false to hit the other EI branch
        vi.spyOn(utils, 'checkIsUserCanAccessEI_3_1_1').mockReturnValue(false);
        usageVisible = false; // UsageTracking stub renders null
        render(<UserSettings />);
        expect(screen.queryByText('Usage')).not.toBeInTheDocument();
        // Economic Impact Version should NOT include 3.1.1 in this branch
        expect(
            screen.getByText('3.0.0, 3.1.0, 3.1.2, 3.2.0')
        ).toBeInTheDocument();
        usageVisible = true;
    });

    it('uses 3.3.0 versions when data330Enabled is true', () => {
        mockUserPermissions = [{}];
        // Toggle feature flag branch on
        vi.spyOn(featureFlags, 'useFeatureFlags').mockReturnValue({
            data330Enabled: true,
        } as ReturnType<typeof featureFlags.useFeatureFlags>);
        render(<UserSettings />);
        // Data/EI versions should reflect 3.3.0 variants
        expect(screen.getByText('3.1.0, 3.2.0, 3.3.0')).toBeInTheDocument();
        expect(
            screen.getByText('3.1.0, 3.1.2, 3.2.0, 3.3.0')
        ).toBeInTheDocument();
        // Reset feature flag to default for subsequent tests
        vi.spyOn(featureFlags, 'useFeatureFlags').mockReturnValue({
            data330Enabled: false,
        } as ReturnType<typeof featureFlags.useFeatureFlags>);
    });
});
