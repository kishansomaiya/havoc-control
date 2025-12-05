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
    Typography,
} from '@mui/material';
import { ChangeEvent, ComponentProps, FC, useMemo, useState } from 'react';
import {
    NO_AVAILABLE_SCORE,
    ROWS_PER_PAGE_OPTIONS,
} from '../../../../../../const';
import { Link as RouterLink } from 'react-router-dom';
import { getSelectedPortfolioLocationUrl } from '../../../../../../utils';
import * as React from 'react';

interface RankedLocation {
    id: number;
    name: string | null;
    hazardValueByYear: (number | null)[];
}

interface LocationsRankedByComplianceTableProps
    extends ComponentProps<typeof Box> {
    years: number[];
    portfolioComplianceData: { [key: string]: string | number }[];
    jupiterMetric: string;
    portfolioId: string;
}

function convertHazardValueToNumber(value: null | number | undefined): number {
    if (!value) {
        return 0;
    }
    if (value === NO_AVAILABLE_SCORE) {
        return 0;
    }
    return value;
}

export const LocationsRankedByComplianceTable: FC<
    LocationsRankedByComplianceTableProps
> = ({
    years,
    portfolioComplianceData,
    jupiterMetric,
    portfolioId,
    ...props
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

    const locationsWithHazard = useMemo<RankedLocation[]>(() => {
        const groupedData = portfolioComplianceData.reduce(
            (acc, item) => {
                const locationId: number = item.locationId as number;
                if (!acc[locationId]) {
                    acc[locationId] = {
                        id: locationId,
                        name: item.locationName as string,
                        hazardValueByYear: Array(years.length).fill(null),
                    };
                }
                const yearIndex = years.indexOf(item.year as number); // Знаходимо індекс року
                if (yearIndex >= 0) {
                    acc[locationId].hazardValueByYear[yearIndex] = item[
                        jupiterMetric
                    ] as number | null;
                }
                return acc;
            },
            {} as Record<
                number,
                {
                    id: number;
                    name: string | null;
                    hazardValueByYear: (number | null)[];
                }
            >
        );

        return Object.values(groupedData).sort((locationA, locationB) =>
            convertHazardValueToNumber(locationA.hazardValueByYear[0]) >
            convertHazardValueToNumber(locationB.hazardValueByYear[0])
                ? -1
                : 1
        );
    }, [portfolioComplianceData, years, jupiterMetric]);

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
        <Box {...props}>
            <TableContainer>
                <Table
                    size="small"
                    stickyHeader
                >
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.default' }}>
                            <TableCell>
                                <Typography variant="h6">Location</Typography>
                            </TableCell>
                            {years.map((year) => (
                                <TableCell key={year}>
                                    <Typography variant="h6">{year}</Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locationsWithHazard
                            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
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
                                                {page * rowsPerPage + index + 1}
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
                                        {years.map((year, yearIndex) => {
                                            const hazardValue =
                                                location.hazardValueByYear[
                                                    yearIndex
                                                ];
                                            return (
                                                <TableCell
                                                    key={
                                                        location.id.toString() +
                                                        year.toString()
                                                    }
                                                    data-testid={
                                                        'location-score-table-location-value-' +
                                                        year
                                                    }
                                                >
                                                    {!hazardValue ||
                                                    hazardValue ===
                                                        NO_AVAILABLE_SCORE
                                                        ? '-'
                                                        : hazardValue}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            {ROWS_PER_PAGE_OPTIONS[0] < locationsWithHazard.length && (
                <>
                    <Divider sx={{ paddingTop: '0.5rem' }} />
                    <TablePagination
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        component="div"
                        count={locationsWithHazard.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        data-testid="compliance-score-table-pagination"
                    />
                </>
            )}
        </Box>
    );
};
