import { IntlProvider } from 'react-intl';
import { PropsWithChildren, ReactNode } from 'react';
import { Auth0User } from '../types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IUserContext, UserContext } from '../context/UserContextProvider';
import { AddAlert } from '../context/AlertProvider';

type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface UserContextOverride {
    user?: Auth0User | undefined;
    hasFidelity?: boolean;
    canAccessKnowledgeBase?: boolean;
    canAccessLargeGrid?: boolean;
    canAccessDisclosureResultSet?: boolean;
    isAdministrator?: boolean;
    isPortfolioSharer?: boolean;
    isPortfolioSharingEnabled?: boolean;
    hasPortfolioAccessPermissions?: boolean;
    isPortfolioCreator?: boolean;
    isPortfolioAdministrator?: boolean;
    hasPortfolioCreationReadOnlyAccess?: boolean;
    isPermissionsLoading?: boolean;
    checkIfUsercanAccessObjectAsAdminOrCreator?: (id: string) => boolean;
}

export interface TestRootProps {
    locale?: string;
    messages?: Record<string, string>;
    userContextValue?: UserContextOverride;
    queryClient?: QueryClient;
    addAlertOverride?: (message: string, type: AlertType) => void | undefined;
    children: ReactNode;
}
const defaultUserContext: IUserContext = {
    user: {
        email: 'john.doe@example.com',
        email_verified: false,
        name: 'John Doe',
    },
    hasFidelity: false,
    canAccessKnowledgeBase: false,
    canAccessLargeGrid: false,
    canAccessDisclosureResultSet: false,
    isAdministrator: false,
    isPortfolioSharer: false,
    isPortfolioSharingEnabled: false,
    hasPortfolioAccessPermissions: false,
    isPortfolioCreator: false,
    isPortfolioAdministrator: false,
    hasPortfolioCreationReadOnlyAccess: false,
    isPermissionsLoading: false,
    checkIfUsercanAccessObjectAsAdminOrCreator: () => false,
};

export function TestRoot({
    locale = 'en-US',
    messages = {},
    userContextValue,
    queryClient,
    addAlertOverride,
    children,
}: PropsWithChildren<TestRootProps>) {
    const qc = queryClient ?? new QueryClient();
    const mergedUserContext = { ...defaultUserContext, ...userContextValue };

    return (
        <IntlProvider
            locale={locale}
            messages={messages}
            onError={() => {}}
        >
            <QueryClientProvider client={qc}>
                <AddAlert.Provider value={addAlertOverride ?? vi.fn()}>
                    <UserContext.Provider value={mergedUserContext}>
                        {children}
                    </UserContext.Provider>
                </AddAlert.Provider>
            </QueryClientProvider>
        </IntlProvider>
    );
}
