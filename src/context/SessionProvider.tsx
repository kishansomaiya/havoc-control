import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
    memo,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useIdleTimer } from 'react-idle-timer';
import oHeap from '../heap-analytics';
import { Auth0User } from '../types';
import { MAX_IDLE_TIMEOUT } from '../const';
import { datadogRum } from '@datadog/browser-rum';
import { useGetUserPermissionsQuery } from '../api/queries/usersQuery';
import { useUserContextUpdate } from './UserContextProvider';
import {
    checkIfPortfolioSharingEnabled,
    checkIfUserHasPortfolioAccessPermissions,
    checkIsUserCanAccessDisclosureResultSet,
    checkIsUserCanAccessKnowledgeBase,
    checkIsUserCanAccessLargeGrid,
    checkIfUserIsPortfolioCreator,
    checkIfUserIsPortfolioAdministrator,
    checkIsUserHasFidelityRole,
    checkIsUserHasPortfolioCreationReadOnlyAccess,
    checkIsUserIsAdministrator,
    checkIfUserIsPortfolioSharer,
} from '../utils';

const CHATBOT_SESSION_KEY = 'chatSessionID';

const CHATBOT_SESSION_DEFAULT_VALUE = {
    sessionId: '',
};

interface IChatbotSessionContext {
    sessionId: string;
}

interface IUserSessionContext {
    logoutAndClearSessions: () => Promise<void>;
    userPermissions: string[];
}

export const UserSessionContext = createContext<IUserSessionContext>({
    logoutAndClearSessions: async () => { },
    userPermissions: [],
});
export const useUserSession = () => {
    return useContext<IUserSessionContext>(UserSessionContext);
};

export const UpdateUserPermissionsContext = createContext<
    (permissions: string[]) => void
>(() => { });
export const useSetUserPermissions = () => {
    return useContext<(permissions: string[]) => void>(
        UpdateUserPermissionsContext
    );
};

export const ChatbotSessionContext = createContext<IChatbotSessionContext>(
    CHATBOT_SESSION_DEFAULT_VALUE
);
export const useSessionChatbot = (): IChatbotSessionContext => {
    return useContext<IChatbotSessionContext>(ChatbotSessionContext);
};

export const UserSessionProvider: FC<{ children: ReactNode }> = memo(
    ({ children }) => {
        const location = useLocation();
        const { isAuthenticated, isLoading, user, logout } =
            useAuth0<Auth0User>();
        const userId = user?.['custom:jupiter-user-id'] ?? '';
        const updateUserContext = useUserContextUpdate();

        const sessionIdInitialValue =
            localStorage.getItem(CHATBOT_SESSION_KEY) ||
            CHATBOT_SESSION_DEFAULT_VALUE.sessionId;
        const [sessionId] = useState<string>(sessionIdInitialValue);
        const [userPermissions, setUserPermissions] = useState<string[]>([]);
        const [permissionsLoading, setPermissionsLoading] = useState(true);

        const { userPermissions: fetchedPermissions, refetchUserPermissions } =
            useGetUserPermissionsQuery(userId);

        const logoutAndClearSessions = useCallback(async () => {
            oHeap.logoutFromHeap();
            datadogRum.clearUser();
            localStorage.removeItem(CHATBOT_SESSION_KEY);

            await logout({
                logoutParams: {
                    returnTo: window.location.origin,
                },
            });
        }, [logout]);

        const onIdle = useCallback(async () => {
            if (isAuthenticated) {
                await logoutAndClearSessions();
            }
        }, [isAuthenticated, logoutAndClearSessions]);

        const handleUpdateUserPermissions = useCallback(
            (permissions: string[]) => {
                setUserPermissions(permissions);
            },
            [setUserPermissions]
        );

        const checkIfUsercanAccessObjectAsAdminOrCreator = useCallback(
            (portfolioCreatedByUserid: string): boolean => {
                return (
                    checkIfUserIsPortfolioAdministrator(userPermissions) ||
                    Boolean(
                        user?.['custom:jupiter-user-id'] ===
                        portfolioCreatedByUserid
                    )
                );
            },
            [userPermissions, user]
        );

        useIdleTimer({
            onIdle,
            timeout: MAX_IDLE_TIMEOUT,
            events: [
                'mousemove',
                'keydown',
                'wheel',
                'DOMMouseScroll',
                'mousewheel',
                'mousedown',
                'touchstart',
                'touchmove',
                'MSPointerDown',
                'MSPointerMove',
            ],
        });

        /** TODO: Uncomment this if chat Session ID is to be created on client-side */
        // useEffect(() => {
        //     if (!isAuthenticated || sessionId) {
        //         return;
        //     }
        //     const newSessionId = reactKey();
        //     localStorage.setItem(CHATBOT_SESSION_KEY, newSessionId);
        //     setSessionId(newSessionId);
        // }, [isAuthenticated, sessionId]);

        useEffect(() => {
            let debounceTimer: NodeJS.Timeout | null = null;

            // List of routes that should trigger a refetch
            const refetchRoutes = ['/', '/profile']; // Add more as needed

            const shouldRefetch = refetchRoutes.some((route) =>
                route === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(route)
            );

            if (shouldRefetch) {
                debounceTimer = setTimeout(() => {
                    refetchUserPermissions();
                }, 1000);
            }

            return () => {
                if (debounceTimer) clearTimeout(debounceTimer);
            };
        }, [location.pathname, refetchUserPermissions]);

        useEffect(() => {
            if (isLoading || !isAuthenticated || !user) {
                return;
            }
            const username = user.email ?? '';
            const tenantName =
                (user as Auth0User)['custom:jupiter-tenant-name'] ?? '';
            if (username && tenantName) {
                oHeap.loginToHeap({ username, tenantName });
                datadogRum.setUser({
                    CustomerID: tenantName,
                    UserID: username,
                });
            }
        }, [isLoading, isAuthenticated, user]);

        useEffect(() => {
            if (fetchedPermissions) {
                setUserPermissions(fetchedPermissions);
                setPermissionsLoading(false);
            }
        }, [fetchedPermissions]);

        useEffect(() => {
            if (!isAuthenticated || !user) {
                return;
            }
            const isPortfolioSharingEnabled =
                checkIfPortfolioSharingEnabled(user);
            const isPortfolioCreator =
                !isPortfolioSharingEnabled ||
                checkIfUserIsPortfolioCreator(userPermissions);
            updateUserContext({
                user,
                hasFidelity: checkIsUserHasFidelityRole(user),
                canAccessKnowledgeBase: checkIsUserCanAccessKnowledgeBase(user),
                canAccessLargeGrid: checkIsUserCanAccessLargeGrid(user),
                canAccessDisclosureResultSet:
                    checkIsUserCanAccessDisclosureResultSet(user),
                isAdministrator: checkIsUserIsAdministrator(userPermissions),
                isPortfolioSharer:
                    checkIfUserIsPortfolioSharer(userPermissions),
                hasPortfolioAccessPermissions:
                    checkIfUserHasPortfolioAccessPermissions(userPermissions),
                isPortfolioSharingEnabled,
                isPortfolioCreator,
                isPortfolioAdministrator:
                    checkIfUserIsPortfolioAdministrator(userPermissions),
                hasPortfolioCreationReadOnlyAccess:
                    checkIsUserHasPortfolioCreationReadOnlyAccess(
                        userPermissions
                    ),
                isPermissionsLoading: permissionsLoading,
                checkIfUsercanAccessObjectAsAdminOrCreator,
            });
        }, [
            updateUserContext,
            user,
            isAuthenticated,
            userPermissions,
            permissionsLoading,
        ]);

        return (
            <UserSessionContext.Provider
                value={{ logoutAndClearSessions, userPermissions }}
            >
                <UpdateUserPermissionsContext.Provider
                    value={handleUpdateUserPermissions}
                >
                    <ChatbotSessionContext.Provider value={{ sessionId }}>
                        {children}
                    </ChatbotSessionContext.Provider>
                </UpdateUserPermissionsContext.Provider>
            </UserSessionContext.Provider>
        );
    }
);
