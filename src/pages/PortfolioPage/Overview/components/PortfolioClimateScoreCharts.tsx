import { ComponentProps, FC, useEffect, useState, useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Typography } from '@mui/material';
import { RiskScoreChart } from '../../../../components/Charts/RiskScore/RiskScoreChart';
import { Score } from '../../../../types';
import {
    NO_AVAILABLE_SCORE,
    SCORE_OVERALL_FIELDS,
    SCORE_TITLES_LONG,
} from '../../../../const';
import { SCORE_DESCRIPTIONS } from '../../../../const';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { LocationWithScores } from '../PortfolioOverviewTab';
import { isVersionGreaterOrEqual } from '../../../../utils/portfolio.util';

interface PerilScore {
    title: string;
    description: string;
    scoreValue: number;
    locationsCount: number;
}

type PerilScores = {
    [key in Score]: PerilScore;
};

const PERIL_INITIAL_SCORES: PerilScores = Object.values(Score).reduce(
    (reducer, score) => {
        return {
            ...reducer,
            [score]: {
                title: SCORE_TITLES_LONG[score],
                description: SCORE_DESCRIPTIONS[score],
                scoreValue: 0,
                locationsCount: 0,
            },
        };
    },
    {}
) as PerilScores;

export interface PortfolioClimateScoreChartProps
    extends ComponentProps<typeof Box> {
    locationWithScores: LocationWithScores[];
    dataVersion: string | null;
}

export const PortfolioClimateScoreCharts: FC<
    PortfolioClimateScoreChartProps
> = ({ locationWithScores, dataVersion }) => {
    const [perilScores, setPerilScores] =
        useState<PerilScores>(PERIL_INITIAL_SCORES);
    const windowSize = useWindowSize();

    // Check if data version is >= 3.3.0
    const isSubsidenceEnabled = useMemo(
        () => isVersionGreaterOrEqual(dataVersion, '3.3.0'),
        [dataVersion]
    );

    const SortedScores = useMemo(
        () => [
            Score.Flood,
            Score.Wind,
            Score.Fire,
            Score.Heat,
            Score.Precipitation,
            Score.Cold,
            Score.Drought,
            Score.Hail,
            ...(isSubsidenceEnabled ? [Score.Subsidence] : []),
        ],
        [isSubsidenceEnabled]
    );

    const MEDIUM_CHART_SCORES = useMemo(
        () =>
            Object.values(Score)
                .filter((score) => score !== Score.All)
                .sort(
                    (scoreA, scoreB) =>
                        SortedScores.indexOf(scoreA) - SortedScores.indexOf(scoreB)
                ),
        [SortedScores]
    );

    useEffect(() => {
        if (locationWithScores.length === 0) {
            setPerilScores(PERIL_INITIAL_SCORES);
            return;
        }

        setPerilScores(
            Object.values(Score).reduce((result: PerilScores, score) => {
                const locationsWithAvailableScores = locationWithScores.filter(
                    (location) => {
                        return (
                            location?.[SCORE_OVERALL_FIELDS[score]] !==
                            NO_AVAILABLE_SCORE
                        );
                    }
                );

                const totalValueOfLocationHazardByScore =
                    locationsWithAvailableScores.reduce((total, location) => {
                        return total + location?.[SCORE_OVERALL_FIELDS[score]];
                    }, 0);

                return {
                    ...result,
                    [score]: {
                        ...PERIL_INITIAL_SCORES[score],
                        scoreValue: Math.round(
                            totalValueOfLocationHazardByScore /
                            locationsWithAvailableScores.length
                        ),
                        locationsCount: locationsWithAvailableScores.length,
                    },
                };
            }, {} as PerilScores)
        );

        return () => {
            setPerilScores(PERIL_INITIAL_SCORES);
        };
    }, [locationWithScores]);

    return (
        <Box>
            <Grid
                container
                pb={3}
                data-testid="portfolio-overview-climate-score-chart-header"
            >
                <Grid xs={8}>
                    <Typography
                        variant="h1"
                        pb={1}
                        data-testid="portfolio-overview-climate-score-chart-header-title"
                    >
                        Portfolio Climate Scores
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid="portfolio-overview-climate-score-chart-header-description"
                    >
                        Jupiter Climate Scores translate physical climate
                        hazards into a score, calculated on a scale from 0-100
                        using the SSP5-8.5 scenario. The scores use the years
                        2020 and 2050 to measure the change in climate hazard. A
                        lower score reflects less exposure to climate.
                    </Typography>
                </Grid>
                <Grid xs={4}>
                    <RiskScoreChart
                        title={perilScores[Score.All].title}
                        size={windowSize.height > 760 ? 'large' : 'medium'}
                        value={perilScores[Score.All].scoreValue}
                        data-testid="portfolio-overview-climate-risk-score-chart"
                    />
                </Grid>
            </Grid>
            <Grid
                container
                rowSpacing={3}
                columnSpacing={isSubsidenceEnabled ? 3 : 0}
                data-testid="portfolio-overview-climate-risk-score-small-charts"
            >
                {MEDIUM_CHART_SCORES.map((score) => (
                    <Grid
                        key={score}
                        xs={isSubsidenceEnabled ? 4 : 3}
                        md={isSubsidenceEnabled ? 4 : 3}
                        lg={isSubsidenceEnabled ? 4 : 3}
                        data-testid="portfolio-overview-climate-risk-score-small-charts-item"
                    >
                        <RiskScoreChart
                            title={perilScores[score].title}
                            description={perilScores[score].description}
                            value={perilScores[score].scoreValue}
                            scoreValueFormatter={(value) =>
                                value && perilScores[score].locationsCount > 0
                                    ? value.toString()
                                    : '-'
                            }
                            data-testid="risk-score-small-charts-item"
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};