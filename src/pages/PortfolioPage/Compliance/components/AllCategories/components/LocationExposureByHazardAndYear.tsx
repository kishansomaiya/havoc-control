import { Box, Grid, Typography } from '@mui/material';
import { ClimateRelatedHazardChart } from '../../shared/ClimateRelatedHazardChart/ClimateRelatedHazardChart';
import { ScoreLevelsMapLegend } from '../../../../../../components/Map/ScoreLevelsMapLegend';
import {
    CLIMATE_RELATED_CATEGORY_TITLES,
    SCORE_LEVEL_COLORS,
} from '../../../../../../const';
import {
    useComplianceCategories,
    useComplianceEUMetrics,
} from '../../../context/ComplienceDataSettingsContext';
import { ComponentProps, FC, useMemo } from 'react';
import {
    DisclosureCategory,
    EUHazardMetadata,
} from '../../../../../../api/openapi/auto-generated';
import { IPortfolioItem, ScoreLevel } from '../../../../../../types';
import { SCORE_LEVEL_TITLES } from '../../../../../../const/scoreLevelTitles';
import { useOutletContext } from 'react-router';
import { numberValueFormatter } from '../../../../../../utils';

interface Props extends ComponentProps<typeof Box> {
    years: number[];
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    portfolioComplianceData: { [key: string]: string | number }[];
}

export const LocationExposureByHazardAndYear: FC<Props> = ({
    years,
    resultSetMetadata,
    portfolioComplianceData,
}) => {
    const enabledCategories = useComplianceCategories();
    const euMetrics = useComplianceEUMetrics();
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();

    const jupiterMetricsByEnabledCategories = useMemo(() => {
        return enabledCategories.reduce(
            (acc, category) => {
                acc[category] = Array.from(
                    new Set(
                        euMetrics
                            .filter(
                                (key) =>
                                    category ===
                                    resultSetMetadata[key]?.category
                            )
                            .flatMap(
                                (key) =>
                                    resultSetMetadata[key]?.overviewMetrics ||
                                    []
                            )
                    )
                ).map((metric) =>
                    metric.endsWith('mean')
                        ? metric.replace('mean', 'tier')
                        : metric
                );
                return acc;
            },
            {} as { [key in DisclosureCategory]: string[] }
        );
    }, [euMetrics, enabledCategories, resultSetMetadata]);

    return (
        <Box>
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="location-exposure-by-hazard-and-year-title"
            >
                Location Exposure By Hazard And Year
            </Typography>
            <Grid
                container
                pt={3}
                pl={5}
                data-testid="location-exposure-by-hazard-and-year-charts"
            >
                {enabledCategories.map((id, index) => (
                    <Grid
                        key={id}
                        item
                        xs={12 / enabledCategories.length}
                        data-testid="hazard-related-chart"
                    >
                        <Typography
                            variant="body2"
                            align="center"
                            pb={3}
                            data-testid="hazard-related-chart-title"
                        >
                            {CLIMATE_RELATED_CATEGORY_TITLES[id]}-related
                        </Typography>
                        <Box
                            ml={index === 0 ? -5 : 0}
                            data-testid="hazard-related-chart-graph"
                        >
                            <ClimateRelatedHazardChart
                                years={years}
                                jupiterMetrics={
                                    jupiterMetricsByEnabledCategories[id]
                                }
                                portfolioComplianceData={
                                    portfolioComplianceData
                                }
                                height={240}
                                margin={{
                                    top: 5,
                                    left: index === 0 ? 80 : 40,
                                    right: 0,
                                    bottom: 20,
                                }}
                                yAxis={[
                                    {
                                        tickSize: index === 0 ? 6 : 40,
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
                                sx={
                                    index === 0
                                        ? {
                                              ['& .MuiChartsAxis-directionY .MuiChartsAxis-label ']:
                                                  {
                                                      transform:
                                                          'translateX(-2.5rem) !important',
                                                      fill: (theme) =>
                                                          theme.palette.text
                                                              .secondary,
                                                  },
                                          }
                                        : {
                                              ['& .MuiChartsAxis-directionY .MuiChartsAxis-line']:
                                                  {
                                                      display: 'none',
                                                  },
                                              ['& .MuiChartsAxis-directionY .MuiChartsAxis-tick']:
                                                  {
                                                      stroke: 'rgba(255, 255, 255, 0.12)',
                                                      strokeWidth: 1,
                                                  },
                                              ['& .MuiChartsAxis-directionY .MuiChartsAxis-tickContainer:first-of-type .MuiChartsAxis-tick']:
                                                  {
                                                      display: 'block',
                                                  },
                                          }
                                }
                                grid={{
                                    horizontal: true,
                                }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
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
                />
            </Box>
        </Box>
    );
};
