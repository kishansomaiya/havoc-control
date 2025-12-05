import { Box, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RiskScoreChart } from '../../../../components/Charts/RiskScore/RiskScoreChart';
import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { LocationScoringData } from '../../../../api/queries/resultSetsQuery';
import { NO_AVAILABLE_SCORE } from '../../../../const';
import { isNumber } from '../../../../utils';
import * as Icon from 'react-feather';
import { useScoringLocationId } from '../PrortfolioScoringContext';

const getAverageScoringValue = (
    portfolioScoringData: LocationScoringData[],
    propertyName: keyof LocationScoringData
): number => {
    const allScoringValues = portfolioScoringData.map(
        (data) => data[propertyName]
    );
    const validHazardValues = allScoringValues
        .filter((value) => isNumber(value) && value !== NO_AVAILABLE_SCORE)
        .map((value) => Number(value));

    return (
        validHazardValues.reduce((acc, num) => acc + num, 0) /
        validHazardValues.length
    );
};

const scoringValueFormatter = (value: number | null) =>
    value || value === 0 ? value.toFixed() : '-';

interface AverageScoringChartsProps extends ComponentProps<typeof Box> {
    portfolioScoringData: LocationScoringData[];
    onClearLocationSelection?: () => void;
}

export const AverageScoringCharts: FC<AverageScoringChartsProps> = ({
    portfolioScoringData,
    onClearLocationSelection,
    ...props
}) => {
    const selectedLocationId = useScoringLocationId();
    const isSingleLocationChart = useMemo(() => {
        return portfolioScoringData.length === 1 && !!selectedLocationId;
    }, [portfolioScoringData.length, selectedLocationId]);

    const chartsTitle = useMemo<string>(() => {
        if (isSingleLocationChart) {
            const { locationId, locationName } = portfolioScoringData[0];
            return locationName
                ? `Location - ${locationName}`
                : `Location ID ${locationId}`;
        }

        return 'All Locations';
    }, [portfolioScoringData, isSingleLocationChart]);

    const scoringCharts = useMemo(() => {
        return [
            {
                id: 'hazard',
                title: 'Present Hazard Score',
                description: 'Measures the absolute level of hazard for 2020',
                value: getAverageScoringValue(
                    portfolioScoringData,
                    'hazardScoreValue'
                ),
            },
            {
                id: 'change',
                title: '2050 Change Score',
                description:
                    'Measures the level of change between the year in question and the hazard year (2020)',
                value: getAverageScoringValue(
                    portfolioScoringData,
                    'changeScoreValue'
                ),
            },
            {
                id: 'overall',
                title: 'Overall Score',
                description:
                    'Combines the hazard and change scores and benchmarks this value against a global weighted average of the scores in populated areas',
                value: getAverageScoringValue(
                    portfolioScoringData,
                    'overallScoreValue'
                ),
            },
        ];
    }, [portfolioScoringData]);

    const handleCloseButtonClick = useCallback(() => {
        onClearLocationSelection?.();
    }, [onClearLocationSelection]);

    return (
        <Box {...props}>
            <Box
                display="flex"
                gap={0.75}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="hazard-scores-locations-title"
                >
                    {chartsTitle}
                </Typography>
                {isSingleLocationChart && (
                    <IconButton
                        size="small"
                        sx={{ padding: '0.125rem' }}
                        onClick={handleCloseButtonClick}
                        data-testid="location-x-button"
                    >
                        <Icon.X size="0.75rem" />
                    </IconButton>
                )}
            </Box>
            <Grid
                container
                pt={2}
                pb={3}
                data-testid="hazard-scores-charts"
            >
                {scoringCharts.map(({ id, title, description, value }) => (
                    <Grid
                        xs={4}
                        key={id}
                         data-testid="hazard-scores-single-chart"
                    >
                        <RiskScoreChart
                            title={title}
                            description={description}
                            value={value}
                            scoreValueFormatter={scoringValueFormatter}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
