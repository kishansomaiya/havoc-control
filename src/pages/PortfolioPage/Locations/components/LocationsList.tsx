import {
    ComponentProps,
    FC,
    useCallback,
    useMemo,
    forwardRef,
    useRef,
    useEffect,
} from 'react';
import { LocationResponse } from '../../../../api/openapi/auto-generated';
import {
    Box,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Stack,
    Typography,
} from '@mui/material';
import {
    Virtuoso,
    Components,
    VirtuosoHandle,
    ListProps,
} from 'react-virtuoso';
import * as Icon from 'react-feather';
import { useFormik } from 'formik';
import { LocationItem } from './LocationItem';
import { ROUTES } from '../../../../const';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

export interface LocationsListProps extends ComponentProps<'div'> {
    portfolioId: string;
    locations: LocationResponse[];
    isNavigationEnabled: boolean;
    navigationAvailableTab: string | null;
}

const initialFormValues = {
    search: '',
};

const locationsListComponents: Components<LocationResponse> = {
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

export const LocationsList: FC<LocationsListProps> = ({
    portfolioId,
    locations,
    isNavigationEnabled,
    navigationAvailableTab,
}) => {
    const [searchParams] = useSearchParams();
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: () => { },
        enableReinitialize: true,
    });

    const { setFieldValue } = formik;

    const preparedLocations = useMemo(
        () =>
            locations.sort(
                (locationA, locationB) => locationA.id - locationB.id
            ),
        [locations]
    );

    const filteredLocations = useMemo(
        () =>
            preparedLocations.filter(
                ({ id, extras }) =>
                    !formik.values.search ||
                    id
                        .toString()
                        .toLowerCase()
                        .includes(formik.values.search.toLowerCase()) ||
                    (extras as { locationName?: string })?.locationName
                        ?.toLowerCase()
                        ?.includes(formik.values.search.toLowerCase())
            ),
        [preparedLocations, formik.values.search]
    );

    const handleClearSearch = useCallback(() => {
        setFieldValue('search', '');
    }, [setFieldValue]);

    const handleLocationSelection = useCallback(
        (locationId: number) => {
            const locationPageUrl = `${ROUTES.LOCATION_PAGE.replace(
                ':portfolioId',
                portfolioId
            ).replace(
                ':locationId',
                locationId.toString()
            )}/${navigationAvailableTab || ''}`;
            navigate(locationPageUrl);
        },
        [portfolioId, navigate, navigationAvailableTab]
    );

    const selectedLocationId = useMemo(() => {
        const selectedLocationId = searchParams.get('locationId');
        if (!selectedLocationId) {
            return undefined;
        }

        return Number(selectedLocationId);
    }, [searchParams]);

    useEffect(() => {
        if (selectedLocationId === undefined) {
            return;
        }

        const selectedLocationIndex = filteredLocations.findIndex(
            ({ id }) => id === Number(selectedLocationId)
        );

        if (selectedLocationIndex === -1) {
            return;
        }

        setTimeout(() => {
            if (!virtuosoRef.current) {
                return;
            }

            virtuosoRef.current.scrollToIndex({
                index: selectedLocationIndex,
                behavior: 'smooth',
            });
        }, 0);
    }, [selectedLocationId, filteredLocations]);

    return (
        <div style={{ height: '100%' }}>
            <Stack
                direction={'column'}
                gap={0}
                sx={{ height: '100%' }}
                data-testid="portfolio-locations-list"
            >
                <Box
                    px={4}
                    py={3}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <OutlinedInput
                            id="outlined-adornment-search"
                            name="search"
                            placeholder="Search"
                            data-testid="portfolio-locations-search"
                            startAdornment={
                                <>
                                    <InputAdornment position="start">
                                        <Icon.Search
                                            aria-label="Search"
                                            size="1rem"
                                            data-testid="portfolio-locations-search-icon"
                                        />
                                    </InputAdornment>
                                </>
                            }
                            endAdornment={
                                <>
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            data-testid="portfolio-locations-search-clear-button"
                                        >
                                            <Icon.X
                                                aria-label="Clear"
                                                size="1rem"
                                                data-testid="portfolio-locations-search-clear-icon"
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
                <Box
                    px={4}
                    pb={2}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid="portfolio-locations-showing-qty-label"
                    >
                        Showing {filteredLocations.length}
                        &nbsp;Results
                    </Typography>
                </Box>
                <Box
                    flexGrow={1}
                    px={4}
                    pb={3}
                    data-testid="portfolio-locations-result-list"
                >
                    <Virtuoso
                        ref={virtuosoRef}
                        style={{ height: '100%' }}
                        data={filteredLocations}
                        components={locationsListComponents}
                        itemContent={(_, location) => (
                            <LocationItem
                                key={location.id}
                                location={location}
                                onLocationSelect={handleLocationSelection}
                                searchText={formik.values.search}
                                isSelected={location.id === selectedLocationId}
                                isDisabled={!isNavigationEnabled}
                            />
                        )}
                        data-testid="portfolio-locations-result-item-list"
                    />
                </Box>
            </Stack>
        </div>
    );
};
