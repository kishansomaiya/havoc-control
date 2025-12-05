import { Box, Typography } from '@mui/material';
import { StyledPieChart } from '../../../../../components/Charts/Pie/StyledPieChart';
import { InvestmentDecisionMatrix } from '../InvestmentDecisionMetrix';
import { DataLabel } from '../DataTypography/DataLabel';
import { DataValue } from '../DataTypography/DataValue';
import { DataCaption } from '../DataTypography/DataCaption';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { MessageKeys } from 'localization/useFormatMessage';
import { abbreviateNumber, currencyValueFormatter } from '../../../../../utils';
import { useMemo, useState } from 'react';
import { LocationAnalysisData } from '../../../../../api/openapi/auto-generated';

interface NpvMetricsBarItem {
    key: string;
    label: string;
    info?: string;
    value: string | number;
    caption?: string;
}

export type NpvTabProps = {
    investmentData?: LocationAnalysisData[];
    kpis: {
        totalNpv: number;
        averageAssetValue: number;
        topPerformer: number;
        topPerformerId: number;
        concentration: number;
        valueRange: string;
    };
};
export function NpvAnalysisTab({ investmentData, kpis }: NpvTabProps) {
    const formatMessage = useFormatMessage();
    const [lastClickedPieId, setLastClickedPieId] = useState<number | null>(
        null
    );

    const kpiMetrics: NpvMetricsBarItem[] = useMemo(
        () => [
            {
                key: 'total-npv',
                label: 'adaptation.tabs.npv_roi.total_npv',
                info: 'Sum of Net Present Value across selected assets',
                value: kpis.totalNpv,
            },
            {
                key: 'avg-asset-value',
                label: 'adaptation.tabs.npv_roi.average_asset_value',
                info: 'Average value per asset in selection',
                value: kpis.averageAssetValue,
            },
            {
                key: 'top-performer',
                label: 'adaptation.tabs.npv_roi.top_performer',
                info: 'Highest NPV among assets',
                value: kpis.topPerformer,
                caption:
                    investmentData?.find(
                        ({ customerLocationId }) =>
                            customerLocationId === kpis.topPerformerId
                    )?.name ?? undefined,
            },
            {
                key: 'concentration',
                label: 'adaptation.tabs.npv_roi.concentration',
                info: 'Share of NPV from top asset',
                value: kpis.concentration,
            },
            {
                key: 'value-range',
                label: 'adaptation.tabs.npv_roi.value_range',
                info: 'Ratio of max to min asset value',
                value: kpis.valueRange,
            },
        ],
        [kpis, investmentData]
    );

    const chartData = useMemo(
        () =>
            investmentData?.map((investment) => ({
                value: investment.netPresentValue ?? 0,
                label: investment.name,
                id: investment.customerLocationId,
            })) || [],
        [investmentData]
    );
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
            data-testid="npv-roi-tab-data-container"
        >
            <Box
                display="flex"
                alignItems="stretch"
                justifyContent="space-between"
                data-testid="npv-metrics-bar"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.background.default,
                    px: 6,
                    pt: 2,
                    pb: 3,
                    gap: 4,
                    borderBottom: (theme) =>
                        `1px solid ${theme.palette.text.secondary}`,
                }}
            >
                {kpiMetrics.map((item) => {
                    let value =
                        typeof item.value === 'number'
                            ? `$${abbreviateNumber(item.value)}`
                            : item.value;
                    if (item.key === 'concentration') {
                        value = `${(item.value as number).toFixed(1)}%`;
                    }
                    return (
                        <Box
                            key={item.key}
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            gap={1}
                            flex={1}
                        >
                            <DataLabel
                                text={formatMessage(item.label as MessageKeys)}
                                info={item.info}
                                testId={`npv-metric-label-${item.key}`}
                            >
                                <DataValue
                                    testId={`npv-metric-value-${item.key}`}
                                >
                                    {value}
                                </DataValue>
                                {!!item.caption && (
                                    <DataCaption
                                        text={item.caption}
                                        testId={`npv-metric-description-value-${item.key}`}
                                    />
                                )}
                            </DataLabel>
                        </Box>
                    );
                })}
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={2}
                alignItems="center"
                mt={2}
                padding={'20px'}
                borderRadius={'8px'}
                border={'1px solid #8D9498'}
            >
                <Box alignSelf={'start'}>
                    <Typography typography={'h3'}>
                        {formatMessage('adaptation.tabs.npv_roi.expected_npv')}
                    </Typography>
                </Box>
                <StyledPieChart
                    data={chartData}
                    width={375}
                    height={375}
                    pieChartInnerRadius="55%"
                    arcPaddingAngle={0.5}
                    onSlotClick={(_, { dataIndex }) => {
                        setLastClickedPieId(chartData[dataIndex].id);
                    }}
                    valueFormatter={(v) =>
                        currencyValueFormatter({ value: v.value })
                    }
                />
            </Box>

            <InvestmentDecisionMatrix
                investmentData={investmentData}
                selectedRows={lastClickedPieId ? [lastClickedPieId] : undefined}
            />
        </Box>
    );
}
