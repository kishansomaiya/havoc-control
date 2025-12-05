import { Box, Typography } from '@mui/material';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { YearLineChart } from '../../../../../components/Charts/Line/YearLineChart';
import { TabSelect } from '../../../../../components/Tabs/Tabs';
import { useState } from 'react';

export type AalLineChartCategories =
    | 'all'
    | 'flooding'
    | 'wind'
    | 'fire'
    | 'heat';

export type AalLineChartProps = {
    years: number[];
    adaptedLosses: Record<AalLineChartCategories, number[]>;
    unadaptedLosses: Record<AalLineChartCategories, number[]>;
};
export function AalLineChart({
    adaptedLosses,
    unadaptedLosses,
    years,
}: AalLineChartProps) {
    const formatMessage = useFormatMessage();
    const [lineChartTab, setLineChartTab] =
        useState<AalLineChartCategories>('all');

    const aLoss = adaptedLosses[lineChartTab];
    const uLoss = unadaptedLosses[lineChartTab];

    return (
        <Box
            sx={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px solid #8D9498',
                borderRadius: '4px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography typography={'h3'}>
                    {formatMessage('adaptation.charts.aal_progression.title')}
                </Typography>
                <TabSelect<AalLineChartCategories>
                    value={lineChartTab}
                    onChange={(val) => setLineChartTab(val)}
                    options={[
                        {
                            label: formatMessage(
                                'adaptation.charts.aal.all_perils'
                            ),
                            value: 'all',
                        },
                        {
                            label: formatMessage('adaptation.sidebar.flood'),
                            value: 'flooding',
                        },
                        {
                            label: formatMessage('adaptation.sidebar.wind'),
                            value: 'wind',
                        },
                        {
                            label: formatMessage('adaptation.sidebar.wildfire'),
                            value: 'fire',
                        },
                        {
                            label: formatMessage('adaptation.sidebar.heat'),
                            value: 'heat',
                        },
                    ]}
                />
            </Box>
            <YearLineChart
                yearsRange={years}
                xAxisPadding={0}
                xMax={2050}
                series={[
                    {
                        data: aLoss,
                        showMark: false,
                        color: '#F28B51',
                        label: formatMessage('adaptation.charts.aal.adapted'),
                    },
                    {
                        data: uLoss,
                        showMark: false,
                        color: '#F7BD98',
                        label: formatMessage('adaptation.charts.aal.unadapted'),
                    },
                ]}
                height={400}
            />
        </Box>
    );
}
