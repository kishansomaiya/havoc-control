import { FC, ReactNode } from 'react';
import { Auth0ProviderConfiguration } from './Aut0ProviderConfiguration';
import { Auth0Guard } from './Auth0Guard';
import { Auth0ErrorBoundary } from './Auth0ErrorBoundary';

export const Auth0: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Auth0ProviderConfiguration>
            <Auth0ErrorBoundary>
                <Auth0Guard>{children}</Auth0Guard>
            </Auth0ErrorBoundary>
        </Auth0ProviderConfiguration>
    );
};
