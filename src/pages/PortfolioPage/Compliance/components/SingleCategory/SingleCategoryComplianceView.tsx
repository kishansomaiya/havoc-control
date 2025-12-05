import {
    Box,
    Divider,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';
import { ComponentProps, FC, useCallback, useMemo, useState } from 'react';
import {
    CLIMATE_RELATED_CATEGORY_TITLES,
    SCORE_LEVEL_COLORS,
} from '../../../../../const';
import Grid from '@mui/material/Unstable_Grid2';
import { ClimateRelatedHazardChart } from '../shared/ClimateRelatedHazardChart/ClimateRelatedHazardChart';
import { ScoreLevelsMapLegend } from '../../../../../components/Map/ScoreLevelsMapLegend';
import { HazardMetricSelector } from './components/HazardMetricSelector';
import { LocationsRankedByComplianceTable } from './components/LocationsRankedByComplianceTable';
import {
    DisclosureCategory,
    DisclosureMetricMetadata,
    EUHazardMetadata,
} from '../../../../../api/openapi/auto-generated';
import { useComplianceEUMetrics } from '../../context/ComplienceDataSettingsContext';
import { SCORE_LEVEL_TITLES } from '../../../../../const/scoreLevelTitles';
import { IPortfolioItem, ScoreLevel } from '../../../../../types';
import { useOutletContext } from 'react-router';
import { numberValueFormatter } from '../../../../../utils';

interface SingleCategoryComplianceViewProps extends ComponentProps<typeof Box> {
    category: DisclosureCategory;
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    years: number[];
    portfolioComplianceData: { [key: string]: string | number }[];
}

export const SingleCategoryComplianceView: FC<
    SingleCategoryComplianceViewProps
> = ({ category, resultSetMetadata, years, portfolioComplianceData }) => {
    const euMetrics = useComplianceEUMetrics();
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();
    const [useAllMetrics, setUseAllMetrics] = useState<boolean>(true);
    const [selectedJupiterMetric, setSelectedJupiterMetric] = useState<
        DisclosureMetricMetadata | undefined
    >();

    const resultSetMetadataWithOnlyEnabledMetrics = useMemo(
        () =>
            Object.keys(resultSetMetadata)
                .filter((key) => euMetrics.includes(key))
                .reduce(
                    (filtered, key) => {
                        filtered[key] = resultSetMetadata[key];
                        return filtered;
                    },
                    {} as { [key: string]: EUHazardMetadata }
                ),
        [resultSetMetadata, euMetrics]
    );

    const allOverviewJupiterMeanMetricIds = useMemo(
        () =>
            Array.from(
                new Set(
                    euMetrics
                        .filter(
                            (key) =>
                                category === resultSetMetadata[key]?.category
                        )
                        .flatMap(
                            (key) =>
                                resultSetMetadata[key]?.overviewMetrics || []
                        )
                )
            ).map((metric) =>
                metric.endsWith('mean')
                    ? metric.replace('mean', 'tier')
                    : metric
            ),
        [euMetrics, resultSetMetadata, category]
    );

    const handleUseAllMetricsToggle = useCallback(() => {
        setUseAllMetrics(!useAllMetrics);
    }, [useAllMetrics]);

    const handleMetricChange = useCallback(
        (jupiterMetric: DisclosureMetricMetadata) => {
            setSelectedJupiterMetric(jupiterMetric);
        },
        []
    );

    const chartMetrics = useMemo<string[]>(() => {
        return useAllMetrics || !selectedJupiterMetric
            ? allOverviewJupiterMeanMetricIds
            : [selectedJupiterMetric.tierName];
    }, [useAllMetrics, selectedJupiterMetric, allOverviewJupiterMeanMetricIds]);

    const chartTitle = useMemo<string>(() => {
        const allMetricsTitle = `${CLIMATE_RELATED_CATEGORY_TITLES[category]} Exposure by Year and Scenario`;
        return useAllMetrics || !selectedJupiterMetric
            ? allMetricsTitle
            : selectedJupiterMetric.enhancedName;
    }, [category, useAllMetrics, selectedJupiterMetric]);

    return (
        <Box
            flexGrow={1}
            overflow="auto"
            position="relative"
            data-testid="compliance-charts-single"
        >
            <Grid
                container
                height="100%"
            >
                <Grid xs={6}>
                    <Box
                        px={4}
                        py={2}
                        data-testid="compliance-related-hazards"
                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="overline"
                                color="text.secondary"
                                data-testid="compliance-related-hazards-title"
                            >
                                {CLIMATE_RELATED_CATEGORY_TITLES[category]}
                                -related Hazards
                            </Typography>
                            <FormControlLabel
                                data-testid="compliance-charts-single-category-select-all-toggle"
                                control={
                                    <Switch
                                        color="secondary"
                                        checked={useAllMetrics}
                                        onChange={handleUseAllMetricsToggle}
                                    />
                                }
                                label="Select all"
                            />
                        </Box>

                        <Box
                            pt={2}
                            data-testid="compliance-hazard-metric-selector"
                        >
                            <HazardMetricSelector
                                category={category}
                                resultSetMetadata={
                                    resultSetMetadataWithOnlyEnabledMetrics
                                }
                                disabled={useAllMetrics}
                                onMetricChange={handleMetricChange}
                            />
                        </Box>
                    </Box>
                    <Divider />
                    {selectedJupiterMetric && !useAllMetrics ? (
                        <Box
                            px={4}
                            py={2}
                            data-testid="compliance-charts-single-category-location-table"
                        >
                            <Typography
                                variant="overline"
                                color="text.secondary"
                                data-testid="compliance-charts-single-category-location-table-title"
                            >
                                Locations Ranked by{' '}
                                {selectedJupiterMetric.enhancedName}
                            </Typography>

                            <LocationsRankedByComplianceTable
                                years={years}
                                portfolioComplianceData={
                                    portfolioComplianceData
                                }
                                portfolioId={portfolioItem.id}
                                jupiterMetric={selectedJupiterMetric.name}
                                ml={-2}
                                pt={2}
                                data-testid="locations-ranked-by-compliance-table"
                            />
                        </Box>
                    ) : null}
                </Grid>
                <Grid xs={0}>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid
                    xs={6}
                    px={4}
                    py={2}
                    data-testid="compliance-category-exposure-by-year-and-scenario"
                >
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        data-testid="compliance-category-exposure-by-year-and-scenario-title"
                    >
                        {chartTitle}
                    </Typography>
                    <ClimateRelatedHazardChart
                        jupiterMetrics={chartMetrics}
                        years={years}
                        portfolioComplianceData={portfolioComplianceData}
                        height={400}
                        showLocationsCountInTooltip={!useAllMetrics}
                        margin={{ right: 0, bottom: 20, left: 64 }}
                        yAxis={[
                            {
                                label: 'Number Of Locations',
                                labelStyle: {
                                    fontSize: '0.75rem',
                                },
                                min: 0,
                                max: portfolioItem.locationCount,
                                tickNumber: !portfolioItem.locationCount
                                    ? undefined
                                    : portfolioItem.locationCount < 5
                                      ? portfolioItem.locationCount
                                      : 5,
                                valueFormatter: (value: number) =>
                                    value % 1 != 0
                                        ? ''
                                        : numberValueFormatter({
                                              value,
                                              withDecimal: false,
                                          }),
                            },
                        ]}
                        grid={{
                            horizontal: true,
                        }}
                        sx={{
                            ['& .MuiChartsAxis-directionY .MuiChartsAxis-label ']:
                                {
                                    transform: 'translateX(-1.5rem) !important',
                                    fill: (theme) =>
                                        theme.palette.text.secondary,
                                },
                        }}
                    />
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        data-testid="hazard-related-chart-graph-legend"
                    >
                        <ScoreLevelsMapLegend
                            title=""
                            width="6.6rem"
                            highestLabel={SCORE_LEVEL_TITLES[ScoreLevel.NA]}
                            colors={[SCORE_LEVEL_COLORS[ScoreLevel.NA]]}
                            lowestLabel=""
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'visible',
                                paddingRight: '2.3rem',
                            }}
                        />
                        <ScoreLevelsMapLegend
                            title=""
                            width="18rem"
                            lowestLabel="Lowest Exposure"
                            highestLabel="Highest Exposure"
                            data-testid="compliance-category-exposure-by-year-and-scenario-chart-legend"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
