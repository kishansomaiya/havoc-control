import {
    Box,
    Divider,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';
import {
    ChangeEvent,
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { ChangeIndicator } from '../../../../components/Table/ChangeIndicator';
import {
    NO_AVAILABLE_SCORE,
    ROWS_PER_PAGE_OPTIONS,
    sortComparisonValue,
} from '../../../../const';
import {
    getSelectedPortfolioLocationUrl,
    numberValueFormatter,
} from '../../../../utils';
import { ImpactsDataWrapper } from './ImpactsDataWrapper';
import {
    PortfolioImpactsLocationData,
    Scenario,
    SortOrder,
} from '../../../../types';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface ImpactByLocation {
    index: number;
    id: number;
    name: string | null | undefined;
    previousValue: number | null;
    currentValue: number | null;
    diff: number | null;
}

type KeysOfImpactByLocation = keyof ImpactByLocation;

interface ImpactsByLocationTableProps extends ComponentProps<typeof Box> {
    portfolioId: string;
    impactsData: PortfolioImpactsLocationData[];
    yearFrom: number;
    yearTo: number;
    scenario?: Scenario;
}

const ImpactsByLocationTableRow = ({
    portfolioId,
    location,
}: {
    portfolioId: string;
    location: ImpactByLocation;
}) => {
    const locationPageUrl = useMemo(
        () => getSelectedPortfolioLocationUrl(portfolioId, location.id),
        [location, portfolioId]
    );

    return (
        <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            data-testid="table-row"
        >
            <TableCell>
                {location.index}.&nbsp;
                <Link
                    className="MuiLink-secondary"
                    color="secondary"
                    component={RouterLink}
                    to={locationPageUrl}
                    ml={0.5}
                    data-testid="location-name"
                >
                    {location.name || `Location#${location.id}`}
                </Link>
            </TableCell>
            <TableCell data-testid="year-from-value">
                {location.previousValue === null ||
                location.previousValue === NO_AVAILABLE_SCORE
                    ? '-'
                    : numberValueFormatter({ value: location.previousValue })}
            </TableCell>
            <TableCell data-testid="year-to-value">
                {location.currentValue === null ||
                location.currentValue === NO_AVAILABLE_SCORE
                    ? '-'
                    : numberValueFormatter({ value: location.currentValue })}
            </TableCell>
            <TableCell data-testid="year-change-value">
                <ChangeIndicator
                    previousValue={
                        location.previousValue === NO_AVAILABLE_SCORE
                            ? null
                            : location.previousValue
                    }
                    currentValue={
                        location.currentValue === NO_AVAILABLE_SCORE
                            ? undefined
                            : location.currentValue
                    }
                />
            </TableCell>
        </TableRow>
    );
};

export const ImpactsByLocationTable: FC<ImpactsByLocationTableProps> = ({
    portfolioId,
    impactsData,
    yearFrom,
    yearTo,
    scenario,
    ...props
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
    const [order, setOrder] = useState<SortOrder>(SortOrder.Desc);
    const [orderBy, setOrderBy] = useState<KeysOfImpactByLocation>('diff');

    const locationsData: ImpactByLocation[] = useMemo(() => {
        const data: { [key: number]: ImpactByLocation } = {};
        impactsData.forEach((locationData) => {
            if (!locationData.locationId) {
                return;
            }

            if (!data[locationData.locationId]) {
                data[locationData.locationId] = {
                    index: 0,
                    id: locationData.locationId,
                    name: locationData.locationName,
                    previousValue: null,
                    currentValue: null,
                    diff: null,
                };
            }

            if (
                locationData.year === yearFrom &&
                locationData.EI_value !== null
            ) {
                data[locationData.locationId].previousValue =
                    locationData.EI_value || 0;
            }

            if (
                locationData.year === yearTo &&
                locationData.EI_value !== null
            ) {
                data[locationData.locationId].currentValue =
                    locationData.EI_value || 0;
            }
        });

        return Object.values(data).map((item, index) => {
            const location = {
                ...item,
                index: index + 1,
            };
            if (
                (!location.previousValue && location.previousValue !== 0) ||
                (!location.currentValue && location.currentValue !== 0)
            ) {
                return location;
            } else {
                location['diff'] =
                    Number(location.currentValue) -
                    Number(location.previousValue);
                return location;
            }
        });
    }, [impactsData, yearFrom, yearTo]);

    const sortedLocationsData = useMemo(() => {
        const x = locationsData.sort((locationA, locationB) => {
            if (!locationA[orderBy] && locationA[orderBy] !== 0) {
                return 1;
            }
            if (!locationB[orderBy] && locationB[orderBy] !== 0) {
                return -1;
            }

            if (locationA[orderBy] > locationB[orderBy]) {
                return sortComparisonValue[order].a_gt_b;
            }
            if (locationA[orderBy] < locationB[orderBy]) {
                return sortComparisonValue[order].a_lt_b;
            }
            return 0;
        });

        return x;
    }, [locationsData, order, orderBy]);

    const handleRequestSort = (property: keyof ImpactByLocation) => {
        const isDesc = orderBy === property && order === SortOrder.Desc;
        setOrder(isDesc ? SortOrder.Asc : SortOrder.Desc);
        setOrderBy(property);
    };

    const handleChangePage = useCallback(
        (
            event: React.MouseEvent<HTMLButtonElement> | null,
            newPage: number
        ) => {
            event?.preventDefault();
            setPage(newPage);
        },
        []
    );

    const handleChangeRowsPerPage = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        },
        []
    );

    useEffect(() => {
        setPage(0);
    }, [/* effect dep */ yearTo, /* effect dep */ scenario]);

    return (
        <ImpactsDataWrapper
            title="Climate Impact Drivers By Location"
            {...props}
        >
            <Box
                flexGrow="1"
                overflow="auto"
                pt={2}
                ml={-2}
            >
                <TableContainer sx={{ maxHeight: '100%' }}>
                    <Table
                        size="small"
                        stickyHeader
                        data-testid="impacts-location-table"
                    >
                        <TableHead data-testid="impacts-location-table-header">
                            <TableRow>
                                <TableCell>
                                    <Typography
                                        variant="h6"
                                        data-testid="impacts-location-table-column-first"
                                    >
                                        Location
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sortDirection={
                                        orderBy === 'previousValue'
                                            ? order
                                            : false
                                    }
                                >
                                    <TableSortLabel
                                        active={orderBy === 'previousValue'}
                                        direction={
                                            orderBy === 'previousValue'
                                                ? order
                                                : SortOrder.Desc
                                        }
                                        onClick={() =>
                                            handleRequestSort('previousValue')
                                        }
                                    >
                                        <Typography
                                            variant="h6"
                                            data-testid="location-table-year-from"
                                        >
                                            Impact {yearFrom}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={
                                        orderBy === 'currentValue'
                                            ? order
                                            : false
                                    }
                                >
                                    <TableSortLabel
                                        active={orderBy === 'currentValue'}
                                        direction={
                                            orderBy === 'currentValue'
                                                ? order
                                                : SortOrder.Desc
                                        }
                                        onClick={() =>
                                            handleRequestSort('currentValue')
                                        }
                                    >
                                        <Typography
                                            variant="h6"
                                            data-testid="location-table-year-to"
                                        >
                                            Impact {yearTo}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={
                                        orderBy === 'diff' ? order : false
                                    }
                                >
                                    <TableSortLabel
                                        active={orderBy === 'diff'}
                                        direction={
                                            orderBy === 'diff'
                                                ? order
                                                : SortOrder.Desc
                                        }
                                        onClick={() =>
                                            handleRequestSort('diff')
                                        }
                                    >
                                        <Typography
                                            variant="h6"
                                            data-testid="location-table-year-change"
                                        >
                                            Change
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedLocationsData
                                .slice(
                                    page * rowsPerPage,
                                    (page + 1) * rowsPerPage
                                )
                                .map((location) => (
                                    <ImpactsByLocationTableRow
                                        key={location.id}
                                        location={location}
                                        portfolioId={portfolioId}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {ROWS_PER_PAGE_OPTIONS[0] < locationsData.length && (
                <>
                    <Divider sx={{ paddingTop: '0.5rem' }} />
                    <TablePagination
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        component="div"
                        count={locationsData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            minHeight: '3.25rem',
                        }}
                        data-testid="location-table-pagination"
                    />
                </>
            )}
        </ImpactsDataWrapper>
    );
};
