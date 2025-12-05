import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
} from '@mui/material';
import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { YearBasedLineChart } from '../../../../components/Charts/Line/YearBasedLineChart';
import {
    ImpactType,
    LocationImpactGroup,
    LocationImpactMetric,
    LossType,
} from '../../../../types';
import {
    IMPACT_TYPE_TITLES,
    LOCATION_IMPACT_METRIC_COLOR,
    METRIC_GROUP_MAP,
    UNIT_OF_MEASURE_FRACTION_DIGITS,
} from '../../../../const';
import { useImpactGroupOptions } from '../../../../hooks/useImpactGroupOptions';
import {
    getLocationImpactUnitOfMeasure,
    tooltipValueFormatter,
} from '../../../../utils';

const toggleButtonStyle = { minWidth: '5rem' };

interface LocationImpactSeriesData {
    data: number[];
    id: LocationImpactMetric;
    legend: string;
}

interface LocationImpactSeriesConfig extends LocationImpactSeriesData {
    color: string;
    showMark: boolean;
}

const SELECTED_METRICS_BY_DEFAULT = [
    LocationImpactMetric.Flood,
    LocationImpactMetric.Wind,
    LocationImpactMetric.Wildfire,
    LocationImpactMetric.HeatCooling,
    LocationImpactMetric.HeatProductivity,
    LocationImpactMetric.Drought,
];

interface LocationDamageAndLossGraphProps extends ComponentProps<typeof Box> {
    yearsRange: number[];
    graphData: LocationImpactSeriesData[];
    impactType: ImpactType;
    lossType: LossType;
    currencyCode: string;
}

export const LocationDamageAndLossGraph: FC<
    LocationDamageAndLossGraphProps
> = ({
    yearsRange,
    graphData,
    impactType,
    lossType,
    currencyCode,
    ...props
}) => {
    const [impactGroup, setImpactGroup] = useState<LocationImpactGroup>(
        LocationImpactGroup.Acute
    );
    const impactGroupOptions = useImpactGroupOptions();
    const [visibleMetrics, setVisibleMetrics] = useState<
        LocationImpactMetric[]
    >([]);
    const [selectedMetrics, setSelectedMetrics] = useState<
        LocationImpactMetric[]
    >(SELECTED_METRICS_BY_DEFAULT);
    const [series, setSeries] = useState<LocationImpactSeriesConfig[]>([]);

    useEffect(() => {
        if (!lossType) {
            return;
        }

        setImpactGroup(LocationImpactGroup.Acute);
    }, [lossType]);

    useEffect(() => {
        setSeries(
            graphData
                .filter(
                    ({ id }) =>
                        selectedMetrics.includes(id) &&
                        METRIC_GROUP_MAP[id] === impactGroup
                )
                .map(({ data, id, legend }) => {
                    return {
                        data,
                        id,
                        legend,
                        label: legend,
                        showMark: true,
                        color: LOCATION_IMPACT_METRIC_COLOR[id],
                        valueFormatter: (value: number) => {
                            const unitOfMeasure =
                                getLocationImpactUnitOfMeasure({
                                    impactType,
                                    locationImpactMetric: id,
                                });
                            const fractionDigits =
                                unitOfMeasure &&
                                UNIT_OF_MEASURE_FRACTION_DIGITS[unitOfMeasure];
                            return tooltipValueFormatter(value, fractionDigits);
                        },
                    };
                })
        );
    }, [graphData, selectedMetrics, impactGroup, impactType]);

    useEffect(() => {
        const defaultMetrics = graphData
            .filter(({ id }) => METRIC_GROUP_MAP[id] === impactGroup)
            .map(({ id }) => id);
        setVisibleMetrics(defaultMetrics);
    }, [graphData, impactGroup]);

    const handleMetricSelectionChange = useCallback(
        (metric: LocationImpactMetric, checked: boolean) => {
            if (checked && selectedMetrics.includes(metric)) {
                return;
            }

            if (!checked && !selectedMetrics.includes(metric)) {
                return;
            }

            if (checked) {
                setSelectedMetrics([...selectedMetrics, metric]);
                return;
            }

            setSelectedMetrics(
                selectedMetrics.filter(
                    (selectedMetric) => selectedMetric !== metric
                )
            );
        },
        [selectedMetrics]
    );

    const visibleLegend = useMemo(() => {
        return graphData
            .filter(({ id }) => visibleMetrics.includes(id))
            .map(({ id, legend }) => {
                return {
                    id,
                    legend,
                    color: LOCATION_IMPACT_METRIC_COLOR[id],
                };
            });
    }, [visibleMetrics, graphData]);

    const yAxisLabel = useMemo(() => {
        if (impactType === ImpactType.Loss) {
            return 'Loss' + (currencyCode ? ` (${currencyCode})` : '');
        }

        return (
            (impactGroup === LocationImpactGroup.Acute ? '% ' : '') + 'Damage'
        );
    }, [currencyCode, impactType, impactGroup]);

    return (
        <Box
            {...props}
            height="100%"
            display="flex"
            flexDirection="column"
            data-testid="slp-damage-loss-graph"
        >
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="slp-damage-loss-graph-label"
                >
                    Average Annual {IMPACT_TYPE_TITLES[impactType]} Over Time
                </Typography>
                <Box>
                    <ButtonGroup
                        variant="outlined"
                        size="small"
                        data-testid="slp-damage-loss-graph-buttons"
                    >
                        {impactGroupOptions.map((impactGroupOption) => (
                            <Button
                                key={impactGroupOption.id}
                                variant={
                                    impactGroupOption.id === impactGroup
                                        ? 'contained'
                                        : undefined
                                }
                                onClick={() =>
                                    setImpactGroup(impactGroupOption.id)
                                }
                                disabled={
                                    lossType !== LossType.Total &&
                                    impactGroupOption.id ===
                                        LocationImpactGroup.Chronic
                                }
                                data-testid="slp-damage-loss-graph-button"
                            >
                                <span style={toggleButtonStyle}>
                                    {impactGroupOption.title}
                                </span>
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>
            </Box>
            <Box
                flexGrow="1"
                overflow="auto"
                pt={2}
                data-testid="slp-damage-loss-graph-chart"
            >
                {yearsRange?.length > 0 && (
                    <YearBasedLineChart
                        yearsRange={yearsRange}
                        series={series}
                        yAxisLabel={yAxisLabel}
                    />
                )}
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                pt={2}
                minHeight={'3.625rem'}
            >
                <FormGroup row>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={3}
                        data-testid="slp-damage-loss-graph-checkboxes"
                    >
                        {visibleLegend.map(({ legend, color, id }) => (
                            <Box
                                key={id}
                                display="flex"
                                alignItems="center"
                                data-testid="slp-damage-loss-graph-checkbox"
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedMetrics.includes(
                                                id
                                            )}
                                            onChange={(_, checked) => {
                                                handleMetricSelectionChange(
                                                    id,
                                                    checked
                                                );
                                            }}
                                            sx={{
                                                color,
                                                '&.Mui-checked': {
                                                    color,
                                                },
                                            }}
                                        />
                                    }
                                    data-testid="slp-damage-loss-graph-checkbox-label"
                                    label={legend}
                                />
                            </Box>
                        ))}
                    </Box>
                </FormGroup>
            </Box>
        </Box>
    );
};
