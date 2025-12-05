import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { isNumber } from 'lodash';
import { LoadingPage } from '../pages/LoadingPage/LoadingPage';
import {
    extractDetailsFromToken,
    getUserAccessToken,
    getUserIdToken,
    setUserAccessToken,
    setUserIdToken,
} from '../utils';

export const RefreshTokensContext = createContext<() => Promise<void>>(
    async () => {}
);
export const useRefreshTokens = () => {
    return useContext<() => Promise<void>>(RefreshTokensContext);
};

export const Auth0Guard: FC<{ children: ReactNode }> = ({ children }) => {
    const {
        loginWithRedirect,
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
        getIdTokenClaims,
        error,
    } = useAuth0();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);

    const [tokenTimerId, setTokenTimerId] = useState<number>();

    const getTokens = async (skipCache = false): Promise<void> => {
        return await new Promise<void>((resolve, reject) => {
            // avoid fetching tokens from cache to get a new set of tokens.
            // used to renew token before expiry.
            getAccessTokenSilently(skipCache ? { cacheMode: 'off' } : {})
                .then((accessToken) => {
                    getIdTokenClaims()
                        .then((idTokenClaims) => {
                            // eslint-disable-next-line no-underscore-dangle
                            const idToken = idTokenClaims?.__raw;
                            if (idToken) {
                                setAccessToken(accessToken);
                                setUserAccessToken(accessToken);
                                setIdToken(idToken);
                                setUserIdToken(idToken);

                                resolve();
                            } else {
                                // eslint-disable-next-line prefer-promise-reject-errors
                                reject('Error while renewing id token!');
                            }
                        })
                        .catch((e) => {
                            reject(e);
                        });
                })
                .catch((e) => {
                    reject(e);
                });
        });
    };

    const trySilentRenewToken = async (): Promise<void> => {
        if (isAuthenticated) {
            try {
                await getTokens(true);
                startTokenExpiryTimer();
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
            }
        }
    };

    const startTokenExpiryTimer = (): void => {
        const idToken = getUserIdToken();
        const accessToken = getUserAccessToken();

        // Extract id-token expiry
        const {
            isExpired: isIdTokenExpired,
            timeoutExpiry: timeoutIdTokenExpiry,
        } = extractDetailsFromToken(idToken);
        // Extract access-token expiry
        const {
            isExpired: isAccessTokenExpired,
            timeoutExpiry: timeoutAccessTokenExpiry,
        } = extractDetailsFromToken(accessToken);

        if (
            !isIdTokenExpired &&
            !isAccessTokenExpired &&
            isNumber(timeoutIdTokenExpiry) &&
            isNumber(timeoutAccessTokenExpiry)
        ) {
            // Have 5m buffer before start trying for silent signIn
            // If token is about to expire then start silentSignIn
            // else just set timer to try for silentSignIn before token expires
            clearTimeout(tokenTimerId);

            // Set the shortest expiry time as timeout
            const timeoutExpiry =
                timeoutAccessTokenExpiry < timeoutIdTokenExpiry
                    ? timeoutAccessTokenExpiry
                    : timeoutIdTokenExpiry;
            const timerId = setTimeout(() => {
                void trySilentRenewToken();
            }, timeoutExpiry);
            setTokenTimerId(Number(timerId));
        }
    };

    useEffect(() => {
        void (async () => {
            if (error) {
                // eslint-disable-next-line no-console
                console.log('AUTH0 ERROR: ', error);
            }
            if (isAuthenticated) {
                try {
                    const currIdToken = getUserIdToken();
                    const currAccessToken = getUserAccessToken();
                    const newTokens =
                        (Boolean(currAccessToken) &&
                            extractDetailsFromToken(currAccessToken)
                                .isExpired) ||
                        (Boolean(currIdToken) &&
                            extractDetailsFromToken(currIdToken).isExpired);

                    await getTokens(newTokens);

                    startTokenExpiryTimer();
                } catch (e) {
                    void loginWithRedirect();
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, error, loginWithRedirect]);

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!isAuthenticated) {
        loginWithRedirect();
        return <LoadingPage />;
    }

    if (!(accessToken && idToken)) {
        return <LoadingPage />;
    }

    return (
        <RefreshTokensContext.Provider value={getTokens}>
            {children}
        </RefreshTokensContext.Provider>
    );
};
