import {
    Box,
    Breadcrumbs,
    CircularProgress,
    Divider,
    Link,
    Typography,
} from '@mui/material';
import styles from './PortfolioPage.module.css';
import { Outlet, useNavigate, useParams } from 'react-router';
import { RoutedTab, RoutedTabs } from '../../components/RoutedTabs/RoutedTabs';
import { ROUTES } from '../../const';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import {
    usePortfolioQuery,
    usePortfolioResultSetsQuery,
} from '../../api/queries/portfoliosQuery';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    checkIsDefaultAnalysisRun,
    getComplianceResultSet,
    getEconomicImpactsResultSet,
    getFloodResultSet,
    getPerilsResultSet,
    getPortfolioResultDataVersion,
    getPortfolioResultSetLabel,
    getScoresResultSet,
    isDisclosureAllowedDataVersion,
} from '../../utils';
import { DataNotAvailableTooltip } from '../../components/DataNotAvailableTooltip/DataNotAvailableTooltip';
import {
    dataVersionFromValue,
    IPortfolioItem,
    ResultSetStatus,
} from '../../types';
import oHeap from '../../heap-analytics';
import { AVAILABLE_VIZ, COMPLIANCE_TAB_NO_ACCESS } from '../../const/heap';
import { DashboardFilters } from './DashboardFilters/DashboardFilters';
import { DashboardFilterContextProvider } from '../../context/DashboardFilterProvider';
import { DashboardFiltersTrigger } from './DashboardFilters/DashboardFiltersTrigger';
import { isNil } from 'lodash';
import { useUserContext } from '../../context/UserContextProvider';
import { CreateDisclosureModal } from './Compliance/components/CreateDisclosureModal';
import { useCreatePortfolioDisclosureResultSetMutation } from '../../api/mutations/portfoliosMutation';
import { ResponseError } from '../../api/openapi/auto-generated';
import { useAddAlert } from '../../context/AlertProvider';
import { useFormatMessage } from '../../localization/useFormatMessage';
import { useApi } from '../../api/helpers/useApiHook';

export const PortfolioPage = () => {
    const { appApi } = useApi();
    const formatMessage = useFormatMessage();
    const navigate = useNavigate();
    const { portfolioId } = useParams();
    const { portfolio, isPortfolioLoading } = usePortfolioQuery(portfolioId);
    const { resultSets } = usePortfolioResultSetsQuery({
        portfolio: portfolioId,
    });
    const {
        createPortfolioDisclosureResultSet,
        isPortfolioDisclosureResultSetCreating,
    } = useCreatePortfolioDisclosureResultSetMutation();

    const addAlert = useAddAlert();

    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [isCreateDisclosureModalOpen, setIsCreateDisclosureModalOpen] =
        useState(false);

    const {
        canAccessDisclosureResultSet,
        checkIfUsercanAccessObjectAsAdminOrCreator,
    } = useUserContext();

    const portfolioItem: IPortfolioItem | undefined = useMemo(
        () =>
            portfolio
                ? {
                      ...portfolio,
                      resultSets,
                  }
                : undefined,
        [portfolio, resultSets]
    );

    const perilsResultSet = useMemo(
        () => portfolioItem && getPerilsResultSet(portfolioItem),
        [portfolioItem]
    );

    const eiResultSet = useMemo(
        () => portfolioItem && getEconomicImpactsResultSet(portfolioItem),
        [portfolioItem]
    );

    const scoreResultSet = useMemo(
        () => portfolioItem && getScoresResultSet(portfolioItem),
        [portfolioItem]
    );

    const meshResultSet = useMemo(
        () => portfolioItem && getFloodResultSet(portfolioItem),
        [portfolioItem]
    );

    const PORTFOLIO_TABS: RoutedTab[] = useMemo(
        () => [
            {
                label: formatMessage('portfolio.tabs.overview'),
                route: ROUTES.PORTFOLIO_TABS.OVERVIEW,
                onTabActive: () => {
                    oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                        visualizationType: 'Overview',
                    });
                },
            },
            {
                label: formatMessage('portfolio.tabs.hazard'),
                route: ROUTES.PORTFOLIO_TABS.HAZARD,
                onTabActive: () => {
                    oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                        visualizationType: 'Hazard',
                    });
                },
            },
            {
                label: formatMessage('portfolio.tabs.locations'),
                route: ROUTES.PORTFOLIO_TABS.LOCATIONS,
            },
            {
                label: formatMessage('portfolio.tabs.impacts'),
                route: ROUTES.PORTFOLIO_TABS.IMPACTS,
                onTabActive: () => {
                    oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                        visualizationType: 'Impacts',
                    });
                },
            },
            {
                label: formatMessage('portfolio.tabs.scoring'),
                route: ROUTES.PORTFOLIO_TABS.SCORING,
                onTabActive: () => {
                    oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                        visualizationType: 'Scoring',
                    });
                },
            },
            {
                label: formatMessage('portfolio.tabs.compliance'),
                route: ROUTES.PORTFOLIO_TABS.COMPLIANCE,
                onTabActive: () => {
                    oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                        visualizationType: 'Compliance',
                    });
                },
            },
            {
                label: formatMessage('portfolio.tabs.adaptation'),
                route: ROUTES.PORTFOLIO_TABS.ADAPTATION,
                onTabActive: () => {
                    oHeap.trackCustomEvent(AVAILABLE_VIZ, {
                        visualizationType: 'Adaptation',
                    });
                },
            },
        ],
        [formatMessage]
    );

    const complianceResultSet = useMemo(
        () =>
            portfolioItem &&
            canAccessDisclosureResultSet &&
            getComplianceResultSet(portfolioItem),
        [portfolioItem, canAccessDisclosureResultSet]
    );

    const dataVersion = useMemo(() => {
        if (!portfolioItem) {
            return null;
        }
        return dataVersionFromValue(
            getPortfolioResultDataVersion(portfolioItem)
        );
    }, [portfolioItem]);

    const hasDefaultAnalysisRuns = useMemo(() => {
        if (meshResultSet) {
            // Default run cannot have mesh result-set.
            return false;
        }
        const isPerilsDefault =
            !perilsResultSet ||
            Boolean(eiResultSet) ||
            checkIsDefaultAnalysisRun(perilsResultSet, dataVersion);
        const isEIDefault =
            !eiResultSet || checkIsDefaultAnalysisRun(eiResultSet, dataVersion);
        const isScoreDefault =
            !scoreResultSet ||
            checkIsDefaultAnalysisRun(scoreResultSet, dataVersion);

        return isPerilsDefault && isEIDefault && isScoreDefault;
    }, [
        dataVersion,
        perilsResultSet,
        eiResultSet,
        scoreResultSet,
        meshResultSet,
    ]);

    const canUserAccessObjectAsAdminOrCreator = useMemo(
        () =>
            portfolio?.createdBy &&
            checkIfUsercanAccessObjectAsAdminOrCreator(portfolio.createdBy),
        [portfolio?.createdBy, checkIfUsercanAccessObjectAsAdminOrCreator]
    );

    const handleOpenCreateDisclosureModal = useCallback(() => {
        setIsCreateDisclosureModalOpen(true);
    }, []);

    const handleCloseCreateDisclosureModal = useCallback(() => {
        setIsCreateDisclosureModalOpen(false);
    }, []);

    const handleClickComplianceTabWithoutCSRD = useCallback(() => {
        oHeap.trackCustomEvent(COMPLIANCE_TAB_NO_ACCESS, {
            from: 'portfolio-page',
        });
    }, []);

    const tabs = useMemo(() => {
        return PORTFOLIO_TABS.map((item) =>
            !perilsResultSet &&
            [ROUTES.PORTFOLIO_TABS.HAZARD].includes(item.route)
                ? {
                      ...item,
                      disabled: true,
                      tooltip: <DataNotAvailableTooltip />,
                  }
                : item
        )
            .map((item) =>
                !eiResultSet &&
                [ROUTES.PORTFOLIO_TABS.IMPACTS].includes(item.route)
                    ? {
                          ...item,
                          disabled: true,
                          tooltip: <DataNotAvailableTooltip />,
                      }
                    : item
            )
            .map((item) => {
                const isComplianceTab = [
                    ROUTES.PORTFOLIO_TABS.COMPLIANCE,
                ].includes(item.route);
                if (!isComplianceTab) {
                    return item;
                }
                const isDisclosureNotAvailable = !(
                    isDisclosureAllowedDataVersion(dataVersion) &&
                    hasDefaultAnalysisRuns
                );
                const isDisclosureLoading =
                    complianceResultSet &&
                    complianceResultSet.status === ResultSetStatus.Pending;
                const isDisclosureFailed =
                    complianceResultSet &&
                    complianceResultSet.status === ResultSetStatus.Failed;
                const isDisclosureDisabled =
                    !canUserAccessObjectAsAdminOrCreator ||
                    !canAccessDisclosureResultSet ||
                    isDisclosureNotAvailable ||
                    isDisclosureFailed;
                let disclosureTooltip: React.ReactNode | undefined;
                if (!canUserAccessObjectAsAdminOrCreator) {
                    disclosureTooltip =
                        'You do not have rights to run a Disclosure analysis. Please speak with your admin if you think this is incorrect.';
                } else if (!canAccessDisclosureResultSet) {
                    disclosureTooltip =
                        'This functionality is unavailable with your current subscription. Please contact our support team if you would like to access the Compliance tab.';
                } else if (isDisclosureNotAvailable || isDisclosureFailed) {
                    disclosureTooltip = <DataNotAvailableTooltip />;
                } else if (isDisclosureLoading) {
                    disclosureTooltip = 'Loading';
                }

                return {
                    ...item,
                    disabled: isDisclosureDisabled,
                    tooltip: disclosureTooltip,
                    isLoading: isDisclosureLoading,
                    onClick:
                        complianceResultSet || isDisclosureDisabled
                            ? undefined
                            : handleOpenCreateDisclosureModal,
                    onClickImportant: canAccessDisclosureResultSet
                        ? undefined
                        : handleClickComplianceTabWithoutCSRD,
                };
            })
            .map((item) =>
                !scoreResultSet &&
                [
                    ROUTES.PORTFOLIO_TABS.OVERVIEW,
                    ROUTES.PORTFOLIO_TABS.SCORING,
                ].includes(item.route)
                    ? {
                          ...item,
                          disabled: true,
                          tooltip: <DataNotAvailableTooltip />,
                      }
                    : item
            );
    }, [
        PORTFOLIO_TABS,
        perilsResultSet,
        eiResultSet,
        dataVersion,
        hasDefaultAnalysisRuns,
        complianceResultSet,
        canUserAccessObjectAsAdminOrCreator,
        canAccessDisclosureResultSet,
        handleOpenCreateDisclosureModal,
        handleClickComplianceTabWithoutCSRD,
        scoreResultSet,
    ]);

    const resultSetLabel = useMemo(
        () =>
            portfolio
                ? getPortfolioResultSetLabel({
                      ...portfolio,
                      resultSets,
                  })
                : '',
        [portfolio, resultSets]
    );

    const handleShowHideFilter = useCallback(
        (show?: boolean) => {
            setShowFilters((pre) => (isNil(show) ? !pre : show));
        },
        [setShowFilters]
    );

    const handleCreateDisclosure = useCallback(async () => {
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

        await createPortfolioDisclosureResultSet(
            {
                portfolioId: portfolioItem.id,
                pipelineId: pipeline.id,
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
                            'Run Disclosure Hazard failed, please try again later.',
                            'error'
                        );
                    }
                },
            }
        );
        setIsCreateDisclosureModalOpen(false);
    }, [portfolioItem, createPortfolioDisclosureResultSet, addAlert]);

    useEffect(() => {
        if (
            !isPortfolioLoading &&
            portfolio &&
            portfolio.pipelines?.length === 0
        ) {
            navigate(ROUTES.HOMEPAGE);
        }
    }, [isPortfolioLoading, portfolio, navigate]);

    useEffect(() => {
        const pipelineId = portfolio?.pipelines?.[0]?.id;
        if (!pipelineId) return;

        (window as any).runAdaptationPipeline = () => {
            appApi.appPipelineAppendAdaptationAppRunPipelineIdAdaptationPost({
                pipelineId,
                body: {},
            });
        };
    }, [portfolio, appApi]);

    if (isPortfolioLoading) {
        return (
            <Box
                className={styles.root}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress
                    color="inherit"
                    data-testid="portfolio-overview-circular-progress"
                />
            </Box>
        );
    }

    return (
        <DashboardFilterContextProvider>
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
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        data-testid="portfolio-overview-header"
                    >
                        <Breadcrumbs>
                            <Link
                                component={RouterLink}
                                to="/"
                                underline="hover"
                                variant="body1"
                                display="flex"
                                alignItems="center"
                                data-testid="portfolio-overview-header-breadcrumbs"
                            >
                                <ChevronLeft
                                    size="1rem"
                                    data-testid="header-breadcrumbs-chevron-left-icon"
                                />
                                Home
                            </Link>
                        </Breadcrumbs>
                        <Box
                            display="flex"
                            gap={1}
                            alignItems="end"
                        >
                            <Typography
                                variant="h1"
                                data-testid="portfolio-overview-header-portfolio-name"
                            >
                                {portfolio?.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                data-testid="portfolio-overview-header-analysis-type"
                            >
                                {resultSetLabel}
                            </Typography>
                        </Box>
                    </Box>
                    {portfolioItem && isCreateDisclosureModalOpen && (
                        <CreateDisclosureModal
                            portfolio={portfolioItem}
                            onConfirm={handleCreateDisclosure}
                            onCancel={handleCloseCreateDisclosureModal}
                            isLoading={isPortfolioDisclosureResultSetCreating}
                        />
                    )}
                </Box>

                <Divider />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <RoutedTabs
                        tabs={tabs}
                        data-testid="portfolio-overview-tabs"
                        flexGrow={1}
                    />
                    <Divider orientation="vertical" />
                    <DashboardFiltersTrigger
                        open={showFilters}
                        onClick={handleShowHideFilter}
                    />
                </Box>
                {showFilters && (
                    <>
                        <Divider />
                        <DashboardFilters />
                    </>
                )}
                <Divider />
                <Outlet context={{ portfolioItem }} />
            </Box>
        </DashboardFilterContextProvider>
    );
};
