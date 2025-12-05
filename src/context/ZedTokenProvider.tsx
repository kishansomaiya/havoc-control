import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    FC,
} from 'react';

// Context for the role Zed token
export const ZedTokenContext = createContext<
    | {
        roleZedToken: string | undefined;
        clientZedToken: string | undefined;
    }
    | undefined
>(undefined);

export const useZedToken = () => {
    const context = useContext(ZedTokenContext);
    if (!context) {
        throw new Error('useZedToken must be used within a ZedTokenProvider');
    }
    return context;
};

// Context for the handlers
export const SetZedTokenContext = createContext<
    | {
        handleSetRoleZedToken: (token: string | undefined) => void;
        handleSetClientZedToken: (token: string | undefined) => void;
    }
    | undefined
>(undefined);

export const useSetZedToken = () => {
    const context = useContext(SetZedTokenContext);
    if (!context) {
        throw new Error(
            'useSetZedToken must be used within a ZedTokenProvider'
        );
    }
    return context;
};

export const ZedTokenProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [roleZedToken, setRoleZedToken] = useState<string | undefined>(
        undefined
    );
    const [clientZedToken, setClientZedToken] = useState<string | undefined>(
        undefined
    );

    const handleSetRoleZedToken = useCallback((token: string | undefined) => {
        setRoleZedToken(token);
    }, []);

    const handleSetClientZedToken = useCallback((token: string | undefined) => {
        setClientZedToken(token);
    }, []);

    return (
        <ZedTokenContext.Provider value={{ roleZedToken, clientZedToken }}>
            <SetZedTokenContext.Provider
                value={{
                    handleSetRoleZedToken,
                    handleSetClientZedToken,
                }}
            >
                {children}
            </SetZedTokenContext.Provider>
        </ZedTokenContext.Provider>
    );
};
