import {
    Box,
    Button,
    CircularProgress,
    List,
    Typography,
    Divider,
    Tooltip,
    useTheme,
} from '@mui/material';
import styles from './HomePage.module.css';
import { useCallback, useEffect, useMemo, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router';
import {
    MAX_LIST_API_LIMIT,
    PORTFOLIO_LOCATIONS_COUNT_LIMIT,
    PORTFOLIO_REFREST_TIMEOUT,
    ROUTES,
    STD_LIST_API_LIMIT,
} from '../../const';
import {
    usePortfolioResultSetsQuery,
    usePortfoliosQuery,
} from '../../api/queries/portfoliosQuery';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import { Virtuoso, Components, ListProps } from 'react-virtuoso';
import { PortfolioItem } from './components/PortfolioItem';
import { useCategoriesQuery } from '../../api/queries/categoriesQuery';
import { IPortfolioItem, ResultSetStatus } from '../../types';
import {
    getDefaultPortfolioPageUrl,
    getLocationCountLabel,
    getPortfolioResultSetLabel,
} from '../../utils';
import { PortfolioInfo } from './components/PortfolioInfo';
import { PortfolioExportMenu } from './components/PortfolioExportMenu';
import { PortfolioMap } from './components/PortfolioMap';
import { PortfolioWithoutAnalysisDataModal } from '../../components/PortfolioWithoutAnalysisDataModal/PortfolioWithoutAnalysisDataModal';
import { PipelineStatus } from '../../api/openapi/auto-generated';
import { useAnalysisDataNotice } from '../../context/AnalysisDataNoticeProvider';
import oHeap from '../../heap-analytics';
import { LAUNCH_BTN } from '../../const/heap';
import { PortfolioExtendedMenu } from './components/PortfolioExtendedMenu';
import { LoadingButton } from '@mui/lab';
import PortfolioCategoriesTab from '../../components/PortfolioCategoriesTab/PortfolioCategoriesTab';
import { useUserContext } from '../../context/UserContextProvider';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { useFormatMessage } from '../../localization/useFormatMessage';
import {
    PORTFOLIO_CATEGORIES_PARAMETER,
    PortfolioCategories,
} from '../../const/PortfolioCategories';
import { SearchBar } from '../../components/Inputs/SearchBar';

const initialFormValues = {
    search: '',
};

export const portfolioListComponents: Components<IPortfolioItem> = {
    List: forwardRef<HTMLDivElement, ListProps>(
        ({ children, ...props }, ref) => (
            <div
                ref={ref}
                {...props}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    ...props.style,
                }}
            >
                {children}
            </div>
        )
    ),
};

export const HomePage = () => {
    const formatMessage = useFormatMessage();
    const theme = useTheme();
    const [selectedPortfolioCategoryTab, setSelectedPortfolioCategoryTab] =
        useState<PortfolioCategories | undefined>();
    const isNoAnalysisDataHidden: boolean = useAnalysisDataNotice();
    const [
        isPortfolioWithoutAnalysisDataModalOpen,
        setIsPortfolioWithoutAnalysisDataModalOpen,
    ] = useState(false);
    const [
        wasPortfolioWithoutAnalysisDataModalShown,
        setWasPortfolioWithoutAnalysisDataModalShown,
    ] = useState(false);

    const {
        isPermissionsLoading,
        isPortfolioCreator,
        isPortfolioAdministrator,
        isPortfolioSharingEnabled,
        hasPortfolioAccessPermissions,
    } = useUserContext();

    const {
        portfolios,
        hasMorePortfolios,
        isPortfoliosLoading,
        isMorePortfoliosLoading,
        fetchNextPortfolios,
        refetchPortfolios,
    } = usePortfoliosQuery({
        limit: STD_LIST_API_LIMIT,
        listingMode: selectedPortfolioCategoryTab
            ? PORTFOLIO_CATEGORIES_PARAMETER[selectedPortfolioCategoryTab]
            : undefined,
    });

    const { categories, isCategoriesLoading } = useCategoriesQuery({
        limit: MAX_LIST_API_LIMIT,
    });
    const [selectedPortfolio, setSelectedPortfolio] = useState<
        IPortfolioItem | undefined
    >();
    const { resultSets, isResultSetsLoading, refetchResultSets } =
        usePortfolioResultSetsQuery({
            portfolio: selectedPortfolio?.id,
        });
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = formik;

    const PORTFOLIO_CATEGORIES = useMemo(
        () => [
            {
                name: formatMessage('home.my_portfolio.tab_name'),
                value: PortfolioCategories.MyPortfolios,
                isVisible: isPortfolioCreator,
                emptyPortfoliosStateDescription: formatMessage(
                    'home.my_portfolio.empty'
                ),
            },
            {
                name: formatMessage('home.shared_with_me.tab_name'),
                value: PortfolioCategories.PortfoliosSharedWithMe,
                isVisible: hasPortfolioAccessPermissions, // Always visible
                emptyPortfoliosStateDescription: formatMessage(
                    'home.shared_with_me.empty'
                ),
            },
            {
                name: formatMessage('home.team_portfolios.tab_name'),
                value: PortfolioCategories.MyTeamsPortfolios,
                isVisible: isPortfolioAdministrator,
                emptyPortfoliosStateDescription: formatMessage(
                    'home.team_portfolios.empty'
                ),
            },
        ],
        [
            formatMessage,
            hasPortfolioAccessPermissions,
            isPortfolioCreator,
            isPortfolioAdministrator,
        ]
    );

    const preparedPortfolios: IPortfolioItem[] = useMemo(
        () =>
            (portfolios ?? [])
                .map((portfolio) => {
                    const category = portfolio.category
                        ? categories.find(
                              (category) => category.id === portfolio.category
                          )
                        : null;

                    return {
                        ...portfolio,
                        category: category?.name ?? '',
                        resultSets: resultSets.filter(
                            (resultSet) => resultSet.portfolio === portfolio.id
                        ),
                    };
                })
                .sort((portfolioA, portfolioB) => {
                    const portfolioADate =
                        portfolioA.pipelines?.[0]?.createdAt ??
                        portfolioA.createdAt;
                    const portfolioBDate =
                        portfolioB.pipelines?.[0]?.createdAt ??
                        portfolioB.createdAt;

                    return +portfolioBDate - +portfolioADate;
                }),
        [portfolios, categories, resultSets]
    );

    const filteredPortfolios = useMemo(
        () =>
            preparedPortfolios.filter(
                (portfolio) =>
                    !formik.values.search ||
                    portfolio.name
                        ?.toLowerCase()
                        .includes(formik.values.search.toLowerCase()) ||
                    portfolio.category
                        ?.toLowerCase()
                        .includes(formik.values.search.toLowerCase())
            ),
        [preparedPortfolios, formik.values.search]
    );

    const hasPendingPortfolios = useMemo(
        () =>
            !!portfolios.find(
                ({ pipelines }) =>
                    !!pipelines &&
                    !!pipelines[0] &&
                    pipelines[0].status === PipelineStatus.pending
            ) ||
            !!resultSets.find(
                ({ status }) => status === ResultSetStatus.Pending
            ),
        [portfolios, resultSets]
    );

    const emptyPortfoliosStateDescription = useMemo(() => {
        return PORTFOLIO_CATEGORIES.find(
            (category) => category.value === selectedPortfolioCategoryTab
        )?.emptyPortfoliosStateDescription;
    }, [selectedPortfolioCategoryTab, PORTFOLIO_CATEGORIES]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetchPortfolios();
            refetchResultSets();
        }, PORTFOLIO_REFREST_TIMEOUT);

        if (!hasPendingPortfolios) {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [hasPendingPortfolios, refetchPortfolios, refetchResultSets]);

    useEffect(() => {
        if (selectedPortfolioCategoryTab || isPermissionsLoading) {
            return;
        }
        if (!isPortfolioSharingEnabled) {
            setSelectedPortfolioCategoryTab(PORTFOLIO_CATEGORIES[0].value);
            return;
        }
        const visibleTabs = PORTFOLIO_CATEGORIES.filter(
            (category) => category.isVisible
        );
        if (visibleTabs.length > 0) {
            setSelectedPortfolioCategoryTab(visibleTabs[0].value); // Set to the first visible tab
        }
    }, [
        PORTFOLIO_CATEGORIES,
        selectedPortfolioCategoryTab,
        isPortfolioSharingEnabled,
        isPermissionsLoading,
    ]);

    useEffect(() => {
        if (
            isPortfoliosLoading ||
            isResultSetsLoading ||
            preparedPortfolios.length === 0 ||
            !!selectedPortfolio
        ) {
            return;
        }

        const availablePortfolios = preparedPortfolios.filter(
            ({ locationCount }) =>
                !locationCount ||
                locationCount <= PORTFOLIO_LOCATIONS_COUNT_LIMIT
        );
        setSelectedPortfolio(availablePortfolios[0]);
    }, [
        isPortfoliosLoading,
        isResultSetsLoading,
        preparedPortfolios,
        selectedPortfolio,
    ]);

    useEffect(() => {
        if (isNoAnalysisDataHidden) {
            return;
        }

        if (isPortfoliosLoading || preparedPortfolios.length === 0) {
            return;
        }

        if (wasPortfolioWithoutAnalysisDataModalShown) {
            return;
        }

        if (
            preparedPortfolios.filter(
                ({ pipelines }) => !pipelines || !pipelines.length
            ).length > 0
        ) {
            setIsPortfolioWithoutAnalysisDataModalOpen(true);
            setWasPortfolioWithoutAnalysisDataModalShown(true);
        }
    }, [
        isPortfoliosLoading,
        preparedPortfolios,
        wasPortfolioWithoutAnalysisDataModalShown,
        isNoAnalysisDataHidden,
    ]);

    const handlePortfolioDelete = useCallback(async () => {
        await refetchPortfolios();
        setSelectedPortfolio(undefined);
    }, [refetchPortfolios]);

    const handleUnshareSelfPortfolio = useCallback(async () => {
        await refetchPortfolios();
        setSelectedPortfolio(undefined);
    }, [refetchPortfolios]);

    const handleSelectedPortfolioNavigate = useCallback(() => {
        if (!selectedPortfolio) {
            return;
        }
        if (!selectedPortfolio.pipelines?.length) {
            return;
        }

        oHeap.trackCustomEvent(LAUNCH_BTN, {
            from: 'portfolio',
        });

        navigate(getDefaultPortfolioPageUrl(selectedPortfolio));
    }, [navigate, selectedPortfolio]);

    const handleCreatePortfolioNavigate = useCallback(() => {
        navigate(ROUTES.CREATE_PORTFOLIO_PAGE);
    }, [navigate]);

    const handleClearSearch = useCallback(() => {
        setFieldValue('search', '');
    }, [setFieldValue]);

    const handleCloseNoDataModal = useCallback(() => {
        setIsPortfolioWithoutAnalysisDataModalOpen(false);
    }, []);

    const handleSearchChange = useCallback(
        (value: string) => {
            setFieldValue('search', value);
        },
        [setFieldValue]
    );

    useEffect(() => {
        setSelectedPortfolio((selectedPortfolio) =>
            selectedPortfolio
                ? preparedPortfolios.find(
                      ({ id }) => id === selectedPortfolio.id
                  )
                : undefined
        );
    }, [preparedPortfolios]);

    if (isCategoriesLoading) {
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
                    data-testid="portfolio-list-circular-progress"
                />
            </Box>
        );
    }

    return (
        <Box className={styles.root}>
            <Box
                flexGrow="1"
                overflow="auto"
                height="100%"
            >
                <Grid
                    height="100%"
                    container
                    spacing={0}
                >
                    <Grid
                        xs={6}
                        height="100%"
                        overflow="hidden"
                        position="relative"
                        borderRight={0.5}
                        sx={{
                            borderColor: (theme) => theme.palette.grey['500'],
                        }}
                    >
                        <Box
                            px={5}
                            pt={5}
                            pb={2}
                            height="100%"
                            display="flex"
                            flexDirection="column"
                        >
                            <Box
                                display="flex"
                                flexDirection={'column'}
                                pb={3}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    alignSelf="stretch"
                                    pb={3}
                                    width={'100%'}
                                >
                                    <Box
                                        flex={1}
                                        display="flex"
                                        flexDirection="column"
                                        gap={0.5}
                                    >
                                        <Typography
                                            variant="h1"
                                            data-testid="portfolio-list-your-portfolios-title"
                                        >
                                            Your Portfolios
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            color="text.secondary"
                                            data-testid="portfolio-list-results-qty"
                                        >
                                            Showing {filteredPortfolios.length}
                                            &nbsp;Results
                                        </Typography>
                                    </Box>
                                    {/* This will show the button to create a portfolio if the user has the right permissions, if not it will show a tooltip with button disabled */}
                                    <Tooltip
                                        title={
                                            !isPortfolioCreator
                                                ? formatMessage(
                                                      'home.create_portfolio.disabled'
                                                  )
                                                : ''
                                        }
                                        arrow
                                        placement="bottom-start"
                                    >
                                        <span>
                                            <Button
                                                variant="contained"
                                                color={
                                                    !isPortfolioCreator
                                                        ? 'inherit'
                                                        : 'secondary'
                                                }
                                                disabled={!isPortfolioCreator}
                                                size="medium"
                                                onClick={
                                                    handleCreatePortfolioNavigate
                                                }
                                                data-testid="create-portfolio-button"
                                            >
                                                Create Portfolio
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Box>
                                {isPortfolioSharingEnabled &&
                                    hasPortfolioAccessPermissions && (
                                        <PortfolioCategoriesTab
                                            currentPortfolioCategory={
                                                selectedPortfolioCategoryTab
                                            }
                                            onPortfolioCategoryChange={
                                                setSelectedPortfolioCategoryTab
                                            }
                                            portfolioCategories={
                                                PORTFOLIO_CATEGORIES
                                            }
                                        />
                                    )}
                            </Box>
                            <Box pb={2}>
                                <form onSubmit={formik.handleSubmit}>
                                    <SearchBar
                                        testId={'portfolio-list'}
                                        placeholder={formatMessage(
                                            'search_bar.search'
                                        )}
                                        value={formik.values.search}
                                        onChange={handleSearchChange}
                                        onClearIconClick={handleClearSearch}
                                        showError={
                                            formik.touched.search &&
                                            Boolean(formik.errors.search)
                                        }
                                    />
                                </form>
                            </Box>
                            {filteredPortfolios.length !== 0 ? (
                                <List
                                    style={{
                                        padding: 0,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        overflow: 'auto',
                                    }}
                                >
                                    <Virtuoso
                                        style={{ height: '100%' }}
                                        data={filteredPortfolios}
                                        components={portfolioListComponents}
                                        data-testid="portfolio-list"
                                        itemContent={(index, portfolio) => (
                                            <>
                                                <PortfolioItem
                                                    key={portfolio.id}
                                                    portfolio={portfolio}
                                                    onPortfolioSelect={
                                                        setSelectedPortfolio
                                                    }
                                                    onPortfolioDelete={
                                                        handlePortfolioDelete
                                                    }
                                                    onPortfolioUnshare={
                                                        handleUnshareSelfPortfolio
                                                    }
                                                    isSelected={
                                                        portfolio.id ===
                                                        selectedPortfolio?.id
                                                    }
                                                    searchText={
                                                        formik.values.search
                                                    }
                                                    selectedPortfolioCategoryTab={
                                                        selectedPortfolioCategoryTab
                                                    }
                                                />
                                                {index ===
                                                    filteredPortfolios.length -
                                                        1 &&
                                                    hasMorePortfolios && (
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    'center',
                                                                marginTop:
                                                                    theme.spacing(
                                                                        2
                                                                    ),
                                                            }}
                                                        >
                                                            <LoadingButton
                                                                variant="text"
                                                                color="primary"
                                                                disabled={
                                                                    isMorePortfoliosLoading
                                                                }
                                                                loading={
                                                                    isMorePortfoliosLoading
                                                                }
                                                                loadingPosition="end"
                                                                sx={{
                                                                    width: 'fit-content',
                                                                    alignSelf:
                                                                        'center',
                                                                    paddingX: 3,
                                                                    textDecoration:
                                                                        'underline',
                                                                    '&:hover': {
                                                                        textDecoration:
                                                                            'underline',
                                                                    },
                                                                }}
                                                                onClick={() =>
                                                                    fetchNextPortfolios()
                                                                }
                                                            >
                                                                <span>
                                                                    {formatMessage(
                                                                        isMorePortfoliosLoading
                                                                            ? 'home.portfolios.loading'
                                                                            : 'home.portfolios.load_more'
                                                                    )}
                                                                </span>
                                                            </LoadingButton>
                                                        </Box>
                                                    )}
                                            </>
                                        )}
                                    />
                                </List>
                            ) : (
                                portfolios &&
                                portfolios.length === 0 && (
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {isPortfoliosLoading ? (
                                            <LoadingSpinner
                                                loading={isPortfoliosLoading}
                                                testId={
                                                    'portfolio-list-loading-spinner'
                                                }
                                            />
                                        ) : (
                                            <Typography
                                                variant="h1"
                                                data-testid="No-data-available"
                                                sx={{ textAlign: 'center' }}
                                            >
                                                {
                                                    emptyPortfoliosStateDescription
                                                }
                                            </Typography>
                                        )}
                                    </Box>
                                )
                            )}
                        </Box>
                    </Grid>
                    {selectedPortfolio ? (
                        <Grid
                            xs={6}
                            height="100%"
                            overflow="hidden"
                            position="relative"
                            display="flex"
                            flexDirection="column"
                            data-testid="portfolio-details"
                        >
                            {isResultSetsLoading ? (
                                <LoadingSpinner
                                    loading={isResultSetsLoading}
                                    testId={'portfolio-details-loading-spinner'}
                                />
                            ) : (
                                <>
                                    <Box
                                        display="flex"
                                        alignSelf="stretch"
                                        px={4}
                                        pt={5}
                                        pb={2}
                                        gap={2}
                                        data-testid="portfolio-details-header"
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                            gap={0.5}
                                            flex={1}
                                            data-testid="portfolio-details-header-data"
                                        >
                                            <Typography
                                                variant="h1"
                                                data-testid="portfolio-details-portfolio-name"
                                            >
                                                {selectedPortfolio?.name}
                                            </Typography>

                                            <Box
                                                display="flex"
                                                gap={1}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    data-testid="portfolio-details-portfolio-analysis-type"
                                                >
                                                    {getPortfolioResultSetLabel(
                                                        selectedPortfolio
                                                    )}
                                                </Typography>

                                                <Box>
                                                    <Divider orientation="vertical" />
                                                </Box>

                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    data-testid="portfolio-details-location-qty"
                                                >
                                                    {getLocationCountLabel(
                                                        selectedPortfolio.locationCount
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="flex-start"
                                            alignItems="flex-end"
                                            gap={2}
                                        >
                                            <Box
                                                display="flex"
                                                justifyContent="flex-end"
                                                alignItems="center"
                                                gap={1}
                                                data-testid="portfolio-details-location-aa"
                                            >
                                                <PortfolioExportMenu
                                                    portfolio={
                                                        selectedPortfolio
                                                    }
                                                    selectedPortfolioCategoryTab={
                                                        selectedPortfolioCategoryTab
                                                    }
                                                />

                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled={
                                                        !selectedPortfolio
                                                            .pipelines
                                                            ?.length ||
                                                        selectedPortfolio
                                                            .pipelines[0]
                                                            .status !==
                                                            PipelineStatus.completed
                                                    }
                                                    onClick={
                                                        handleSelectedPortfolioNavigate
                                                    }
                                                    data-testid="portfolio-details-launch-button"
                                                >
                                                    Launch
                                                </Button>

                                                <PortfolioExtendedMenu
                                                    portfolio={
                                                        selectedPortfolio
                                                    }
                                                    selectedPortfolioCategoryTab={
                                                        selectedPortfolioCategoryTab
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Divider
                                        sx={{
                                            borderColor: (theme) =>
                                                theme.palette.grey['500'],
                                        }}
                                    />

                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="flex-start"
                                        alignSelf="stretch"
                                        px={4}
                                        py={3}
                                        gap={3}
                                        flex={1}
                                    >
                                        <PortfolioInfo
                                            portfolio={selectedPortfolio}
                                        />

                                        <PortfolioMap
                                            portfolio={selectedPortfolio}
                                        />
                                    </Box>
                                </>
                            )}
                        </Grid>
                    ) : (
                        <Grid
                            xs={6}
                            height="100%"
                            overflow="hidden"
                            position="relative"
                            display="flex"
                            flexDirection="column"
                            data-testid="portfolio-details"
                        >
                            {isPortfoliosLoading ? (
                                <LoadingSpinner loading={isPortfoliosLoading} />
                            ) : null}
                        </Grid>
                    )}
                </Grid>
            </Box>
            {isPortfolioWithoutAnalysisDataModalOpen && (
                <PortfolioWithoutAnalysisDataModal
                    onClose={handleCloseNoDataModal}
                />
            )}
        </Box>
    );
};
