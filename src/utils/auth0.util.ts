import { IdToken, User } from '@auth0/auth0-react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { isNil } from 'lodash';
import { PermissionValues } from '../types/rolePermissions';

const TOKEN_EXPIRY_THRESHOLD = 5 * 60 * 1000;

export const getUserIdToken = (): string => {
    return localStorage.getItem('idToken') ?? '';
};

export const setUserIdToken = (token = ''): void => {
    localStorage.setItem('idToken', token);
};

export const getUserAccessToken = (): string => {
    return localStorage.getItem('accessToken') ?? '';
};

export const setUserAccessToken = (token = ''): void => {
    localStorage.setItem('accessToken', token);
};

export const extractDetailsFromToken = (
    token: string
): {
    exp: number | null | undefined;
    isExpired: boolean;
    timeoutExpiry: number;
} => {
    if (token) {
        try {
            const { exp } = jwtDecode<JwtPayload>(token);
            const dateNow = Date.now();
            if (isNil(exp)) {
                return {
                    exp,
                    isExpired: false,
                    timeoutExpiry: 0,
                };
            }

            const diff = exp && exp * 1000 - dateNow;
            const timeoutExpiry =
                diff && diff > TOKEN_EXPIRY_THRESHOLD
                    ? diff - TOKEN_EXPIRY_THRESHOLD
                    : 0;

            return {
                exp,
                isExpired: Boolean(exp && dateNow >= exp * 1000),
                timeoutExpiry,
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error parsing id token.', error);
        }
    }

    return {
        exp: 0,
        isExpired: true,
        timeoutExpiry: 0,
    };
};

export const extractExpirationFromToken = (
    token: IdToken
): {
    isExpired: boolean;
    expiryTimeout: number;
} => {
    if (!token || !token.exp) {
        return {
            isExpired: true,
            expiryTimeout: 0,
        };
    }

    const dateNow = Date.now();
    const dateExpiration = token.exp * 1000;
    const diff = dateExpiration - dateNow;
    const expiryTimeout =
        diff && diff > TOKEN_EXPIRY_THRESHOLD
            ? diff - TOKEN_EXPIRY_THRESHOLD
            : 0;

    return {
        isExpired: dateNow >= dateExpiration,
        expiryTimeout,
    };
};

export const checkIsUserHasFidelityRole = (user: User | undefined): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-roles'].includes('fidelity-slr');
};

// Temporary work around to enable portfolio sharing and portfolio tabs for selected tenants
// TODO: Remove this once we have portfolio sharing and portfolio tabs available for all tenants
export const checkIfPortfolioSharingEnabled = (
    user: User | undefined
): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-roles'].includes('SHARING');
};

export const checkIsUserCanAccessKnowledgeBase = (
    user: User | undefined
): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-role'] !== 'jupiter-trial-user';
};

export const checkIsUserCanAccessLargeGrid = (
    user: User | undefined
): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-roles'].includes('GRID15');
};

export const canUserAccessCSRDCopilot = (user: User | undefined): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-tenant-name'] === 'jupiter';
};

export const checkIsUserCanAccessEI_3_1_1 = (
    user: User | undefined
): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-roles'].includes('CUST1');
};

export const checkIsUserCanAccessDisclosureResultSet = (
    user: User | undefined
): boolean => {
    if (!user) {
        return false;
    }

    return user['custom:jupiter-roles'].includes('CSRD');
};

export const checkIsUserIsAdministrator = (
    userPermissions: string[] | undefined
): boolean => {
    if (!userPermissions) {
        return false;
    }

    return userPermissions.includes(PermissionValues.ROLE_MANAGER);
};

export const checkIfUserHasPortfolioAccessPermissions = (
    userPermissions: string[] | undefined
): boolean => {
    if (!userPermissions) {
        return false;
    }

    return (
        userPermissions.includes(PermissionValues.OBJECT_MANAGER) ||
        userPermissions.includes(PermissionValues.OBJECT_READER) ||
        userPermissions.includes(PermissionValues.OBJECT_ADMINISTRATOR)
    );
};

export const checkIfUserIsPortfolioSharer = (
    userPermissions: string[] | undefined
): boolean => {
    if (!userPermissions) {
        return false;
    }

    return userPermissions.includes(PermissionValues.OBJECT_SHARER);
};

export const checkIfUserIsPortfolioCreator = (
    userPermissions: string[] | undefined
): boolean => {
    if (!userPermissions) {
        return false;
    }

    return !!userPermissions?.includes(PermissionValues.OBJECT_MANAGER);
};

export const checkIfUserIsPortfolioAdministrator = (
    userPermissions: string[] | undefined
): boolean => {
    if (!userPermissions) {
        return false;
    }

    return userPermissions.includes(PermissionValues.OBJECT_ADMINISTRATOR);
};

export const checkIsUserHasPortfolioCreationReadOnlyAccess = (
    userPermissions: string[] | undefined
): boolean => {
    if (!userPermissions) {
        return false;
    }

    return (
        userPermissions.includes(PermissionValues.OBJECT_READER) &&
        !userPermissions.includes(PermissionValues.OBJECT_MANAGER)
    );
};
