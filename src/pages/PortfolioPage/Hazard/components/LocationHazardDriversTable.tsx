import {
    ChangeEvent,
    ComponentProps,
    FC,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Score, SortOrder, UnitOfMeasure } from '../../../../types';
import {
    ROWS_PER_PAGE_OPTIONS,
    SCORE_TITLES,
    sortComparisonValue,
} from '../../../../const';
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
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ChangeIndicator } from '../../../../components/Table/ChangeIndicator';
import * as Icon from 'react-feather';
import {
    getFormattedByUnitOfMeasureHazardValue,
    getSelectedPortfolioLocationUrl,
} from '../../../../utils';

export type HazardTableLocation = {
    locationId: number;
    locationName: string | null;
} & {
    diff: number | null;
    [year: string]: number | null;
};

export interface LocationHazardDriversTableProps
    extends ComponentProps<typeof Box> {
    score: Score;
    hazardLocations: HazardTableLocation[];
    yearTo: number | '';
    yearFrom: number;
    portfolioId: string;
    unitOfMeasure?: UnitOfMeasure;
}

export const LocationHazardDriversTable: FC<
    LocationHazardDriversTableProps
> = ({
    score,
    yearTo,
    yearFrom,
    hazardLocations,
    portfolioId,
    unitOfMeasure,
}) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
    const [order, setOrder] = useState<SortOrder>(SortOrder.Desc);
    const [orderBy, setOrderBy] = useState<string>('diff');

    const sortedHazardLocations = useMemo(
        () =>
            hazardLocations.sort((locationA, locationB) => {
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
            }),
        [hazardLocations, order, orderBy]
    );

    useEffect(() => {
        setPage(0);
    }, [/* effect dep */ score, /* effect dep */ hazardLocations]);

    const handleRequestSort = (property: string) => {
        const isDesc = orderBy === property && order === SortOrder.Desc;
        setOrder(isDesc ? SortOrder.Asc : SortOrder.Desc);
        setOrderBy(property);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        event?.preventDefault();
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
            minHeight="11rem"
        >
            <Typography
                variant="overline"
                color="text.secondary"
                textTransform="uppercase"
                data-testid="portfolio-hazard-location-drivers-table-title"
            >
                Location Hazard Drivers - {SCORE_TITLES[score]}
            </Typography>
            <Box flexGrow={1}>
                <TableContainer>
                    <Table
                        size="small"
                        stickyHeader
                        data-testid="portfolio-hazard-location-drivers-table"
                    >
                        <TableHead>
                            <TableRow
                                sx={{ bgcolor: 'background.default' }}
                                data-testid="portfolio-hazard-location-drivers-table-header"
                            >
                                <TableCell data-testid="portfolio-hazard-location-drivers-table-column-first">
                                    Location
                                </TableCell>
                                <TableCell
                                    sortDirection={
                                        orderBy === `${yearFrom}`
                                            ? order
                                            : false
                                    }
                                >
                                    <TableSortLabel
                                        active={orderBy === `${yearFrom}`}
                                        direction={
                                            orderBy === `${yearFrom}`
                                                ? order
                                                : SortOrder.Desc
                                        }
                                        onClick={() =>
                                            handleRequestSort(`${yearFrom}`)
                                        }
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="start"
                                            gap={0.5}
                                            data-testid="portfolio-hazard-location-drivers-table-year-from"
                                        >
                                            <span>{yearFrom}</span>
                                            <Tooltip
                                                title={`Starting year is always ${yearFrom}`}
                                                arrow
                                                placement="top"
                                                data-testid="portfolio-hazard-location-drivers-table-year-from-tooltip"
                                            >
                                                <Icon.Info
                                                    size="0.875rem"
                                                    color={
                                                        theme.palette.text
                                                            .secondary
                                                    }
                                                    data-testid="portfolio-hazard-location-drivers-table-year-from-tooltip-icon"
                                                />
                                            </Tooltip>
                                        </Box>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={
                                        orderBy === `${yearTo}` ? order : false
                                    }
                                >
                                    <TableSortLabel
                                        active={orderBy === `${yearTo}`}
                                        direction={
                                            orderBy === `${yearTo}`
                                                ? order
                                                : SortOrder.Desc
                                        }
                                        onClick={() =>
                                            handleRequestSort(`${yearTo}`)
                                        }
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="start"
                                            gap={0.5}
                                            data-testid="portfolio-hazard-location-drivers-table-year-to"
                                        >
                                            <span>{yearTo}</span>
                                            <Tooltip
                                                title={`Mean value for selected Metric and ${yearTo} year`}
                                                arrow
                                                placement="top"
                                                data-testid="portfolio-hazard-location-drivers-table-year-to-tooltip"
                                            >
                                                <Icon.Info
                                                    size="0.875rem"
                                                    color={
                                                        theme.palette.text
                                                            .secondary
                                                    }
                                                    data-testid="portfolio-hazard-location-drivers-table-year-to-tooltip-icon"
                                                />
                                            </Tooltip>
                                        </Box>
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
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="start"
                                            gap={0.5}
                                            data-testid="portfolio-hazard-location-drivers-table-year-change"
                                        >
                                            <span>Change</span>
                                            <Tooltip
                                                title={`Difference between "${yearTo}" and "${yearFrom}" values`}
                                                arrow
                                                placement="top"
                                                data-testid="portfolio-hazard-location-drivers-table-year-change-tooltip"
                                            >
                                                <Icon.Info
                                                    size="0.875rem"
                                                    color={
                                                        theme.palette.text
                                                            .secondary
                                                    }
                                                    data-testid="portfolio-hazard-location-drivers-table-year-change-tooltip-icon"
                                                />
                                            </Tooltip>
                                        </Box>
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedHazardLocations
                                .slice(
                                    page * rowsPerPage,
                                    (page + 1) * rowsPerPage
                                )
                                .map((location, index) => {
                                    const locationFromValue =
                                        location[yearFrom.toString()];
                                    const locationToValue =
                                        location[yearTo.toString()];
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={location.locationId}
                                            data-testid="table-row"
                                        >
                                            <TableCell data-testid="table-location-name-cell">
                                                <span>
                                                    {page * rowsPerPage +
                                                        index +
                                                        1}
                                                    .
                                                </span>
                                                <Link
                                                    className="MuiLink-secondary"
                                                    color="secondary"
                                                    component={RouterLink}
                                                    to={getSelectedPortfolioLocationUrl(
                                                        portfolioId,
                                                        location.locationId
                                                    )}
                                                    ml={0.5}
                                                    data-testid="table-location-name"
                                                >
                                                    {location.locationName ||
                                                        `Location#${location.locationId}`}
                                                </Link>
                                            </TableCell>
                                            <TableCell data-testid="table-location-year-from-value">
                                                {getFormattedByUnitOfMeasureHazardValue(
                                                    locationFromValue,
                                                    unitOfMeasure
                                                )}
                                            </TableCell>
                                            <TableCell data-testid="table-location-year-to-value">
                                                {getFormattedByUnitOfMeasureHazardValue(
                                                    locationToValue,
                                                    unitOfMeasure
                                                )}
                                            </TableCell>
                                            <TableCell data-testid="table-location-year-change-value">
                                                <ChangeIndicator
                                                    previousValue={
                                                        locationFromValue
                                                    }
                                                    currentValue={
                                                        locationToValue
                                                    }
                                                    unitOfMeasure={
                                                        unitOfMeasure
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {ROWS_PER_PAGE_OPTIONS[0] < hazardLocations.length && (
                    <>
                        <Divider sx={{ paddingTop: '0.5rem' }} />
                        <TablePagination
                            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                            component="div"
                            count={hazardLocations.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            data-testid="table-location-pagination"
                        />
                    </>
                )}
            </Box>
        </Box>
    );
};
