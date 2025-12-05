import { Box, Typography } from '@mui/material';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { BarChart } from '@mui/x-charts';
import { SvgPatterns } from './PatternBars';

const colors = {
    flood: '#079AED',
    wind: '#59BFBD',
    wildfire: '#DB5138',
    heat: '#FF9900',
};
export type AalBarChartCategories =
    | 'all'
    | 'flooding'
    | 'wind'
    | 'fire'
    | 'heat';

export type AalBarChartProps = {
    years: number[];
    adaptedLosses: Record<AalBarChartCategories, number[]>;
    unadaptedLosses: Record<AalBarChartCategories, number[]>;
};
function SvgLabel({
    color,
    label,
    testId,
}: {
    testId: string;
    color: string;
    label: string;
}) {
    return (
        <Box
            display={'flex'}
            gap={'4px'}
            data-testid={testId}
        >
            <svg
                viewBox={'0 0 25 25'}
                height={20}
                width={20}
            >
                <rect
                    height={25}
                    width={25}
                    ry={4}
                    rx={4}
                    fill={color}
                ></rect>
            </svg>
            <Typography variant="body1">{label}</Typography>
        </Box>
    );
}

export function AalBarChart({
    years,
    adaptedLosses,
    unadaptedLosses,
}: AalBarChartProps) {
    const formatMessage = useFormatMessage();

    const unadaptedData = [
        {
            data: unadaptedLosses.flooding,
            color: colors.flood,
            label: formatMessage('adaptation.sidebar.flood'),
            stack: 'unadapted',
        },
        {
            data: unadaptedLosses.wind,
            color: colors.wind,
            label: formatMessage('adaptation.sidebar.wind'),
            stack: 'unadapted',
        },
        {
            data: unadaptedLosses.fire,
            color: colors.wildfire,
            label: formatMessage('adaptation.sidebar.wildfire'),
            stack: 'unadapted',
        },
        {
            data: unadaptedLosses.heat,
            color: colors.heat,
            label: formatMessage('adaptation.sidebar.heat'),
            stack: 'unadapted',
        },
    ];

    const adaptedData = [
        {
            data: adaptedLosses.flooding,
            color: `url(#pattern-flood)`,
            stack: 'adapted',
        },
        {
            data: adaptedLosses.wind,
            color: `url(#pattern-wind)`,
            stack: 'adapted',
        },
        {
            data: adaptedLosses.fire,
            color: `url(#pattern-wildfire)`,
            stack: 'adapted',
        },
        {
            data: adaptedLosses.heat,
            color: `url(#pattern-heat)`,
            stack: 'adapted',
        },
    ];

    const series = [...unadaptedData, ...adaptedData];

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
            <SvgPatterns colors={colors} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography typography="h3">
                    {formatMessage('adaptation.charts.aal_progression.title')}
                </Typography>
                <Box
                    display={'flex'}
                    gap={'16px'}
                    alignItems={'end'}
                >
                    <SvgLabel
                        color={colors.wildfire}
                        label={formatMessage('adaptation.charts.aal.unadapted')}
                        testId={'unadapted-legend'}
                    />
                    <SvgLabel
                        color={'url(#pattern-wildfire)'}
                        label={formatMessage('adaptation.charts.aal.adapted')}
                        testId={'adapted-legend'}
                    />
                </Box>
            </Box>

            <BarChart
                xAxis={[{ data: years, scaleType: 'band' }]}
                series={series}
                margin={{ bottom: 60 }}
                grid={{ horizontal: true }}
                height={400}
                slotProps={{
                    legend: {
                        hidden: false,
                        position: { vertical: 'bottom', horizontal: 'middle' },
                    },
                }}
            />
        </Box>
    );
}
