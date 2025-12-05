import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Divider,
    Link,
    Typography,
} from '@mui/material';
import styles from './LocationPage.module.css';
import { Link as RouterLink } from 'react-router-dom';
import * as Icon from 'react-feather';
import { Outlet, useParams } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    DEFAULT_MESH_RESULT_SET_OPTIONS,
    FLOOD_MESH_LOCATION_COUNT_LIMIT,
    PORTFOLIO_REFREST_TIMEOUT,
    ROUTES,
} from '../../const';
import {
    usePortfolioQuery,
    usePortfolioResultSetsQuery,
} from '../../api/queries/portfoliosQuery';
import { RoutedTab, RoutedTabs } from '../../components/RoutedTabs/RoutedTabs';
import { useLocationsQuery } from '../../api/queries/locationsQuery';
import {
    dataVersionFromValue,
    ILocationExtra,
    IPortfolioItem,
    ResultSetStatus,
} from '../../types';
import {
    getPerilsResultSet,
    getScoresResultSet,
    checkIsDownloadSLRDisabled,
    getDefaultPortfolioPageUrl,
    currencyValueFormatter,
    getFloodResultSet,
    getPortfolioResultDataVersion,
} from '../../utils';
import {
    useCreatePortfolioFloodMeshResultSetMutation,
    useDownloadPortfolioSLRMutation,
    useDownloadSLRFilesMutation,
} from '../../api/mutations/portfoliosMutation';
import {
    CreateSingleLocationReportInput,
    MeshType,
    ResponseError,
} from '../../api/openapi/auto-generated';
import { useAddAlert } from '../../context/AlertProvider';
import { DownloadSLRModal } from '../HomePage/components/DownloadSLRModal';
import { DataNotAvailableTooltip } from '../../components/DataNotAvailableTooltip/DataNotAvailableTooltip';
import { CreateFloodMeshModal } from './FloodMesh/components/CreateFloodMeshModal';
import { FLOOD_MESH_FIXED_SIZE } from '../PortfolioEditingPages/const/floodMesh';
import oHeap from '../../heap-analytics';
import { AVAILABLE_VIZ } from '../../const/heap';
import { useUserContext } from '../../context/UserContextProvider';

const LOCATION_TABS: RoutedTab[] = [
    {
        label: 'Hazard',
        route: ROUTES.LOCATION_TABS.HAZARD,
        onTabActive: () => {
            oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                visualizationType: 'Single-Location Hazard',
            });
        },
    },
    {
        label: 'Damage & Loss',
        route: ROUTES.LOCATION_TABS.DAMAGE_AND_LOSS,
        onTabActive: () => {
            oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                visualizationType: 'Single-Location Damage & Loss',
            });
        },
    },
    {
        label: 'Financial Metrics',
        route: ROUTES.LOCATION_TABS.FINANCIAL_METRICS,
        onTabActive: () => {
            oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                visualizationType: 'Single-Location Financial Metrics',
            });
        },
    },
];

export const LocationPage = () => {
    const { portfolioId, locationId } = useParams();
    const { portfolio, isPortfolioLoading } = usePortfolioQuery(portfolioId);
    const { locations, isLocationsLoading } = useLocationsQuery({
        portfolioId,
    });
    const { resultSets, isResultSetsLoading, refetchResultSets } =
        usePortfolioResultSetsQuery({
            portfolio: portfolioId,
        });

    const addAlert = useAddAlert();
    const { checkIfUsercanAccessObjectAsAdminOrCreator } = useUserContext();
    const [isDownloadSLRModalOpen, setIsDownloadSLRModalOpen] = useState(false);
    const [isCreateFloodMeshModalOpen, setIsCreateFloodMeshModalOpen] =
        useState(false);
    const { downloadPortfolioSLR, isPortfolioSLRDownloading } =
        useDownloadPortfolioSLRMutation();
    const { downloadSLRFiles, isSLRFilesDownloading } =
        useDownloadSLRFilesMutation();
    const {
        createPortfolioFloodMeshResultSet,
        isPortfolioFloodMeshResultSetCreating,
    } = useCreatePortfolioFloodMeshResultSetMutation();

    const portfolioItem: IPortfolioItem | undefined = useMemo(() => {
        if (!portfolio) {
            return undefined;
        }

        return {
            ...portfolio,
            resultSets,
        };
    }, [portfolio, resultSets]);

    const perilsResultSet = useMemo(
        () => portfolioItem && getPerilsResultSet(portfolioItem),
        [portfolioItem]
    );

    const scoresResultSet = useMemo(
        () => portfolioItem && getScoresResultSet(portfolioItem),
        [portfolioItem]
    );

    const floodResultSet = useMemo(
        () => portfolioItem && getFloodResultSet(portfolioItem),
        [portfolioItem]
    );

    const isDownloadSLRDisabled = useMemo(
        () => checkIsDownloadSLRDisabled(perilsResultSet, scoresResultSet),
        [perilsResultSet, scoresResultSet]
    );

    const canUserAccessObjectAsAdminOrCreator = useMemo(
        () =>
            portfolio?.createdBy &&
            checkIfUsercanAccessObjectAsAdminOrCreator(portfolio.createdBy),
        [portfolio?.createdBy, checkIfUsercanAccessObjectAsAdminOrCreator]
    );

    const handleOpenDownloadSLRModal = useCallback(() => {
        setIsDownloadSLRModalOpen(true);
    }, []);

    const handleCloseDownloadSLRModal = useCallback(() => {
        setIsDownloadSLRModalOpen(false);
    }, []);

    const handleOpenCreateFloodMeshModal = useCallback(() => {
        setIsCreateFloodMeshModalOpen(true);
    }, []);

    const handleCloseCreateFloodMeshModal = useCallback(() => {
        setIsCreateFloodMeshModalOpen(false);
    }, []);

    const locationTabs = useMemo(() => {
        const tabs: RoutedTab[] = [
            ...LOCATION_TABS.map((item) => ({
                ...item,
                disabled: !perilsResultSet,
                tooltip: perilsResultSet ? undefined : (
                    <DataNotAvailableTooltip />
                ),
            })),
        ];

        const isFloodMeshNotAvailable =
            !portfolio ||
            !portfolio.locationCount ||
            portfolio.locationCount > FLOOD_MESH_LOCATION_COUNT_LIMIT;
        const isFloodMeshLoading =
            floodResultSet && floodResultSet.status === ResultSetStatus.Pending;
        const isFloodMeshFailed =
            floodResultSet && floodResultSet.status === ResultSetStatus.Failed;
        const isFloodMeshDisabled =
            !canUserAccessObjectAsAdminOrCreator ||
            isFloodMeshNotAvailable ||
            isFloodMeshFailed;
        let floodMeshTooltip: React.ReactNode | undefined;
        if (!canUserAccessObjectAsAdminOrCreator) {
            floodMeshTooltip =
                'You do not have rights to run a Flood Mesh analysis. Please speak with your admin if you think this is incorrect.';
        } else if (isFloodMeshNotAvailable) {
            floodMeshTooltip =
                'Please select a portfolio with 50 or fewer locations to run a Flood Mesh analysis.';
        } else if (isFloodMeshLoading) {
            floodMeshTooltip = 'Loading';
        } else if (isFloodMeshFailed) {
            floodMeshTooltip = <DataNotAvailableTooltip />;
        }

        tabs.push({
            label: 'Flood Mesh',
            route: ROUTES.LOCATION_TABS.FLOOD_MESH,
            disabled: isFloodMeshDisabled,
            tooltip: floodMeshTooltip,
            isLoading: isFloodMeshLoading,
            onClick:
                floodResultSet || isFloodMeshDisabled
                    ? undefined
                    : handleOpenCreateFloodMeshModal,
            onTabActive: () => {
                oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                    visualizationType: 'Single-Location Flood Mesh',
                });
            },
        });

        return tabs;
    }, [
        portfolio,
        floodResultSet,
        perilsResultSet,
        handleOpenCreateFloodMeshModal,
    ]);

    const handleDownloadSLR = useCallback(
        async (
            createSingleLocationReportInput: CreateSingleLocationReportInput
        ) => {
            try {
                const slrResponse = await downloadPortfolioSLR(
                    createSingleLocationReportInput
                );
                if (
                    Array.isArray(slrResponse?.files) &&
                    slrResponse.files.length > 0
                ) {
                    await downloadSLRFiles(
                        slrResponse.files.map(({ fileId, filename }) => ({
                            fileId,
                            filename,
                        }))
                    );
                } else {
                    addAlert('No SLR files available for download.', 'warning');
                }
            } catch (error) {
                try {
                    const { detail } = await (
                        error as ResponseError
                    ).response.json();
                    addAlert(detail.detail, 'error');
                } catch (err) {
                    addAlert('Export failed, please try again later.', 'error');
                }
            }
            setIsDownloadSLRModalOpen(false);
        },
        [downloadPortfolioSLR, downloadSLRFiles, addAlert]
    );

    const handleCreateFloodMesh = useCallback(
        async ({ type }: { type: MeshType }) => {
            if (!portfolioItem) {
                return;
            }

            const dataVersion = dataVersionFromValue(
                getPortfolioResultDataVersion(portfolioItem)
            );

            if (!dataVersion) {
                return;
            }

            const { pipelines } = portfolioItem;
            const [pipeline] = pipelines || [];

            if (!pipeline) {
                return;
            }

            await createPortfolioFloodMeshResultSet(
                {
                    portfolioId: portfolioItem.id,
                    pipelineId: pipeline.id,
                    meshResultSetOptions: {
                        ...DEFAULT_MESH_RESULT_SET_OPTIONS[dataVersion],
                        perils: undefined,
                        floodDefense: {
                            enabled: true,
                            zeroOutDefendedLocations: true,
                        },
                        mesh: {
                            type: type,
                            width:
                                type === MeshType.fixed
                                    ? FLOOD_MESH_FIXED_SIZE
                                    : undefined,
                            height:
                                type === MeshType.fixed
                                    ? FLOOD_MESH_FIXED_SIZE
                                    : undefined,
                        },
                    },
                },
                {
                    onError: async (error) => {
                        try {
                            const { detail } = await (
                                error as ResponseError
                            ).response.json();

                            addAlert(detail.detail, 'error');
                        } catch (err) {
                            addAlert(
                                'Run Flood Mesh failed, please try again later.',
                                'error'
                            );
                        }
                    },
                }
            );
            setIsCreateFloodMeshModalOpen(false);
        },
        [portfolioItem, createPortfolioFloodMeshResultSet, addAlert]
    );

    const portfolioOverviewPageUrl = useMemo(
        () => (portfolioItem ? getDefaultPortfolioPageUrl(portfolioItem) : ''),
        [portfolioItem]
    );

    const portfolioLocationsTabsUrl = useMemo(() => {
        if (
            portfolioOverviewPageUrl.includes(
                `/${ROUTES.PORTFOLIO_TABS.LOCATIONS}`
            )
        ) {
            return portfolioOverviewPageUrl;
        }

        return portfolioOverviewPageUrl + '/' + ROUTES.PORTFOLIO_TABS.LOCATIONS;
    }, [portfolioOverviewPageUrl]);

    const location = useMemo(
        () => locations.find(({ id }) => id === Number(locationId)) || null,
        [locations, locationId]
    );

    const locationName = useMemo(() => {
        if (!location || !location.extras) {
            return null;
        }

        return (location.extras as ILocationExtra).locationName;
    }, [location]);

    const locationAddress = useMemo(() => {
        if (!location) {
            return null;
        }

        if (!location.extras) {
            return `${location.geometry.latitude}, ${location.geometry.longitude}`;
        }

        const locationExtras = location.extras as ILocationExtra;

        return [
            locationExtras.streetAddress
                ? locationExtras.streetAddress
                : `${location.geometry.latitude}, ${location.geometry.longitude}`,
            locationExtras.cityName,
            locationExtras.admin1Code,
            locationExtras.postalCode,
            locationExtras.countryCodeISO2A,
        ]
            .filter(Boolean)
            .join(', ');
    }, [location]);

    const locationRetail = useMemo(() => {
        if (!location || !location.extras) {
            return null;
        }

        const locationExtras = location.extras as ILocationExtra;

        return [
            locationExtras.occupancyScheme,
            locationExtras.occupancyCode,
            locationExtras.occupancyName,
            locationExtras.totalValue
                ? currencyValueFormatter({
                      value: locationExtras.totalValue,
                      currencyCode: locationExtras.valueCurrencyCode,
                  })
                : null,
        ]
            .filter(Boolean)
            .join(' ');
    }, [location]);

    const locationSubTitle = useMemo(
        () => [locationAddress, locationRetail].filter(Boolean).join(' | '),
        [locationAddress, locationRetail]
    );

    const hasPendingResultSets = useMemo(
        () =>
            !!resultSets.find(
                ({ status }) => status === ResultSetStatus.Pending
            ),
        [resultSets]
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetchResultSets();
        }, PORTFOLIO_REFREST_TIMEOUT);

        if (!hasPendingResultSets) {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [hasPendingResultSets, refetchResultSets]);

    if (
        isPortfolioLoading ||
        isLocationsLoading ||
        isResultSetsLoading ||
        !location
    ) {
        return (
            <Box
                className={styles.root}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress color="inherit" />
            </Box>
        );
    }

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
                px={3}
                py={1}
                data-testid="location-header"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Breadcrumbs data-testid="location-breadcrumbs">
                        <Link
                            component={RouterLink}
                            to="/"
                            underline="hover"
                            variant="body1"
                            display="flex"
                            alignItems="center"
                            data-testid="location-breadcrumbs-home"
                        >
                            <Icon.ChevronLeft
                                size="1rem"
                                data-testid="breadcrumbs-chevron-left-icon"
                            />
                            Home
                        </Link>
                        <Link
                            component={RouterLink}
                            to={portfolioOverviewPageUrl}
                            underline="hover"
                            variant="body1"
                            display="flex"
                            alignItems="center"
                            data-testid="breadcrumbs-portfolio-name"
                        >
                            {isPortfolioLoading ? '..' : portfolio?.name}
                        </Link>
                        <Link
                            component={RouterLink}
                            to={portfolioLocationsTabsUrl}
                            underline="hover"
                            variant="body1"
                            display="flex"
                            alignItems="center"
                            data-testid="breadcrumbs-locations"
                        >
                            Locations
                        </Link>
                    </Breadcrumbs>
                    <Box
                        display="flex"
                        gap={1}
                        alignItems="end"
                        data-testid="location-info"
                    >
                        <Typography
                            variant="h1"
                            data-testid="location-id-name"
                        >
                            #{locationId}
                            {locationName ? ` - ${locationName}` : ''}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            data-testid="location-coordinates"
                        >
                            {locationSubTitle}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    display="flex"
                    gap={2}
                >
                    <Button
                        disabled={isDownloadSLRDisabled}
                        variant="outlined"
                        endIcon={
                            <Icon.Download
                                size="1rem"
                                data-testid="location-report-button-icon"
                            />
                        }
                        onClick={handleOpenDownloadSLRModal}
                        data-testid="location-report-button"
                    >
                        Report
                    </Button>

                    {portfolioItem && isDownloadSLRModalOpen && (
                        <DownloadSLRModal
                            portfolio={portfolioItem}
                            locationId={locationId}
                            onConfirm={handleDownloadSLR}
                            onCancel={handleCloseDownloadSLRModal}
                            isLoading={
                                isPortfolioSLRDownloading ||
                                isSLRFilesDownloading
                            }
                        />
                    )}

                    {portfolioItem && isCreateFloodMeshModalOpen && (
                        <CreateFloodMeshModal
                            portfolio={portfolioItem}
                            onConfirm={handleCreateFloodMesh}
                            onCancel={handleCloseCreateFloodMeshModal}
                            isLoading={isPortfolioFloodMeshResultSetCreating}
                        />
                    )}
                </Box>
            </Box>
            <Divider />
            <RoutedTabs
                tabs={locationTabs}
                data-testid="location-tabs"
            />
            <Divider />
            <Outlet />
        </Box>
    );
};
