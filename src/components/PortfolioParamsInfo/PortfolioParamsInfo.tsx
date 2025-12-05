import { ComponentProps, FC } from 'react';
import { Box, Typography } from '@mui/material';
import {
    LossAssetAttributes,
    PerilsResultSetOptions,
    ScoresResultSetOptions,
} from '../../api/openapi/auto-generated';
import { PortfolioParamsInfoField } from './PortfolioParamsInfoField';
import {
    BENCHMARK_LEVEL_TITLES,
    PERIL_TITLES,
    SCENARIO_TITLES,
    SCORE_TITLES,
} from '../../const';

interface PortfolioParamsInfoProps extends ComponentProps<typeof Box> {
    perilData: PerilsResultSetOptions | null;
    scoreData: ScoresResultSetOptions | null;
    economicImpactData: LossAssetAttributes | null;
}

export const PortfolioParamsInfo: FC<PortfolioParamsInfoProps> = ({
    perilData,
    scoreData,
    economicImpactData,
    ...props
}) => {
    return (
        <Box
            display="flex"
            alignItems="flex-start"
            alignSelf="stretch"
            gap={2}
            {...props}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap={1}
                flex={1}
                alignSelf="stretch"
                data-testid="portfolio-details-params-perils"
            >
                <Typography
                    variant="h4"
                    data-testid="portfolio-details-params-perils-title"
                >
                    Peril Data Parameters
                </Typography>

                <PortfolioParamsInfoField
                    label="Perils"
                    value={perilData?.perils
                        ?.map((peril) => PERIL_TITLES[peril])
                        ?.join(', ')}
                />

                <PortfolioParamsInfoField
                    label="Scenarios"
                    value={perilData?.scenarios
                        ?.map((scenario) => SCENARIO_TITLES[scenario])
                        ?.join(', ')}
                />

                <PortfolioParamsInfoField
                    label="Years"
                    value={perilData?.years?.join(', ')}
                />

                <PortfolioParamsInfoField
                    label="Flood Defense Enabled"
                    value={
                        perilData?.floodDefense
                            ? perilData.floodDefense.enabled
                                ? 'Yes'
                                : 'No'
                            : undefined
                    }
                />

                <PortfolioParamsInfoField
                    label="Adjusted Depths for Protected"
                    value={
                        perilData?.floodDefense
                            ? perilData.floodDefense.zeroOutDefendedLocations
                                ? 'Yes'
                                : 'No'
                            : undefined
                    }
                />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap={3}
                flex={1}
                alignSelf="stretch"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    gap={1}
                    alignSelf="stretch"
                    data-testid="portfolio-details-params-scores"
                >
                    <Typography
                    variant="h4"
                    data-testid="portfolio-details-params-scores-title"
                    >
                        Scores Parameters
                    </Typography>

                    <PortfolioParamsInfoField
                        label="Scores"
                        value={scoreData?.perils
                            ?.map((score) => SCORE_TITLES[score])
                            ?.join(', ')}
                    />

                    <PortfolioParamsInfoField
                        label="Benchmarking Enabled"
                        value={
                            scoreData
                                ? scoreData.includeBenchmarks
                                    ? 'Yes'
                                    : 'No'
                                : undefined
                        }
                    />

                    <PortfolioParamsInfoField
                        label="Levels"
                        value={scoreData?.benchmarkLevels
                            ?.map((level) => BENCHMARK_LEVEL_TITLES[level])
                            ?.join(', ')}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    gap={1}
                    alignSelf="stretch"
                    data-testid="portfolio-details-params-economic-impact"
                >
                    <Typography
                        variant="h4"
                        data-testid="portfolio-details-params-economic-impact-title"
                    >
                        Economic Impacts Parameters
                    </Typography>

                    <PortfolioParamsInfoField
                        label="Shadow Price Ratio"
                        value={economicImpactData?.waterShadowPriceRatio}
                    />

                    <PortfolioParamsInfoField
                        label="Annual Growth Rate"
                        value={economicImpactData?.annualGrowth}
                    />

                    <PortfolioParamsInfoField
                        label="Annual Volatility Rate"
                        value={economicImpactData?.annualVolatility}
                    />

                    <PortfolioParamsInfoField
                        label="Sales Margin"
                        value={economicImpactData?.salesMargin}
                    />

                    <PortfolioParamsInfoField
                        label="Discount Rate"
                        value={economicImpactData?.discountRate}
                    />
                </Box>
            </Box>
        </Box>
    );
};
