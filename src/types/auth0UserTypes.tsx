import { User } from '@auth0/auth0-react';

export interface Auth0User extends User {
    'custom:dbi-tenant-id'?: string;
    'custom:dbi-user-id'?: string;
    'custom:jupiter-role'?: string;
    'custom:jupiter-tenant-display-name'?: string;
    'custom:jupiter-tenant-id'?: string;
    'custom:jupiter-tenant-name'?: string;
    'custom:jupiter-user-id'?: string;
    email?: string;
    email_verified?: boolean;
    family_name?: string;
    given_name?: string;
    name?: string;
    nickname?: string;
    org_id?: string;
    picture?: string;
    sub?: string;
    updated_at?: string;
}
