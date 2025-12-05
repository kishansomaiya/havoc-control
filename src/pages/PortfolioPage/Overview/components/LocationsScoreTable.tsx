import {
    ChangeEvent,
    ComponentProps,
    FC,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { HazardType, Score } from '../../../../types';
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
import { visuallyHidden } from '@mui/utils';
import { Link as RouterLink } from 'react-router-dom';
import { SortOrder } from '../../../../types';
import {
    HAZARD_TYPE_DESCRIPTIONS,
    HAZARD_TYPE_TITLES,
    NO_AVAILABLE_SCORE,
    ROWS_PER_PAGE_OPTIONS,
    SCORE_CHANGE_FIELDS,
    SCORE_HAZARD_FIELDS,
    SCORE_OVERALL_FIELDS,
    SCORE_HAZARD_ORDER_BY_FIELDS,
    SCORE_TITLES,
    sortComparisonValue,
} from '../../../../const';
import * as Icon from 'react-feather';
import * as React from 'react';
import { LocationWithScores } from '../PortfolioOverviewTab';
import {
    getSelectedPortfolioLocationUrl,
    numberValueFormatter,
} from '../../../../utils';

export interface LocationsScoreTableProps extends ComponentProps<typeof Box> {
    portfolioId: string;
    locationWithScores: LocationWithScores[];
    selectedScore: Score;
}

interface RankedLocation {
    id: number;
    name: string | null;
    overallHazard: number | string;
    currentHazard: number | string;
    changeHazard: number | string;
}

const getFormattedScoreValue = (value: number): string => {
    return value === null || value === NO_AVAILABLE_SCORE
        ? '-'
        : numberValueFormatter({ value });
};

export const LocationsScoreTable: FC<LocationsScoreTableProps> = ({
    portfolioId,
    locationWithScores,
    selectedScore,
}) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
    const [order, setOrder] = React.useState<SortOrder>(SortOrder.Desc);
    const [orderBy, setOrderBy] = React.useState<HazardType>(
        HazardType.Overall
    );

    const handleRequestSort = (property: HazardType) => {
        const isDesc = orderBy === property && order === SortOrder.Desc;
        setOrder(isDesc ? SortOrder.Asc : SortOrder.Desc);
        setOrderBy(property);
    };

    const rankedLocations: RankedLocation[] = useMemo(
        () =>
            locationWithScores
                .sort((locationA, locationB) => {
                    if (
                        locationA?.[
                            SCORE_HAZARD_ORDER_BY_FIELDS[orderBy][selectedScore]
                        ] <
                        locationB?.[
                            SCORE_HAZARD_ORDER_BY_FIELDS[orderBy][selectedScore]
                        ]
                    ) {
                        return sortComparisonValue[order].a_lt_b;
                    }
                    if (
                        locationA?.[
                            SCORE_HAZARD_ORDER_BY_FIELDS[orderBy][selectedScore]
                        ] >
                        locationB?.[
                            SCORE_HAZARD_ORDER_BY_FIELDS[orderBy][selectedScore]
                        ]
                    ) {
                        return sortComparisonValue[order].a_gt_b;
                    }
                    if (locationA?.locationId < locationB?.locationId) {
                        return 1;
                    }
                    if (locationA?.locationId > locationB?.locationId) {
                        return -1;
                    }
                    return 0;
                })
                .map((location) => {
                    return {
                        id: location.locationId,
                        name: location.locationName,
                        overallHazard: getFormattedScoreValue(
                            location?.[SCORE_OVERALL_FIELDS[selectedScore]]
                        ),
                        currentHazard: getFormattedScoreValue(
                            location?.[SCORE_HAZARD_FIELDS[selectedScore]]
                        ),
                        changeHazard: getFormattedScoreValue(
                            location?.[SCORE_CHANGE_FIELDS[selectedScore]]
                        ),
                    };
                }),
        [locationWithScores, selectedScore, order, orderBy]
    );

    const scoreTitle = useMemo(
        () => SCORE_TITLES[selectedScore],
        [selectedScore]
    );

    useEffect(() => {
        setPage(0);
    }, [/* effect dep */ selectedScore, /* effect dep */ rankedLocations]);

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
            height="100%"
            flexDirection="column"
            width="100%"
        >
            <Typography
                variant="overline"
                color="text.secondary"
                textTransform="uppercase"
                id={portfolioId}
                data-testid="portfolio-overview-location-score-table-title"
            >
                Locations Ranked by {scoreTitle} Score
            </Typography>
            <Box flexGrow={1}>
                <TableContainer>
                    <Table
                        size="small"
                        stickyHeader
                        data-testid="portfolio-overview-location-score-table"
                    >
                        <TableHead>
                            <TableRow
                                sx={{ bgcolor: 'background.default' }}
                                data-testid="portfolio-overview-location-score-table-header"
                            >
                                <TableCell data-testid="location-score-table-column-first">
                                    Location
                                </TableCell>
                                {Object.values(HazardType).map((hazardType) => (
                                    <TableCell
                                        key={hazardType}
                                        sortDirection={
                                            orderBy === hazardType
                                                ? order
                                                : false
                                        }
                                    >
                                        <TableSortLabel
                                            active={orderBy === hazardType}
                                            direction={
                                                orderBy === hazardType
                                                    ? order
                                                    : SortOrder.Desc
                                            }
                                            onClick={() =>
                                                handleRequestSort(hazardType)
                                            }
                                        >
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="start"
                                                gap={0.5}
                                                data-testid="portfolio-overview-location-score-table-column-name"
                                            >
                                                <span>
                                                    {
                                                        HAZARD_TYPE_TITLES[
                                                            hazardType
                                                        ]
                                                    }
                                                </span>
                                                <Tooltip
                                                    title={
                                                        HAZARD_TYPE_DESCRIPTIONS[
                                                            hazardType
                                                        ]
                                                    }
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Icon.Info
                                                        size="0.875rem"
                                                        color={
                                                            theme.palette.text
                                                                .secondary
                                                        }
                                                        data-testid="portfolio-overview-location-score-table-column-name-tooltip"
                                                    />
                                                </Tooltip>
                                            </Box>
                                            {orderBy === hazardType ? (
                                                <Box
                                                    component="span"
                                                    sx={visuallyHidden}
                                                >
                                                    {order === SortOrder.Desc
                                                        ? 'sorted descending'
                                                        : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rankedLocations
                                .slice(
                                    page * rowsPerPage,
                                    (page + 1) * rowsPerPage
                                )
                                .map((location, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={location.id}
                                            data-testid="portfolio-overview-location-score-table-row"
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                data-testid="portfolio-overview-location-score-table-location-cell"
                                            >
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
                                                        location.id
                                                    )}
                                                    ml={0.5}
                                                    data-testid="location-score-table-location-name"
                                                >
                                                    {location.name ||
                                                        `Location#${location.id}`}
                                                </Link>
                                            </TableCell>
                                            <TableCell data-testid="location-score-table-location-value-current">
                                                {location.currentHazard}
                                            </TableCell>
                                            <TableCell data-testid="location-score-table-location-value-change">
                                                {location.changeHazard}
                                            </TableCell>
                                            <TableCell data-testid="location-score-table-location-value-overall">
                                                {location.overallHazard}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {ROWS_PER_PAGE_OPTIONS[0] < rankedLocations.length && (
                    <>
                        <Divider sx={{ paddingTop: '0.5rem' }} />
                        <TablePagination
                            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                            component="div"
                            count={rankedLocations.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            data-testid="location-score-table-pagination"
                        />
                    </>
                )}
            </Box>
        </Box>
    );
};
