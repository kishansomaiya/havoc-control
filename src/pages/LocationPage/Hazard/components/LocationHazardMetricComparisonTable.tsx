import {
    Box,
    FormControlLabel,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { ComponentProps, FC, useCallback } from 'react';
import { ResultSetDataSchema } from '../../../../api/openapi/auto-generated';
import { ChangeIndicator } from '../../../../components/Table/ChangeIndicator';
import { NO_AVAILABLE_SCORE } from '../../../../const';
import {
    getFormattedByUnitOfMeasureHazardValue,
    getHazardUnitOfMeasure,
} from '../../../../utils';
import * as Icon from 'react-feather';

type MetricComparisonData = Record<string, Record<number, number | undefined>>;

interface LocationHazardMetricComparisonTableProps
    extends ComponentProps<typeof Box> {
    metrics: ResultSetDataSchema[];
    selectedMetricId: string;
    yearFrom: number;
    yearTo: number;
    onMetricIdChange?: (metricId: string) => void;
    metricComparisonData: MetricComparisonData;
}

export const LocationHazardMetricComparisonTable: FC<
    LocationHazardMetricComparisonTableProps
> = ({
    metrics,
    selectedMetricId,
    yearFrom,
    yearTo,
    onMetricIdChange,
    metricComparisonData,
    ...props
}) => {
    const theme = useTheme();

    const handleMetricSelection = useCallback(
        (metricId: string) => {
            if (metricId === selectedMetricId) {
                return;
            }
            onMetricIdChange?.(metricId);
        },
        [selectedMetricId, onMetricIdChange]
    );

    return (
        <Box
            {...props}
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="slp-hazard-metrics-table-label"
            >
                Hazard Metric Comparison {yearFrom} to {yearTo}
            </Typography>
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
                        data-testid="slp-hazard-metrics-table"
                    >
                        <TableHead data-testid="slp-hazard-metrics-table-header">
                            <TableRow data-testid="slp-hazard-metrics-table-header-row">
                                <TableCell>
                                    <Typography
                                        variant="h6"
                                        data-testid="hazard-metrics-column-name"
                                    >
                                        Hazard Metric
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="start"
                                        gap={0.5}
                                        data-testid="year-from"
                                    >
                                        <Typography
                                            variant="h6"
                                            data-testid="year-from-column-name"
                                        >
                                            {yearFrom}
                                        </Typography>
                                        <Tooltip
                                            title={`Starting year is always ${yearFrom}`}
                                            arrow
                                            placement="top"
                                            data-testid="year-from-tooltip"
                                        >
                                            <Icon.Info
                                                size="0.875rem"
                                                color={
                                                    theme.palette.text.secondary
                                                }
                                            />
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="start"
                                        gap={0.5}
                                        data-testid="year-to"
                                    >
                                        <Typography
                                            variant="h6"
                                            data-testid="year-to-column-name"
                                        >
                                            {yearTo}
                                        </Typography>
                                        <Tooltip
                                            title={`Mean value for selected Metric and ${yearTo} year`}
                                            arrow
                                            placement="top"
                                            data-testid="year-to-tooltip"
                                        >
                                            <Icon.Info
                                                size="0.875rem"
                                                color={
                                                    theme.palette.text.secondary
                                                }
                                            />
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="start"
                                        gap={0.5}
                                        data-testid="change"
                                    >
                                        <Typography
                                            variant="h6"
                                            data-testid="change-column-name"
                                        >
                                            Change
                                        </Typography>
                                        <Tooltip
                                            title={`Difference between "${yearTo}" and "${yearFrom}" values`}
                                            arrow
                                            placement="top"
                                            data-testid="change-tooltip"
                                        >
                                            <Icon.Info
                                                size="0.875rem"
                                                color={
                                                    theme.palette.text.secondary
                                                }
                                            />
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {metrics.map((metric) => {
                                const previousValue =
                                    metricComparisonData[metric.id][yearFrom];
                                const currentValue =
                                    metricComparisonData[metric.id][yearTo];
                                const unitOfMeasure =
                                    getHazardUnitOfMeasure(metric);

                                return (
                                    <TableRow
                                        onClick={() =>
                                            handleMetricSelection(metric.id)
                                        }
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={metric.id}
                                        data-testid="table-row"
                                    >
                                        <TableCell>
                                            <FormControlLabel
                                                value={metric.id}
                                                control={
                                                    <Radio
                                                        color="secondary"
                                                        checked={
                                                            selectedMetricId ===
                                                            metric.id
                                                        }
                                                        data-testid="table-radio-button"
                                                    />
                                                }
                                                label={metric.enhancedName}
                                                data-testid="table-row-label"
                                            />
                                        </TableCell>
                                        <TableCell data-testid="table-year-from-value">
                                            {getFormattedByUnitOfMeasureHazardValue(
                                                previousValue,
                                                unitOfMeasure
                                            )}
                                        </TableCell>
                                        <TableCell data-testid="table-year-to-value">
                                            {getFormattedByUnitOfMeasureHazardValue(
                                                currentValue,
                                                unitOfMeasure
                                            )}
                                        </TableCell>
                                        <TableCell data-testid="table-change-value">
                                            <ChangeIndicator
                                                previousValue={
                                                    previousValue ===
                                                    NO_AVAILABLE_SCORE
                                                        ? undefined
                                                        : previousValue
                                                }
                                                currentValue={
                                                    currentValue ===
                                                    NO_AVAILABLE_SCORE
                                                        ? undefined
                                                        : currentValue
                                                }
                                                unitOfMeasure={unitOfMeasure}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
