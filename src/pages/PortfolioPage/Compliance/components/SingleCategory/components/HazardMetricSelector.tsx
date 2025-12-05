import {
    Box,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    CLIMATE_RELATED_HAZARD_TYPE_TITLES,
    getEUMetricsByCategoryAndType,
} from '../../../../../../const';
import {
    ChangeEvent,
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    DisclosureCategory,
    DisclosureMetricMetadata,
    DisclosureType,
    EUHazardMetadata,
} from '../../../../../../api/openapi/auto-generated';

interface Props extends ComponentProps<typeof FormControl> {
    category: DisclosureCategory;
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    onMetricChange: (metric: DisclosureMetricMetadata) => void;
}

export const HazardMetricSelector: FC<Props> = ({
    category,
    resultSetMetadata,
    onMetricChange,
    ...props
}) => {
    const [selectedMetric, setSelectedMetric] = useState<string | undefined>();

    const jupiterMetricsByType = useMemo<
        Record<DisclosureType, DisclosureMetricMetadata[]>
    >(() => {
        return [DisclosureType.chronic, DisclosureType.acute].reduce(
            (acc, type) => {
                const euMetricsByType = getEUMetricsByCategoryAndType(
                    category,
                    type,
                    resultSetMetadata
                );
                const allJupiterMetrics = euMetricsByType.flatMap(
                    (item) => item.metrics
                );
                acc[type] = Array.from(
                    new Map(
                        allJupiterMetrics.map((metric) => [metric.name, metric])
                    ).values()
                );
                return acc;
            },
            {} as Record<DisclosureType, DisclosureMetricMetadata[]>
        );
    }, [category, resultSetMetadata]);

    const nonEmptyTypes = useMemo<DisclosureType[]>(() => {
        return Object.entries(jupiterMetricsByType)
            .filter(([, metrics]) => metrics.length > 0)
            .map(([type]) => type as DisclosureType);
    }, [jupiterMetricsByType]);

    const allJupiterMetrics: DisclosureMetricMetadata[] = useMemo(
        () => [
            ...jupiterMetricsByType[DisclosureType.chronic],
            ...jupiterMetricsByType[DisclosureType.acute],
        ],
        [jupiterMetricsByType]
    );

    const defaultMetric = useMemo<DisclosureMetricMetadata>(() => {
        return allJupiterMetrics[0];
    }, [allJupiterMetrics]);

    useEffect(() => {
        const allJupiterMetricNames = [
            ...jupiterMetricsByType[DisclosureType.chronic],
            ...jupiterMetricsByType[DisclosureType.acute],
        ].map((metric) => metric.name);

        if (
            !!selectedMetric &&
            allJupiterMetricNames.includes(selectedMetric)
        ) {
            return;
        }

        setSelectedMetric(defaultMetric.name);
        onMetricChange(defaultMetric);
    }, [defaultMetric, jupiterMetricsByType, selectedMetric, onMetricChange]);

    const handleValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const metricId = event.target.value;
            const metric = allJupiterMetrics.find(
                ({ name }) => name === metricId
            );
            setSelectedMetric(metricId);
            if (!metric) {
                return;
            }
            onMetricChange(metric);
        },
        [onMetricChange, allJupiterMetrics]
    );

    return (
        <FormControl
            fullWidth
            {...props}
        >
            {selectedMetric ? (
                <RadioGroup
                    aria-labelledby="metrics-radio-buttons-group-label"
                    value={selectedMetric}
                    onChange={handleValueChange}
                    name="radio-buttons-group"
                    data-testid="metrics-radio-groups"
                >
                    <Grid container>
                        {nonEmptyTypes.map((type) => (
                            <Grid
                                xs={12 / (nonEmptyTypes.length || 1)}
                                key={type}
                                data-testid="metrics-radio-group"
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.highlighted"
                                    data-testid="metrics-radio-group-title"
                                    pb={2}
                                >
                                    {CLIMATE_RELATED_HAZARD_TYPE_TITLES[type]}
                                </Typography>
                                {jupiterMetricsByType[type].map(
                                    (jupiterMetric) => (
                                        <Box
                                            key={jupiterMetric.name}
                                            data-testid="metrics-radio-button"
                                            mb={1}
                                        >
                                            <Tooltip
                                                title={
                                                    props?.disabled
                                                        ? 'Before selecting specific metric uncheck "Select all" toggle first'
                                                        : null
                                                }
                                                arrow
                                                placement="top"
                                                data-testid="metric-radio-button-tooltip"
                                            >
                                                <FormControlLabel
                                                    sx={{
                                                        color: 'text.highlighted',
                                                    }}
                                                    value={jupiterMetric.name}
                                                    control={
                                                        <Radio color="secondary" />
                                                    }
                                                    label={
                                                        jupiterMetric.enhancedName
                                                    }
                                                    slotProps={{
                                                        typography: {
                                                            lineHeight: 1.2,
                                                        },
                                                    }}
                                                    data-testid="metrics-radio-button-label"
                                                />
                                            </Tooltip>
                                        </Box>
                                    )
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </RadioGroup>
            ) : null}
        </FormControl>
    );
};
