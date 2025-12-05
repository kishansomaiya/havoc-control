import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { useLayoutEffect, useRef, useState } from 'react';

interface CapitalExpenditureChartProps {
    years: number[];
    annualExpenditure: number[];
    cumulativeInvestment: number[];
}

const CHART_CONFIG = {
    width: 950,
    height: 400,
    backgroundColor: '#242424',
    barColor: '#0c84fcff',
    lineColor: '#7ED321',
    gridColor: '#e7e5e5ff',
    textColor: '#B0B0B0',
};

export default function CapitalExpenditureTimeline({
    years,
    annualExpenditure,
    cumulativeInvestment,
}: CapitalExpenditureChartProps) {
    const formatMessage = useFormatMessage();
    const chartParent = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);

    useLayoutEffect(() => {
        const resize = () => {
            if (!chartParent.current) {
                return;
            }

            const { height, width } =
                chartParent.current.getBoundingClientRect();
            setChartWidth(width);
            setChartHeight(height);
        };
        resize();

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div
            style={{
                background: CHART_CONFIG.backgroundColor,
                padding: '20px',
                border: '1px solid #8D9498',
                borderRadius: '8px',
                width: '95%',
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif',
            }}
            data-testid="capex-timeline"
        >
            <h4
                style={{
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    textAlign: 'left',
                    margin: '0 0 16px 0',
                }}
            >
                {formatMessage('adaptation.tabs.capital.title')}
            </h4>

            <div
                ref={chartParent}
                style={{ position: 'relative', width: '100%', height: '400px' }}
            >
                <ChartContainer
                    height={chartHeight}
                    width={chartWidth}
                    series={[
                        {
                            type: 'bar',
                            data: annualExpenditure,
                            color: CHART_CONFIG.barColor,
                            id: 'expenditure',
                        },
                        {
                            type: 'line',
                            data: cumulativeInvestment,
                            color: CHART_CONFIG.lineColor,
                            id: 'investment',
                            yAxisKey: 'right',
                        },
                    ]}
                    xAxis={[
                        {
                            data: years,
                            scaleType: 'band',
                            tickLabelStyle: {
                                fill: CHART_CONFIG.textColor,
                                fontSize: '11px',
                            },
                        },
                    ]}
                    yAxis={[
                        {
                            id: 'left',
                            tickLabelStyle: {
                                fill: CHART_CONFIG.textColor,
                                fontSize: '10px',
                            },
                            valueFormatter: (value) =>
                                `$${(value / 1000000).toFixed(1)}M`,
                        },
                        {
                            id: 'right',
                            tickLabelStyle: {
                                fill: CHART_CONFIG.lineColor,
                                fontSize: '12px',
                            },
                            valueFormatter: (value) =>
                                `$${(value / 1000000).toFixed(1)}M`,
                        },
                    ]}
                    margin={{ left: 60, right: 60, top: 40, bottom: 60 }}
                >
                    <ChartsGrid
                        horizontal
                        vertical
                        stroke={CHART_CONFIG.gridColor}
                        strokeWidth={0.5}
                    />
                    <BarPlot />
                    <LinePlot />
                    <MarkPlot />
                    <ChartsAxis
                        leftAxis={{ axisId: 'left' }}
                        rightAxis={{ axisId: 'right' }}
                    />
                </ChartContainer>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '12px',
                    gap: '30px',
                    fontSize: '12px',
                    color: CHART_CONFIG.textColor,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span
                        style={{
                            width: '16px',
                            height: '12px',
                            background: CHART_CONFIG.barColor,
                            display: 'inline-block',
                        }}
                    ></span>
                    {formatMessage('adaptation.tabs.capital.label')}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span
                        style={{
                            width: '16px',
                            height: '2px',
                            background: CHART_CONFIG.lineColor,
                            display: 'inline-block',
                        }}
                    ></span>
                    {formatMessage('adaptation.tabs.capital.label2')}
                </div>
            </div>
        </div>
    );
}
