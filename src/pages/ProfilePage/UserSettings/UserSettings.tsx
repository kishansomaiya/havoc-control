import { Box, Divider, Typography } from '@mui/material';
import styles from '../ProfilePage.module.css';
import { InfoGrid } from '../InfoGrid/InfoGrid';
import { useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0User } from '../../../types';
import { ClientCredsGrid } from '../ClientCredsSettings/ClientCredsSettings';
import { UsageTracking } from '../UsageTracking/UsageTracking';
import {
    checkIfUserIsPortfolioCreator,
    checkIsUserCanAccessEI_3_1_1,
} from '../../../utils';
import { useGetUserPermissionsQuery } from '../../../api/queries/usersQuery';
import { useFeatureFlags } from '../../../featureFlags/useFeatureFlags';

const APP_VERSION = '4.3.0';
const SUPPORTED_DATA_VERSIONS = '3.0.0, 3.1.0, 3.2.0'; // To be fetched from API later
const SUPPORTED_DATA_VERSIONS_330 = '3.1.0, 3.2.0, 3.3.0'; // To be fetched from API later
const SUPPORTED_EI_VERSIONS = '3.0.0, 3.1.0, 3.1.2, 3.2.0'; // To be fetched from API later
const SUPPORTED_EI_VERSIONS_330 = '3.1.0, 3.1.2, 3.2.0, 3.3.0'; // To be fetched from API later
const SUPPORTED_EI_VERSIONS_3_1_1 = '3.0.0, 3.1.0, 3.1.1, 3.2.0'; // To be fetched from API later

export const getSupportedEIVersions = (hasEI_3_1_1: boolean = false) =>
    hasEI_3_1_1 ? SUPPORTED_EI_VERSIONS_3_1_1 : SUPPORTED_EI_VERSIONS;

export const UserSettings = () => {
    const { data330Enabled } = useFeatureFlags('data330Enabled');
    const { user } = useAuth0<Auth0User>();
    const { userPermissions } = useGetUserPermissionsQuery(
        user?.['custom:jupiter-user-id'] ?? ''
    );

    const showUsageTracking = checkIfUserIsPortfolioCreator(userPermissions);

    const userInfo = useMemo<Array<{ key: string; value: string }>>(() => {
        const name = user?.name ?? '--';
        const email = user?.email ?? '--';
        return [
            { key: 'Name', value: name },
            { key: 'Email', value: email },
        ];
    }, [user]);

    const supportedEIVersions = data330Enabled
        ? SUPPORTED_EI_VERSIONS_330
        : getSupportedEIVersions(checkIsUserCanAccessEI_3_1_1(user));

    const supportedDataVersions = data330Enabled
        ? SUPPORTED_DATA_VERSIONS_330
        : SUPPORTED_DATA_VERSIONS;

    return (
        <Box
            className={styles.noScroll}
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            flexGrow={1}
        >
            <Box
                display="flex"
                flexDirection="column"
                className={styles.scroll}
                width="100%"
                height="100%"
                px={12}
                py={7.5}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={3}
                >
                    <Typography
                        variant="overline"
                        textTransform="uppercase"
                    >
                        Primary Information
                    </Typography>
                    <InfoGrid infoList={userInfo} />
                    <ClientCredsGrid />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    pt={5}
                >
                    <Typography
                        variant="overline"
                        textTransform="uppercase"
                    >
                        Version
                    </Typography>
                    <InfoGrid
                        infoList={[
                            { key: 'App Version', value: APP_VERSION },
                            {
                                key: 'Data Version',
                                value: supportedDataVersions,
                            },
                            {
                                key: 'Economic Impact Version',
                                value: supportedEIVersions,
                            },
                        ]}
                    />
                </Box>
            </Box>
            {showUsageTracking && (
                <>
                    <Divider orientation="vertical" />
                    <Box
                        display="flex"
                        flexDirection="column"
                        className={styles.scroll}
                        width="100%"
                        height="100%"
                        px={8}
                        py={7.5}
                    >
                        <UsageTracking />
                    </Box>
                </>
            )}
        </Box>
    );
};
