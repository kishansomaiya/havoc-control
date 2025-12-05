import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { ComponentProps, FC, Fragment, useMemo } from 'react';
import {
    CLIMATE_RELATED_CATEGORY_TITLES,
    CLIMATE_RELATED_HAZARD_TYPE_TITLES,
    EU_HAZARD_COLOR_BY_TYPE,
    EU_HAZARD_DESCRIPTION_TITLE_BY_TYPE,
    getCategoryWithMetricsByType,
} from '../../../../../../const';
import { useComplianceCategories } from '../../../context/ComplienceDataSettingsContext';
import {
    DisclosureAvailability,
    DisclosureType,
    EUHazardMetadata,
} from '../../../../../../api/openapi/auto-generated';
import * as Icon from 'react-feather';

const ICON_SIZE = '1.25rem';

const ICONS = {
    [DisclosureAvailability.available]: <Icon.CheckCircle size={ICON_SIZE} />,
    [DisclosureAvailability.riskDriver]: (
        <Icon.AlertTriangle size={ICON_SIZE} />
    ),
    [DisclosureAvailability.notAvailable]: <Icon.Slash size={ICON_SIZE} />,
    [DisclosureAvailability.unknownDefaultOpenApi]: (
        <Icon.Slash size={ICON_SIZE} />
    ),
};

const ColoredIcon: FC<{ availability: DisclosureAvailability }> = ({
    availability,
}) => {
    const color = EU_HAZARD_COLOR_BY_TYPE[availability];
    const icon = ICONS[availability];
    return <Box sx={{ color: color }}>{icon}</Box>;
};

const TableLegend = () => {
    return (
        <Stack
            direction="row"
            spacing={4}
            data-testid="table-body-cell-metric-exposure-legend"
        >
            {[
                DisclosureAvailability.available,
                DisclosureAvailability.riskDriver,
                DisclosureAvailability.notAvailable,
            ].map((availability: DisclosureAvailability) => {
                return (
                    <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="start"
                        data-testid="table-body-cell-metric-exposure-legend-item"
                    >
                        <ColoredIcon availability={availability} />
                        <Typography
                            data-testid="table-body-cell-metric-exposure-legend-item-label"
                            variant="body1"
                        >
                            {EU_HAZARD_DESCRIPTION_TITLE_BY_TYPE[
                                availability
                            ] || 'Not Available'}
                        </Typography>
                    </Stack>
                );
            })}
        </Stack>
    );
};

const HazardMetricDescription: FC<{
    metric: EUHazardMetadata;
    color?: string;
}> = ({ metric }) => {
    const descriptionTitle =
        EU_HAZARD_DESCRIPTION_TITLE_BY_TYPE[metric.availability];

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
        >
            <Box
                data-testid="table-body-cell-metric-exposure"
                pr={2}
            >
                <ColoredIcon availability={metric.availability} />
            </Box>
            <Box flexGrow={1}>
                <Typography
                    variant="subtitle2"
                    color="text.primary"
                    data-testid="table-body-cell-metric-title"
                    sx={{ fontWeight: 600 }}
                >
                    {metric.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontStyle: 'italic' }}
                    data-testid="table-body-cell-metric-description"
                >
                    <Box
                        sx={{
                            textDecoration: 'underline',
                            display: 'inline',
                        }}
                        component="span"
                        data-testid="table-body-cell-metric-description-source"
                    >
                        {descriptionTitle ? descriptionTitle + ':' : ''}
                    </Box>
                    {descriptionTitle ? ' ' : ''}
                    {metric.subtitle}
                </Typography>
            </Box>
        </Box>
    );
};

interface ComplianceHazardScoresTableProps extends ComponentProps<typeof Box> {
    resultSetMetadata: { [key: string]: EUHazardMetadata };
}

export const ComplianceHazardScoresTable: FC<
    ComplianceHazardScoresTableProps
> = ({ resultSetMetadata }) => {
    const enabledCategories = useComplianceCategories();

    const hazardTypes = useMemo(
        () =>
            [DisclosureType.chronic, DisclosureType.acute].map(
                (type: DisclosureType) => {
                    const categories = getCategoryWithMetricsByType(
                        type,
                        resultSetMetadata
                    );

                    const maxMetricsPerCategory = Math.max(
                        ...Object.values(categories)
                            .filter((category) =>
                                enabledCategories.includes(category.id)
                            )
                            .map((category) => category?.metrics.length)
                    );

                    return {
                        id: type,
                        title: CLIMATE_RELATED_HAZARD_TYPE_TITLES[type],
                        categories,
                        maxMetricsPerCategory,
                    };
                }
            ),
        [resultSetMetadata, enabledCategories]
    );

    return (
        <Box>
            <Stack
                justifyContent="space-between"
                alignItems="center"
                direction="row"
                mb={2}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="compliance-eu-hazard-alignment-title"
                >
                    EU Hazard Alignment
                </Typography>
                <TableLegend />
            </Stack>

            <Table data-testid="compliance-eu-hazard-alignment-table">
                <TableHead data-testid="compliance-eu-hazard-alignment-table-head">
                    <TableRow>
                        <TableCell width="4rem" />
                        {enabledCategories.map((id) => (
                            <TableCell
                                key={id}
                                align="center"
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.accent"
                                    data-testid="compliance-eu-hazard-alignment-table-head-title"
                                >
                                    {CLIMATE_RELATED_CATEGORY_TITLES[id]}
                                    -Related Hazard
                                </Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody data-testid="compliance-eu-hazard-alignment-table-body">
                    {hazardTypes.map((hazardType, hazardTypeIndex) => (
                        <Fragment key={hazardTypeIndex}>
                            {Array.from({
                                length: hazardType.maxMetricsPerCategory,
                            }).map((_, metricIndex) => (
                                <TableRow
                                    key={metricIndex}
                                    data-testid="compliance-eu-hazard-alignment-table-body-row"
                                >
                                    {metricIndex === 0 ? (
                                        <TableCell
                                            data-testid="compliance-eu-hazard-alignment-table-body-cell"
                                            rowSpan={
                                                hazardType.maxMetricsPerCategory
                                            }
                                            sx={{ borderRight: 1 }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                color="text.accent"
                                                data-testid="compliance-eu-hazard-alignment-table-body-hazard-type-title"
                                            >
                                                {hazardType.title}
                                            </Typography>
                                        </TableCell>
                                    ) : null}
                                    {enabledCategories.map((id) => {
                                        const hasMetric =
                                            !!hazardType.categories[id]
                                                ?.metrics[metricIndex];
                                        const isLastMetricInColumn =
                                            metricIndex + 1 ===
                                            hazardType.maxMetricsPerCategory;
                                        const isLastHazardTypeBlock =
                                            hazardTypeIndex + 1 ===
                                            hazardTypes.length;
                                        return (
                                            <TableCell
                                                key={
                                                    'metric' +
                                                    metricIndex +
                                                    '-' +
                                                    id
                                                }
                                                align="left"
                                                sx={{
                                                    borderBottom:
                                                        (!isLastHazardTypeBlock &&
                                                            isLastMetricInColumn) ||
                                                            (hasMetric &&
                                                                !isLastMetricInColumn)
                                                            ? 1
                                                            : 0,
                                                    borderColor:
                                                        hasMetric &&
                                                            !isLastMetricInColumn
                                                            ? 'grey.700'
                                                            : undefined,
                                                }}
                                                data-testid="table-body-cell-metric"
                                            >
                                                {hasMetric ? (
                                                    <HazardMetricDescription
                                                        metric={
                                                            hazardType
                                                                .categories[id]
                                                                ?.metrics[
                                                            metricIndex
                                                            ]
                                                        }
                                                    />
                                                ) : null}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};
