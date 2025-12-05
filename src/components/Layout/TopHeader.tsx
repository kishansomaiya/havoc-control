import { ComponentProps, FC, useCallback, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Divider,
    MenuItem,
    Typography,
    Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MuiThemeName } from '../../themes/themes';
import { useAppThemeName } from '../../context/AppThemeProvider';
import { ROUTES } from '../../const';
import * as Icon from 'react-feather';
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { MenuDropDown } from '../MenuDropDown/MenuDropDown';
import { useNavigate } from 'react-router';
import { useLegalNotice } from '../../context/LegalNoticeProvider';
import { Auth0User } from '../../types';
import { useUserContext } from '../../context/UserContextProvider';
import { useDoc360TokenQuery } from '../../api/queries/doc360Query';
import { JupiterAIInterestModal } from '../JupiterAIInterestModal/JupiterAIInterestModal';
import { useUserSession } from '../../context/SessionProvider';
import oHeap from '../../heap-analytics';
import { TOP_HEADER_HEIGHT } from '../../const/ui/layout';
import { KNOWLEDGE_BASE_BTN } from '../../const/heap';

export interface TopHeaderProps extends ComponentProps<'div'> {}

export const TopHeader: FC<TopHeaderProps> = ({ children, ...props }) => {
    const themeName: MuiThemeName = useAppThemeName();
    const isLegalNoticeAcknowledged: boolean = useLegalNotice();
    // TODO: move user info to Context or State
    const { user } = useAuth0();
    const { logoutAndClearSessions } = useUserSession();
    const navigate = useNavigate();
    const { canAccessKnowledgeBase } = useUserContext();
    const [isJupiterAIModalOpen, setIsJupiterAIModalOpen] = useState(false);

    const userId = useMemo(
        () => (user as Auth0User)['custom:jupiter-user-id'],
        [user]
    );

    const { reFetchDoc360Token } = useDoc360TokenQuery(userId);

    const handleOpenJupiterAIModal = useCallback(() => {
        setIsJupiterAIModalOpen(true);
    }, []);

    const handleCloseJupiterAIModal = useCallback(() => {
        setIsJupiterAIModalOpen(false);
    }, []);

    const userName = useMemo<string>(() => {
        return (user as Auth0User)?.name || '--';
    }, [user]);

    const userCompanyName = useMemo<string>(() => {
        return (
            (user as Auth0User)['custom:jupiter-tenant-display-name'] || '--'
        );
    }, [user]);

    const handleLogoutClick = useCallback(async () => {
        await logoutAndClearSessions();
    }, [logoutAndClearSessions]);

    const handleGoToProfile = useCallback(() => {
        navigate(ROUTES.PROFILE_PAGE);
    }, [navigate]);

    const logoSrc: string = useMemo(() => {
        return `/JupiterLogo_${themeName}.svg`;
    }, [themeName]);

    const handleGoToKnowledgeBase = useCallback(async () => {
        if (!canAccessKnowledgeBase) {
            return;
        }

        oHeap.trackCustomEvent(KNOWLEDGE_BASE_BTN, {
            from: 'header',
        });

        const { data } = await reFetchDoc360Token();
        if (!data?.token) {
            return;
        }

        window.open(
            `https://jupiterintel.document360.io/jwt/authorize?code=${data.token}`,
            '_blank'
        );
    }, [canAccessKnowledgeBase, reFetchDoc360Token]);

    return (
        <div {...props}>
            <Box
                sx={{
                    bgcolor: 'background.header',
                }}
                display="flex"
                px={3}
                py={1}
                alignItems="center"
                justifyContent="space-between"
                minHeight={TOP_HEADER_HEIGHT}
                data-testid="top-header-block"
            >
                <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                >
                    <Link
                        component={RouterLink}
                        to={ROUTES.HOMEPAGE}
                        title="Go to Homepage"
                        data-testid="top-header-logo"
                        style={{ display: 'flex' }}
                    >
                        <img
                            src={logoSrc}
                            width="126"
                            height="30"
                            alt="Jupiter Intelligence"
                            data-testid="top-header-logo-img"
                        />
                    </Link>
                    <Typography
                        variant="h4"
                        data-testid="top-header-title"
                    >
                        ClimateScore Global
                    </Typography>
                </Box>
                {isLegalNoticeAcknowledged && (
                    <Box
                        display="flex"
                        gap={3}
                        alignItems="center"
                    >
                        <Button
                            variant="text"
                            endIcon={<Icon.ArrowUpRight size="1rem" />}
                            onClick={handleOpenJupiterAIModal}
                        >
                            Jupiter AI
                        </Button>

                        <Button
                            onClick={handleGoToKnowledgeBase}
                            variant="text"
                            endIcon={<Icon.ArrowUpRight size="1rem" />}
                            data-testid="top-header-knowledge-base-button"
                            disabled={!canAccessKnowledgeBase}
                        >
                            Knowledge Base
                        </Button>
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                bgcolor: 'grey.500',
                                height: '1.75rem',
                                marginY: 'auto',
                            }}
                        />
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            position="relative"
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                            >
                                <Icon.User
                                    size="1.5rem"
                                    data-testid="top-header-user-icon"
                                />
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                            >
                                <Typography
                                    variant="h6"
                                    data-testid="top-header-welcome-user-text"
                                >
                                    Welcome back, {userName}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    data-testid="top-header-user-company"
                                >
                                    {userCompanyName}
                                </Typography>
                            </Box>

                            <MenuDropDown
                                data-testid="top-header-menu-drop-down-arrow"
                                closeOnSelect
                            >
                                {import.meta.env.MODE === 'development' && (
                                    <MenuItem data-testid="top-header-menu-drop-down-theme-switcher-block">
                                        <ThemeSwitcher />
                                    </MenuItem>
                                )}
                                <MenuItem
                                    onClick={handleGoToProfile}
                                    data-testid="top-header-menu-drop-down-settings"
                                >
                                    Settings
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogoutClick}
                                    data-testid="top-header-menu-drop-down-logout"
                                >
                                    Logout
                                </MenuItem>
                            </MenuDropDown>
                        </Box>
                    </Box>
                )}
                {isJupiterAIModalOpen && (
                    <JupiterAIInterestModal
                        onClose={handleCloseJupiterAIModal}
                    />
                )}
            </Box>
            {children}
        </div>
    );
};
