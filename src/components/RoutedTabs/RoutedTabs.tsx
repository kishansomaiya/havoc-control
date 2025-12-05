import { FC, ReactNode, useEffect, useMemo } from 'react';
import {
    Box,
    BoxProps,
    CircularProgress,
    Tab,
    Tabs,
    Tooltip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { isFunction } from 'lodash';

export interface RoutedTab {
    label: string;
    route: string;
    onClick?: () => void;
    disabled?: boolean;
    tooltip?: string | ReactNode;
    isLoading?: boolean;
    onTabActive?: () => void;
    onClickImportant?: () => void;
}

export interface RoutedTabsProps extends BoxProps {
    tabs: RoutedTab[];
    fallbackTabs?: RoutedTab[];
}

function getTabNameFromHref(
    href: string,
    tabs: RoutedTab[],
    fallbackTabs?: RoutedTab[]
): string {
    // Split the URL by '/' and filter out any empty strings
    const parts = href.split('/').filter((part) => part !== '');

    const findMatchingTab = (index: number, tabList: RoutedTab[]): string => {
        if (index < 0) {
            return '';
        }

        const currentPart = parts[index];
        const matchingTab = tabList.find((tab) => tab.route === currentPart);
        if (matchingTab) {
            return matchingTab.route;
        }

        return findMatchingTab(index - 1, tabList);
    };

    let matchedRoute = findMatchingTab(parts.length - 1, tabs);

    if (!matchedRoute && fallbackTabs) {
        matchedRoute = findMatchingTab(parts.length - 1, fallbackTabs);
    }

    return matchedRoute;
}

export const RoutedTabs: FC<RoutedTabsProps> = ({
    children,
    tabs,
    fallbackTabs,
    ...props
}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const tabName = useMemo(
        () => getTabNameFromHref(pathname, tabs, fallbackTabs),
        [pathname, tabs, fallbackTabs]
    );

    useEffect(() => {
        if (!tabName && tabs.length > 0 && isFunction(tabs[0].onTabActive)) {
            tabs[0].onTabActive();
            return;
        }

        const currentTab = tabs.find((tab) => tab.route === tabName);
        if (currentTab && isFunction(currentTab.onTabActive)) {
            currentTab.onTabActive();
        }
    }, [tabName, tabs]);

    return (
        <Box
            component="div"
            {...props}
        >
            <Tabs
                value={tabName}
                data-testid="tab-list"
            >
                {tabs.map(
                    ({
                        label,
                        route,
                        tooltip,
                        disabled,
                        onClick,
                        onClickImportant,
                        isLoading,
                    }) => (
                        <Tab
                            key={route}
                            value={route}
                            component={'a'}
                            onClick={() => {
                                if (onClickImportant) {
                                    onClickImportant();
                                }
                                if (disabled || isLoading) {
                                    return;
                                }

                                if (tabName === route) {
                                    return;
                                }

                                if (onClick) {
                                    onClick();
                                    return;
                                }

                                navigate(route);
                            }}
                            data-testid="tab-item"
                            label={
                                <Tooltip
                                    title={tooltip}
                                    data-testid="tab-item-name"
                                >
                                    <span
                                        style={{
                                            padding: '1rem 2rem',
                                        }}
                                    >
                                        {isLoading && (
                                            <CircularProgress
                                                size="0.75rem"
                                                color="secondary"
                                                sx={{ mr: 2 }}
                                            />
                                        )}
                                        {label}
                                    </span>
                                </Tooltip>
                            }
                            sx={{
                                padding: 0,
                                ...(disabled
                                    ? {
                                          cursor: 'not-allowed',
                                          opacity: 0.5,
                                      }
                                    : {}),
                            }}
                        />
                    )
                )}
            </Tabs>
            {children}
        </Box>
    );
};
