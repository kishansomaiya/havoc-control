import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Typography,
    useTheme,
} from '@mui/material';
import styles from '../ProfilePage.module.css';
import PortfolioCategoriesTab from '../../../components/PortfolioCategoriesTab/PortfolioCategoriesTab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Icon from 'react-feather';
import { Virtuoso } from 'react-virtuoso';
import { PortfolioItem } from '../../HomePage/components/PortfolioItem';
import { portfolioListComponents } from '../../HomePage/HomePage';
import { IPortfolioItem } from '../../../types';
import {
    usePortfolioSharedUsersQuery,
    usePortfoliosQuery,
} from '../../../api/queries/portfoliosQuery';
import {
    MAX_LIST_API_LIMIT,
    PORTFOLIO_REFREST_TIMEOUT,
    STD_LIST_API_LIMIT,
} from '../../../const';
import { useCategoriesQuery } from '../../../api/queries/categoriesQuery';
import {
    ListingMode,
    PipelineStatus,
} from '../../../api/openapi/auto-generated';
import { IUser } from '../../../types/user';
import { useUsersQuery } from '../../../api/queries/usersQuery';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import {
    useSharePortfolioMutation,
    useUnsharePortfolioMutation,
} from '../../../api/mutations/portfoliosMutation';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '../../../context/UserContextProvider';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import {
    PORTFOLIO_CATEGORIES_PARAMETER,
    PortfolioCategories,
} from '../../../const/PortfolioCategories';

const initialFormValues = {
    search: '',
};

const PortfolioSharing = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth0();
    const { portfolioId } = useParams();
    const [userSearch, setUserSearch] = useState('');
    const [selectedPortfolio, setSelectedPortfolio] = useState<
        IPortfolioItem | undefined
    >();
    const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] =
        useState<boolean>(false);
    const [selectedPortfolioCategoryTab, setSelectedPortfolioCategoryTab] =
        useState<PortfolioCategories>(PortfolioCategories.MyPortfolios);
    const [portfolioViewableUsers, setPortfolioViewableUsers] = useState<
        IUser[]
    >([]);
    const [usersAlreadyHadAccess, setUsersAlreadyHadAccess] = useState<IUser[]>(
        []
    );
    const [addedUsers, setAddedUsers] = useState<string[]>([]);
    const [removedUsers, setRemovedUsers] = useState<string[]>([]);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    const {
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
        listingMode: PORTFOLIO_CATEGORIES_PARAMETER[
            selectedPortfolioCategoryTab
        ] as ListingMode,
    });

    const {
        sharedUsers,
        isPortfolioSharedUsersLoading,
        refetchPortfolioSharedUsers,
    } = usePortfolioSharedUsersQuery(selectedPortfolio?.id as string);

    const { categories, isCategoriesLoading } = useCategoriesQuery({
        limit: MAX_LIST_API_LIMIT,
    });

    const { users, isUsersLoading, refetchUsers } = useUsersQuery({
        pageSize: MAX_LIST_API_LIMIT,
        tenantId: user?.['custom:jupiter-tenant-id'],
    });

    const { sharePortfolio, isPortfolioShareLoading } =
        useSharePortfolioMutation();

    const { unsharePortfolio, isPortfolioUnshareLoading } =
        useUnsharePortfolioMutation();

    const PORTFOLIO_CATEGORIES = [
        {
            name: 'My Portfolios',
            value: PortfolioCategories.MyPortfolios,
            isVisible: isPortfolioCreator || false,
        },
        {
            name: "My Team's Portfolios",
            value: PortfolioCategories.MyTeamsPortfolios,
            isVisible: isPortfolioAdministrator || false,
        },
    ];

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = formik;

    const preparedPortfolios: IPortfolioItem[] = useMemo(
        () =>
            portfolios
                .map((portfolio) => {
                    const category = portfolio.category
                        ? categories.find(
                              (category) => category.id === portfolio.category
                          )
                        : null;

                    return {
                        ...portfolio,
                        category: category?.name ?? '',
                        resultSets: [], // resultSets is not used in the portfolio sharing page
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
        [portfolios, categories]
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
            ),
        [portfolios]
    );

    // when the selectedPortfolioCategoryTab changes, we need to refetch the portfolios
    useEffect(() => {
        refetchPortfolios();
    }, [/* effect dep */ selectedPortfolioCategoryTab, refetchPortfolios]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetchPortfolios();
        }, PORTFOLIO_REFREST_TIMEOUT);

        if (!hasPendingPortfolios) {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [hasPendingPortfolios, refetchPortfolios]);

    const clearUserSearch = useCallback(() => {
        setUserSearch('');
    }, []);

    const handleClearSearch = useCallback(() => {
        setFieldValue('search', '');
    }, [setFieldValue]);

    const handlePortfolioDelete = useCallback(async () => {
        await refetchPortfolios();
        setSelectedPortfolio(undefined);
    }, [refetchPortfolios]);

    const handlePortfolioViewableUserSelect = useCallback(
        (userId: string) => {
            setPortfolioViewableUsers((prev) => {
                return prev.map((user) => {
                    if (user.id === userId) {
                        const isSelected = !user.selected;

                        // Update selected state
                        if (isSelected) {
                            // If the user is being selected
                            setAddedUsers((ids) => {
                                // Remove from removedUsers if present
                                if (removedUsers.includes(userId)) {
                                    return ids; // No change if already in removedUsers
                                }
                                return [...ids, userId]; // Add to addedUsers
                            });
                            setRemovedUsers((ids) =>
                                ids.filter((id) => id !== userId)
                            ); // Remove from removedUsers
                        } else {
                            // If the user is being deselected
                            setRemovedUsers((ids) => {
                                // Remove from addedUsers if present
                                if (addedUsers.includes(userId)) {
                                    return ids; // No change if already in addedUsers
                                }
                                return [...ids, userId]; // Add to removedUsers
                            });
                            setAddedUsers((ids) =>
                                ids.filter((id) => id !== userId)
                            ); // Remove from addedUsers
                        }

                        return { ...user, selected: isSelected };
                    }
                    return user;
                });
            });
        },
        [addedUsers, removedUsers]
    );

    useEffect(() => {
        const newlyAddedUsers = addedUsers.length > 0;
        const newlyRemovedUsers = removedUsers.length > 0;

        // Check if there are any changes compared to the initial snapshot
        const hasChanges = newlyAddedUsers || newlyRemovedUsers;
        setIsSaveEnabled(hasChanges);
    }, [addedUsers, removedUsers]);

    const handleCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleSubmit = useCallback(async () => {
        // listUsersShare and listUsersUnshare
        // we will be updating the portfolio viewable users here through API call using addedUsers and removedUsers
        if (addedUsers.length > 0 && removedUsers.length > 0) {
            await sharePortfolio({
                id: selectedPortfolio?.id as string,
                portfolioSharingInputBody: {
                    userIds: addedUsers,
                },
            });
            await unsharePortfolio({
                id: selectedPortfolio?.id as string,
                portfolioSharingInputBody: {
                    userIds: removedUsers,
                },
            });
        } else if (addedUsers.length > 0) {
            await sharePortfolio({
                id: selectedPortfolio?.id as string,
                portfolioSharingInputBody: {
                    userIds: addedUsers,
                },
            });
        } else if (removedUsers.length > 0) {
            await unsharePortfolio({
                id: selectedPortfolio?.id as string,
                portfolioSharingInputBody: {
                    userIds: removedUsers,
                },
            });
        }
        setIsSaveSuccessModalOpen(true);
        setAddedUsers([]);
        setRemovedUsers([]);
        setIsSaveEnabled(false);
    }, [
        addedUsers,
        removedUsers,
        selectedPortfolio,
        sharePortfolio,
        unsharePortfolio,
    ]);

    const handleSaveConfirm = useCallback(() => {
        setIsSaveSuccessModalOpen(false);
        refetchPortfolios();
        refetchPortfolioSharedUsers();
        refetchUsers();
    }, [refetchPortfolios, refetchPortfolioSharedUsers, refetchUsers]);

    useEffect(() => {
        setAddedUsers([]);
        setRemovedUsers([]);
        setIsSaveEnabled(false);
    }, [/* effect dep */ selectedPortfolio]);

    useEffect(() => {
        const modifiedAlreadyHadAccessUsers =
            users
                ?.filter((user) => sharedUsers?.includes(user.id as string))
                .map((user) => ({
                    ...user,
                    selected: true,
                })) || [];
        setUsersAlreadyHadAccess(modifiedAlreadyHadAccessUsers || []);
    }, [users, sharedUsers]);

    useEffect(() => {
        if (users) {
            const combinedUsers = users.map((user) => {
                const hasAccess = usersAlreadyHadAccess.find(
                    (accessUser) => accessUser.id === user.id
                );
                return {
                    ...user,
                    selected: hasAccess ? true : false, // Set selected based on access
                };
            });
            setPortfolioViewableUsers(combinedUsers);
        }
    }, [users, usersAlreadyHadAccess]);

    // if we come from homepage by using portfolio share settings button, we are setting selected portfolio here
    useEffect(() => {
        const selectedPortfolioFromParameterId = portfolios.find(
            (portfolio) => portfolio.id === portfolioId
        );
        if (selectedPortfolioFromParameterId) {
            setSelectedPortfolio(
                selectedPortfolioFromParameterId as IPortfolioItem
            );
        } else {
            setSelectedPortfolio(portfolios[0] as IPortfolioItem);
        }
    }, [portfolioId, portfolios]);

    // Filter available users based on search
    const filteredAvailableUsers = portfolioViewableUsers
        .filter((currUser) => currUser.id !== user?.['custom:jupiter-user-id'])
        .filter(
            (user) =>
                user?.firstName
                    ?.toLowerCase()
                    .includes(userSearch.toLowerCase()) ||
                user?.emailAddress
                    ?.toLowerCase()
                    .includes(userSearch.toLowerCase())
        );

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
                <Box pb={3}>
                    {isPortfolioSharingEnabled &&
                        hasPortfolioAccessPermissions && (
                            <PortfolioCategoriesTab
                                currentPortfolioCategory={
                                    selectedPortfolioCategoryTab
                                }
                                onPortfolioCategoryChange={
                                    setSelectedPortfolioCategoryTab
                                }
                                portfolioCategories={PORTFOLIO_CATEGORIES}
                            />
                        )}
                </Box>
                <Box pb={2}>
                    <form onSubmit={formik.handleSubmit}>
                        <OutlinedInput
                            id="search"
                            data-testid="portfolio-list-search-field"
                            name="search"
                            placeholder="Search"
                            startAdornment={
                                <>
                                    <InputAdornment position="start">
                                        <Icon.Search
                                            aria-label="Search"
                                            size="1rem"
                                            data-testid="portfolio-list-search-icon"
                                        />
                                    </InputAdornment>
                                </>
                            }
                            endAdornment={
                                <>
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            data-testid="portfolio-list-search-clear-icon"
                                            onClick={handleClearSearch}
                                        >
                                            <Icon.X
                                                aria-label="Clear"
                                                size="1rem"
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                </>
                            }
                            value={formik.values.search}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.search &&
                                Boolean(formik.errors.search)
                            }
                            fullWidth
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
                                        onPortfolioSelect={setSelectedPortfolio}
                                        onPortfolioDelete={
                                            handlePortfolioDelete
                                        }
                                        isSelected={
                                            portfolio.id ===
                                            selectedPortfolio?.id
                                        }
                                        searchText={formik.values.search}
                                        selectedPortfolioCategoryTab={
                                            selectedPortfolioCategoryTab
                                        }
                                        showThreeDotsMenu={false}
                                    />
                                    {index === filteredPortfolios.length - 1 &&
                                        hasMorePortfolios && (
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: theme.spacing(2),
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
                                                        alignSelf: 'center',
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
                                                        {isMorePortfoliosLoading
                                                            ? 'Loading...'
                                                            : 'Load More'}
                                                    </span>
                                                </LoadingButton>
                                            </Box>
                                        )}
                                </>
                            )}
                        />
                    </List>
                ) : (
                    <>
                        {isPortfoliosLoading ? (
                            <LoadingSpinner loading={isPortfoliosLoading} />
                        ) : (
                            <Typography
                                variant="h1"
                                data-testid="No-data-available"
                            >
                                No Data Available
                            </Typography>
                        )}
                    </>
                )}
            </Box>
            {selectedPortfolio ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    className={styles.scroll}
                    width="100%"
                    height="100%"
                    px={8}
                    py={7.5}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: '160%',
                            letterSpacing: '0.025rem',
                            mb: 2,
                        }}
                    >
                        Users who can view this Portfolio
                    </Typography>
                    <Box
                        sx={{
                            border: '1px solid #5B6368',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 3,
                            overflow: 'hidden',
                            flex: 1,
                        }}
                    >
                        <Box>
                            <OutlinedInput
                                fullWidth
                                placeholder="Search for User"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon.Search size="1rem" />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    userSearch && (
                                        <InputAdornment position="end">
                                            <Icon.X onClick={clearUserSearch} />
                                        </InputAdornment>
                                    )
                                }
                                sx={{
                                    borderRadius: 1,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#5B6368',
                                    },
                                }}
                            />
                        </Box>
                        <>
                            {isUsersLoading || isPortfolioSharedUsersLoading ? (
                                <LoadingSpinner
                                    loading={
                                        isUsersLoading ||
                                        isPortfolioSharedUsersLoading
                                    }
                                />
                            ) : (
                                <List
                                    sx={{
                                        overflow: 'auto',
                                        flexGrow: 1,
                                        py: 0,
                                    }}
                                >
                                    {filteredAvailableUsers?.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            dense
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor:
                                                        'rgba(255, 255, 255, 0.08)',
                                                },
                                                cursor: 'pointer',
                                                ...(user.disabled
                                                    ? {
                                                          cursor: 'not-allowed',
                                                          opacity: 0.4,
                                                      }
                                                    : {}),
                                                px: 0,
                                                py: 1,
                                            }}
                                            onClick={() =>
                                                handlePortfolioViewableUserSelect(
                                                    user.id as string
                                                )
                                            }
                                        >
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={user.selected}
                                                    sx={{
                                                        color: '#5B6368',
                                                        '&.Mui-checked': {
                                                            color: '#3f8cff',
                                                        },
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={user?.firstName}
                                                secondary={user?.emailAddress}
                                                primaryTypographyProps={{
                                                    variant: 'body1',
                                                    color: 'text.primary',
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'text.secondary',
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            sx={{ width: '120px' }}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="secondary"
                            sx={{ width: '120px' }}
                            onClick={handleSubmit}
                            disabled={
                                !isSaveEnabled ||
                                isPortfolioShareLoading ||
                                isPortfolioUnshareLoading
                            }
                            loading={
                                isPortfolioShareLoading ||
                                isPortfolioUnshareLoading
                            }
                        >
                            Save
                        </LoadingButton>
                    </Box>
                </Box>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    className={styles.scroll}
                    width="100%"
                    height="100%"
                    px={8}
                    py={7.5}
                >
                    {isPortfoliosLoading ? (
                        <LoadingSpinner loading={isPortfoliosLoading} />
                    ) : (
                        <Typography
                            variant="h1"
                            data-testid="No-data-available"
                        >
                            No Data Available
                        </Typography>
                    )}
                </Box>
            )}
            {isSaveSuccessModalOpen && (
                <ConfirmModal
                    title="Success!"
                    message="You have successfully shared this portfolio with the selected users."
                    onConfirm={handleSaveConfirm}
                    confirmLabel="Yes"
                    data-testid="edit-portfolio-shared-users-save-modal"
                />
            )}
        </Box>
    );
};

export default PortfolioSharing;
