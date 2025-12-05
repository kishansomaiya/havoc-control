import { Box } from '@mui/material';
import { ComponentProps, FC, useMemo } from 'react';
import {
    ImpactType,
    LocationDamageAndLossData,
    LocationImpactMetric,
    LossType,
} from '../../../../types';
import Grid from '@mui/material/Unstable_Grid2';
import { MetricInfo } from '../../../../components/MetricInfo/MetricInfo';
import {
    LOCATION_IMPACT_METRIC_DESCRIPTION,
    LOCATION_IMPACT_METRIC_TITLE,
} from '../../../../const';
import {
    getLocationCurrencyCode,
    getLocationImpactUnitOfMeasure,
    getLocationImpactUnitOfMeasureCode,
    getLocationImpactValue,
} from '../../../../utils';

interface LocationImpactMetricComparisonProps
    extends ComponentProps<typeof Box> {
    impactType: ImpactType;
    lossType: LossType;
    yearFrom: number;
    yearTo: number;
    impactDataFrom: LocationDamageAndLossData;
    impactDataTo: LocationDamageAndLossData;
}

export const LocationImpactMetricComparison: FC<
    LocationImpactMetricComparisonProps
> = ({
    impactType,
    lossType,
    yearFrom,
    yearTo,
    impactDataFrom,
    impactDataTo,
    ...props
}) => {
    const currencyCode = useMemo(() => {
        return getLocationCurrencyCode(impactDataFrom);
    }, [impactDataFrom]);

    return (
        <Box {...props}>
            <Grid
                container
                spacing={4}
                data-testid="metrics"
            >
                {Object.values(LocationImpactMetric).map((metric) => (
                    <Grid
                        key={metric}
                        xs={2}
                        data-testid="metrics-info"
                    >
                        <MetricInfo
                            title={
                                LOCATION_IMPACT_METRIC_TITLE[impactType][metric]
                            }
                            yearTo={yearTo}
                            yearFrom={yearFrom}
                            tooltip={
                                LOCATION_IMPACT_METRIC_DESCRIPTION[impactType][
                                    metric
                                ]
                            }
                            fromValue={getLocationImpactValue(
                                impactType,
                                metric,
                                lossType,
                                impactDataFrom
                            )}
                            toValue={getLocationImpactValue(
                                impactType,
                                metric,
                                lossType,
                                impactDataTo
                            )}
                            currencyCode={getLocationImpactUnitOfMeasureCode({
                                valueCurrencyCode: currencyCode,
                                impactType,
                                locationImpactMetric: metric,
                            })}
                            unitOfMeasure={getLocationImpactUnitOfMeasure({
                                impactType,
                                locationImpactMetric: metric,
                            })}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
