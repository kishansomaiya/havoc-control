import {
    Box,
    Breadcrumbs,
    Divider,
    Link,
    MenuItem,
    Typography,
} from '@mui/material';
import { Outlet, useLocation } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowUpRight, ChevronLeft, Mail } from 'react-feather';
import styles from './ProfilePage.module.css';
import { ROUTES } from '../../const';
import { useUserContext } from '../../context/UserContextProvider';
import { RoutedTab, RoutedTabs } from '../../components/RoutedTabs/RoutedTabs';
import { ButtonDropDown } from '../../components/ButtonDropDown/ButtonDropDown';

const PROFILE_TABS: RoutedTab[] = [
    {
        label: 'User Settings',
        route: ROUTES.PROFILE_TABS.USER_SETTINGS,
    },
    {
        label: 'Role Management',
        route: ROUTES.PROFILE_TABS.ROLE_MANAGEMENT,
    },
    {
        label: 'User Group Management',
        route: ROUTES.PROFILE_TABS.USER_GROUP_MANAGEMENT,
        tooltip: 'Coming soon',
        disabled: true,
    },
    {
        label: 'Portfolio Sharing',
        route: ROUTES.PROFILE_TABS.PORTFOLIO_SHARING,
    },
];

export const ProfilePage = () => {
    const { isAdministrator, isPortfolioSharer } = useUserContext();
    const location = useLocation();

    const tabs = useMemo(() => {
        return [
            PROFILE_TABS[0],
            ...(isAdministrator ? [...PROFILE_TABS.slice(1, 3)] : []),
            ...(isPortfolioSharer ? [PROFILE_TABS[3]] : []),
        ];
    }, [isAdministrator, isPortfolioSharer]);

    const isUserEditingAnyRole = useMemo(() => {
        if (
            location.pathname.includes(`/edit-role`) ||
            location.pathname.includes(`/edit-users`) ||
            location.pathname.includes(`/create-role`)
        ) {
            return true;
        }
        return false;
    }, [location.pathname]);

    return (
        <Box
            className={styles.root}
            display="flex"
            flexDirection="column"
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={12}
                py={1}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Breadcrumbs>
                        <Link
                            component={RouterLink}
                            to="/"
                            underline="hover"
                            variant="body1"
                            display="flex"
                            alignItems="center"
                        >
                            <ChevronLeft size="1rem" />
                            Home
                        </Link>
                        {isUserEditingAnyRole && (
                            <Link
                                component={RouterLink}
                                to={ROUTES.PROFILE_TABS.ROLE_MANAGEMENT}
                                underline="hover"
                                variant="body1"
                                display="flex"
                                alignItems="center"
                                data-testid="breadcrumbs-locations"
                            >
                                Role Management
                            </Link>
                        )}
                    </Breadcrumbs>
                    <Box
                        display="flex"
                        gap={1}
                        alignItems="end"
                    >
                        <Typography variant="h1">User Settings</Typography>
                    </Box>
                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    position="relative"
                    gap={1}
                >
                    <ButtonDropDown
                        buttonLabel="Contact Support"
                        buttonStyle="text"
                        closeOnSelect
                    >
                        <Link
                            href="https://jupiterintel.atlassian.net/helpcenter/support/portal/5/group/18/create/85"
                            target="_blank"
                            underline="none"
                        >
                            <MenuItem
                                data-testid="contact-support-drop-down-portal"
                                sx={{ justifyContent: 'space-between' }}
                            >
                                Portal
                                <ArrowUpRight size="1rem" />
                            </MenuItem>
                        </Link>
                        <Link
                            href="mailto:support@jupiterintel.com"
                            title="Open mail to support@jupiterintel.com"
                            underline="none"
                        >
                            <MenuItem
                                data-testid="contact-support-drop-down-email"
                                sx={{ justifyContent: 'space-between' }}
                            >
                                Email
                                <Mail size="1rem" />
                            </MenuItem>
                        </Link>
                    </ButtonDropDown>
                </Box>
            </Box>
            <Divider />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={12}
            >
                <Divider orientation="vertical" />
                <RoutedTabs
                    tabs={tabs}
                    fallbackTabs={PROFILE_TABS}
                    data-testid="profile-tabs"
                    flexGrow={1}
                />
                <Divider orientation="vertical" />
            </Box>
            <Divider />
            <Outlet />
            <Divider />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                letterSpacing={0.4} // as per design
                px={12}
                py={1}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    By accessing and using the Jupiter Platform, you acknowledge
                    and agree that all data and materials provided in the
                    Jupiter Platform is Confidential Information of Jupiter.
                    Your access and use of the Jupiter Platform and such data
                    and materials are subject to the agreement entered into by
                    and between your company and Jupiter, the{' '}
                    <Link
                        href="https://www.jupiterintel.com/legal/privacy-policy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Jupiter Privacy Policy in new tab"
                        color="grey.300"
                    >
                        Jupiter Privacy Policy
                    </Link>
                    , and the{' '}
                    <Link
                        href="https://www.jupiterintel.com/legal/jupiters-acceptable-use-policy-for-jupiter-software-as-a-service/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Jupiter Acceptable Use Policy in new tab"
                        color="grey.300"
                    >
                        Jupiter Acceptable Use Policy
                    </Link>
                    .
                    <br />
                    <br />© 2025 Jupiter. All Rights Reserved.
                </Typography>
            </Box>
        </Box>
    );
};
