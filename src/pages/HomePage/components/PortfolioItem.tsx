import {
    ComponentProps,
    FC,
    useCallback,
    useState,
    MouseEvent,
    useMemo,
} from 'react';
import { useNavigate } from 'react-router';
import {
    Typography,
    Chip,
    Menu,
    MenuItem,
    Divider,
    CircularProgress,
    Box,
    useTheme,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import * as Icon from 'react-feather';
import { IPortfolioItem } from '../../../types';
import {
    getWaitTime,
    captureDebugLog,
    downloadFile,
    getPortfolioResultSetLabel,
    highlightsMatches,
    getLocationCountLabel,
} from '../../../utils';
import {
    useDownloadPortfolioMutation,
    useDownloadPortfolioGeocodeLogMutation,
    useDeletePortfolioMutation,
    useUnShareSelfPortfolioMutation,
} from '../../../api/mutations/portfoliosMutation';
import { PORTFOLIO_LOCATIONS_COUNT_LIMIT, ROUTES } from '../../../const';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';
import { StyledCard } from '../../../components/StyledCard/StyledCard';
import { PipelineStatus } from '../../../api/openapi/auto-generated';
import oHeap from '../../../heap-analytics';
import { PortfolioCategories } from '../../../const/PortfolioCategories';
import { PermissionValues } from '../../../types/rolePermissions';
import { useUserSession } from '../../../context/SessionProvider';

interface PortfolioItemProps extends ComponentProps<'div'> {
    portfolio: IPortfolioItem;
    onPortfolioSelect: (portfolio: IPortfolioItem) => void;
    onPortfolioDelete: () => void;
    onPortfolioUnshare?: () => void;
    isSelected: boolean;
    searchText?: string;
    selectedPortfolioCategoryTab: PortfolioCategories | undefined;
    showThreeDotsMenu?: boolean;
}

export const PortfolioItem: FC<PortfolioItemProps> = ({
    portfolio,
    onPortfolioSelect,
    onPortfolioDelete,
    onPortfolioUnshare,
    isSelected,
    searchText,
    selectedPortfolioCategoryTab,
    showThreeDotsMenu = true,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | SVGElement>(null);
    const isMenuOpen = useMemo(() => Boolean(menuAnchorEl), [menuAnchorEl]);
    const [isDeletePortfolioModalOpen, setDeletePortfolioModalOpen] =
        useState<boolean>(false);
    const [isRemovePortfolioModalOpen, setRemovePortfolioModalOpen] =
        useState<boolean>(false);
    const isDisabled = useMemo(
        () =>
            !!portfolio.locationCount &&
            portfolio.locationCount > PORTFOLIO_LOCATIONS_COUNT_LIMIT,
        [portfolio]
    );
    const hasAnalysisData = useMemo(
        () => !!portfolio.pipelines && portfolio.pipelines.length > 0,
        [portfolio]
    );
    const isAnalysisDataFailed = useMemo(
        () =>
            !!portfolio.pipelines?.[0] &&
            portfolio.pipelines[0].status === PipelineStatus.failed,
        [portfolio]
    );

    const { userPermissions } = useUserSession();

    const isMyPortfoliosTab =
        selectedPortfolioCategoryTab === PortfolioCategories.MyPortfolios;
    const isSharedWithMeTab =
        selectedPortfolioCategoryTab ===
        PortfolioCategories.PortfoliosSharedWithMe;
    const isMyTeamsTab =
        selectedPortfolioCategoryTab === PortfolioCategories.MyTeamsPortfolios;
    const hasShareAccess = useMemo(() => {
        const perms = userPermissions ?? [];
        const hasPrivilegedRole =
            perms.includes(PermissionValues.OBJECT_MANAGER) ||
            perms.includes(PermissionValues.OBJECT_ADMINISTRATOR);
        return (
            hasPrivilegedRole && perms.includes(PermissionValues.OBJECT_SHARER)
        );
    }, [userPermissions]);
    const menuDividerSx = {
        borderColor: (theme: Theme) => theme.palette.primary.contrastText,
    };

    const { unshareSelfPortfolio, isUnshareSelfPortfolioLoading } =
        useUnShareSelfPortfolioMutation();

    const { downloadPortfolio, isPortfolioDownloading } =
        useDownloadPortfolioMutation();
    const { downloadPortfolioGeocodeLog, isPortfolioGeocodeLogDownloading } =
        useDownloadPortfolioGeocodeLogMutation();
    const { deletePortfolio, isPortfolioDeleting } =
        useDeletePortfolioMutation();

    const handleOpenMenu = useCallback((event: MouseEvent<SVGElement>) => {
        setMenuAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleClick = useCallback(() => {
        onPortfolioSelect(portfolio);
    }, [portfolio, onPortfolioSelect]);

    const resultSetCreateAt = portfolio.pipelines?.[0]?.createdAt || null;
    const isResultSetPending =
        portfolio.pipelines?.[0]?.status === PipelineStatus.pending;

    const waitTime = useMemo(
        () => getWaitTime(portfolio.locationCount),
        [portfolio]
    );

    const resultSetLabel = useMemo(
        () => getPortfolioResultSetLabel(portfolio),
        [portfolio]
    );

    const trackMenuEvents = useCallback((label: string) => {
        oHeap.trackCustomEvent(`Clicked on ${label}`, {
            from: 'portfolio',
        });
    }, []);

    const handleEdit = useCallback(() => {
        trackMenuEvents('Edit Settings & Analysis');
        navigate(
            ROUTES.EDIT_PORTFOLIO_PAGE.replace(':portfolioId', portfolio.id)
        );
    }, [trackMenuEvents, navigate, portfolio]);

    const handleDuplicate = useCallback(() => {
        trackMenuEvents('Duplicate');
        navigate(
            ROUTES.DUPLICATE_PORTFOLIO_PAGE.replace(
                ':portfolioId',
                portfolio.id
            )
        );
    }, [trackMenuEvents, navigate, portfolio]);

    const handleShareSettings = useCallback(() => {
        trackMenuEvents('Share Settings');
        navigate(
            ROUTES.PORTFOLIO_SHARING_WITH_PORTFOLIO_ID.replace(
                ':portfolioId',
                portfolio.id
            )
        );
    }, [trackMenuEvents, navigate, portfolio]);

    const handleDownload = useCallback(async () => {
        trackMenuEvents('Download');
        const fileLinks = await downloadPortfolio(portfolio.id);
        fileLinks.forEach((fileLink) => {
            downloadFile(fileLink.url, fileLink.filename);
        });

        handleCloseMenu();
    }, [trackMenuEvents, portfolio, downloadPortfolio, handleCloseMenu]);

    const handleDownloadGeocodeLog = useCallback(async () => {
        trackMenuEvents('Download Geocode Log');
        const fileLinks = await downloadPortfolioGeocodeLog(portfolio.id);
        fileLinks.forEach((fileLink) => {
            downloadFile(fileLink.url, fileLink.filename);
        });

        handleCloseMenu();
    }, [
        trackMenuEvents,
        portfolio,
        downloadPortfolioGeocodeLog,
        handleCloseMenu,
    ]);

    const handleCopyDebugLog = useCallback(() => {
        trackMenuEvents('Copy Debug Log');
        captureDebugLog(portfolio, 'Portfolio Data');
        handleCloseMenu();
    }, [trackMenuEvents, portfolio, handleCloseMenu]);

    const handleDelete = useCallback(() => {
        trackMenuEvents('Delete');
        setDeletePortfolioModalOpen(true);
        handleCloseMenu();
    }, [trackMenuEvents, handleCloseMenu]);

    const handleDeleteConfirm = useCallback(async () => {
        await deletePortfolio(portfolio.id);
        onPortfolioDelete();
        setDeletePortfolioModalOpen(false);
    }, [portfolio, deletePortfolio, onPortfolioDelete]);

    const handleDeleteCancel = useCallback(() => {
        setDeletePortfolioModalOpen(false);
    }, []);

    const handleUnlinkPortfolio = useCallback(async () => {
        setRemovePortfolioModalOpen(true);
        handleCloseMenu();
    }, [handleCloseMenu]);

    const handleUnlinkPortfolioConfirm = useCallback(async () => {
        await unshareSelfPortfolio(portfolio.id);
        onPortfolioUnshare && onPortfolioUnshare();
        setRemovePortfolioModalOpen(false);
    }, [unshareSelfPortfolio, portfolio, onPortfolioUnshare]);

    const handleUnlinkPortfolioCancel = useCallback(() => {
        setRemovePortfolioModalOpen(false);
        handleCloseMenu();
    }, [handleCloseMenu]);

    return (
        <StyledCard
            handleClick={handleClick}
            isSelected={isSelected}
            isDisabled={isDisabled}
            tooltip={
                isDisabled
                    ? 'CSG App supports portfolios of 10K or lower locations'
                    : ''
            }
            style={{
                minHeight: '7.3125rem',
            }}
            data-testid="portfolio-item"
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap={2}
                alignSelf="stretch"
                flex={1}
                data-testid="portfolio-item-info"
            >
                <Typography
                    variant="h4"
                    color={isDisabled ? 'text.secondary' : 'common.white'}
                    data-testid="portfolio-item-name"
                >
                    {highlightsMatches(
                        portfolio.name,
                        searchText,
                        theme.palette.secondary.main
                    )}
                </Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    alignSelf="stretch"
                >
                    <Typography
                        variant="body2"
                        color={
                            hasAnalysisData && !isAnalysisDataFailed
                                ? 'text.secondary'
                                : 'error.light'
                        }
                        data-testid="portfolio-item-analysis-type"
                    >
                        {resultSetLabel}
                    </Typography>
                    {!resultSetCreateAt ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            data-testid="portfolio-item-created-at"
                        >
                            Created&nbsp;
                            {portfolio?.createdAt instanceof Date
                                ? portfolio.createdAt.toLocaleDateString()
                                : portfolio?.createdAt?.toString()}
                        </Typography>
                    ) : !isResultSetPending ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            data-testid="portfolio-item-created-at-date"
                        >
                            Created {resultSetCreateAt?.toLocaleDateString()}
                        </Typography>
                    ) : (
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            data-testid="portfolio-item-loading"
                        >
                            <Typography
                                variant="body2"
                                data-testid="portfolio-item-loading-text"
                            >
                                Loading
                            </Typography>
                            <CircularProgress
                                color="secondary"
                                size="0.625rem"
                                data-testid="portfolio-item-loading-progress-icon"
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                data-testid="portfolio-item-loading-estimated-time-text"
                            >
                                Est. wait time {waitTime[0]} to {waitTime[1]}{' '}
                                minutes
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-end"
                alignSelf="stretch"
            >
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    gap={1.5}
                >
                    <Typography
                        variant="body2"
                        color={isDisabled ? 'error.light' : 'text.secondary'}
                        data-testid="portfolio-item-location-qty"
                    >
                        {getLocationCountLabel(portfolio.locationCount)}
                    </Typography>

                    {showThreeDotsMenu && (
                        <Icon.MoreVertical
                            size="1.25rem"
                            onClick={handleOpenMenu}
                            data-testid="portfolio-item-menu-icon"
                        />
                    )}

                    <Menu
                        id="basic-menu"
                        anchorEl={menuAnchorEl}
                        open={isMenuOpen}
                        onClose={handleCloseMenu}
                        data-testid="portfolio-item-menu"
                    >
                        <Box>
                            {isSharedWithMeTab && (
                                <Box>
                                    <MenuItem
                                        onClick={handleUnlinkPortfolio}
                                        data-testid="portfolio-item-menu-remove-portfolio-from-my-view"
                                    >
                                        Remove Portfolio from my view
                                    </MenuItem>
                                    <Divider sx={menuDividerSx} />
                                </Box>
                            )}

                            {isMyTeamsTab && hasShareAccess && (
                                <Box>
                                    <MenuItem
                                        onClick={handleShareSettings}
                                        data-testid="portfolio-item-menu-share-settings"
                                    >
                                        Share Settings
                                    </MenuItem>
                                    <Divider sx={menuDividerSx} />
                                </Box>
                            )}

                            {isMyPortfoliosTab && (
                                <Box>
                                    <MenuItem
                                        onClick={handleEdit}
                                        data-testid="portfolio-item-menu-edit"
                                    >
                                        Edit Settings & Analysis
                                    </MenuItem>
                                    <MenuItem
                                        disabled={isPortfolioDownloading}
                                        onClick={handleDownload}
                                        data-testid="portfolio-item-menu-download"
                                    >
                                        {isPortfolioDownloading
                                            ? 'Downloading'
                                            : 'Download'}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleDuplicate}
                                        data-testid="portfolio-item-menu-duplicate"
                                    >
                                        Duplicate
                                    </MenuItem>
                                    <MenuItem
                                        disabled={isPortfolioDeleting}
                                        onClick={handleDelete}
                                        data-testid="portfolio-item-menu-delete"
                                    >
                                        {isPortfolioDeleting
                                            ? 'Deleting'
                                            : 'Delete'}
                                    </MenuItem>
                                    {hasShareAccess && (
                                        <Box>
                                            <Divider sx={menuDividerSx} />
                                            <MenuItem
                                                onClick={handleShareSettings}
                                                data-testid="portfolio-item-menu-share-settings"
                                            >
                                                Share Settings
                                            </MenuItem>
                                        </Box>
                                    )}
                                    <Divider sx={menuDividerSx} />

                                    <MenuItem
                                        disabled={
                                            isPortfolioGeocodeLogDownloading
                                        }
                                        onClick={handleDownloadGeocodeLog}
                                        data-testid="portfolio-item-menu-download-geocode-log"
                                    >
                                        {isPortfolioGeocodeLogDownloading
                                            ? 'Downloading'
                                            : 'Download Geocode Log'}
                                    </MenuItem>
                                </Box>
                            )}

                            <MenuItem
                                onClick={handleCopyDebugLog}
                                data-testid="portfolio-item-menu-copy-debug-log"
                            >
                                Copy Debug Log
                            </MenuItem>
                        </Box>
                    </Menu>
                </Box>
                {portfolio.category && (
                    <Chip
                        label={
                            <Typography
                                component="span"
                                data-testid="portfolio-item-category"
                            >
                                {highlightsMatches(
                                    portfolio.category,
                                    searchText,
                                    theme.palette.secondary.main
                                )}
                            </Typography>
                        }
                    />
                )}
            </Box>

            {isDeletePortfolioModalOpen && (
                <ConfirmModal
                    title="Delete Portfolio"
                    message="Are you sure you want to delete this portfolio and its associated locations? This action cannot be undone."
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    confirmLabel="Delete"
                    isLoading={isPortfolioDeleting}
                    isDisabled={isPortfolioDeleting}
                    data-testid="portfolio-item-c"
                />
            )}

            {isRemovePortfolioModalOpen && (
                <ConfirmModal
                    title="Remove Portfolio"
                    message="Are you sure you want to remove this portfolio from your shared view? This action cannot be undone."
                    onConfirm={handleUnlinkPortfolioConfirm}
                    onCancel={handleUnlinkPortfolioCancel}
                    confirmLabel="Remove"
                    isLoading={isUnshareSelfPortfolioLoading}
                    isDisabled={isUnshareSelfPortfolioLoading}
                    data-testid="portfolio-item-c"
                />
            )}
        </StyledCard>
    );
};
