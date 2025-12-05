import { FC, ReactNode } from 'react';
import { UserSessionProvider } from '../context/SessionProvider';
import { UserSessionErrorBoundary } from './UserSessionErrorBoundary';

export const UserSession: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <UserSessionProvider>
            <UserSessionErrorBoundary>{children}</UserSessionErrorBoundary>
        </UserSessionProvider>
    );
};
