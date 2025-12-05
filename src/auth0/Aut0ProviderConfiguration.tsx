import { FC, ReactNode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import {
    auth0ApiAudience,
    auth0CallbackUrl,
    auth0ClientId,
    auth0Domain,
} from '../config';

export const Auth0ProviderConfiguration: FC<{ children: ReactNode }> = ({
    children,
}) => {
    return (
        <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            useRefreshTokens
            useRefreshTokensFallback
            cacheLocation="localstorage"
            authorizationParams={{
                redirect_uri: auth0CallbackUrl || window.location.origin,
                audience: auth0ApiAudience,
            }}
        >
            {children}
        </Auth0Provider>
    );
};
