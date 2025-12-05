import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Auth0User } from '../types';
import flagsmith from 'flagsmith';

const DEAULT_USER_CONTEXT = {
    user: undefined,
    hasFidelity: false,
    canAccessKnowledgeBase: true,
    canAccessLargeGrid: false,
    canAccessDisclosureResultSet: false,
    isAdministrator: false,
    isPortfolioSharer: false,
    isPortfolioSharingEnabled: false,
    hasPortfolioAccessPermissions: false,
    isPortfolioCreator: false,
    isPortfolioAdministrator: false,
    hasPortfolioCreationReadOnlyAccess: false,
    isPermissionsLoading: true,
    checkIfUsercanAccessObjectAsAdminOrCreator: () => false,
};

export interface IUserContext {
    user: Auth0User | undefined;
    hasFidelity: boolean;
    canAccessKnowledgeBase: boolean;
    canAccessLargeGrid: boolean;
    canAccessDisclosureResultSet: boolean;
    isAdministrator: boolean;
    isPortfolioSharer: boolean;
    isPortfolioSharingEnabled: boolean;
    hasPortfolioAccessPermissions: boolean;
    isPortfolioCreator: boolean;
    isPortfolioAdministrator: boolean;
    hasPortfolioCreationReadOnlyAccess: boolean;
    isPermissionsLoading: boolean;
    checkIfUsercanAccessObjectAsAdminOrCreator: (id: string) => boolean;
}

export const UserContext = createContext<IUserContext>(DEAULT_USER_CONTEXT);
export const useUserContext = (): IUserContext => {
    return useContext<IUserContext>(UserContext);
};

export const UpdateUserContext = createContext<(context: IUserContext) => void>(
    () => {}
);
export const useUserContextUpdate = () => {
    return useContext<(context: IUserContext) => void>(UpdateUserContext);
};

export const UserContextProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const flagsmithInitialized = useRef(false);
    const [context, setContext] = useState<IUserContext>(DEAULT_USER_CONTEXT);

    const handleUserContextChanges = useCallback((context: IUserContext) => {
        setContext(context);
    }, []);

    useEffect(() => {
        if (flagsmithInitialized.current || !context?.user) {
            return;
        }
        const { user } = context;

        flagsmithInitialized.current = true;
        flagsmith.identify(user?.['custom:jupiter-user-id'] || '', {
            name: user?.name || '',
            email: user?.email || '',
            tenant_id: user?.['custom:jupiter-tenant-id'] || '',
            tenant_name: user?.['custom:jupiter-tenant-name'] || '',
            tenant_display_name:
                user?.['custom:jupiter-tenant-display-name'] || '',
        });
    }, [context]);

    return (
        <UserContext.Provider value={context}>
            <UpdateUserContext.Provider value={handleUserContextChanges}>
                {children}
            </UpdateUserContext.Provider>
        </UserContext.Provider>
    );
};
