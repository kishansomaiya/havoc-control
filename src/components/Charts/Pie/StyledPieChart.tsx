import { pieArcLabelClasses, pieArcClasses, PieChart } from '@mui/x-charts';
import type { PieItemIdentifier, DefaultizedPieValueType } from '@mui/x-charts';
import { useFormatMessage } from '../../../localization/useFormatMessage'
import { ComponentProps, FC } from 'react';
import { Box } from '@mui/material';

interface PieItemDataType {
    color?: string;
    formattedValue?: string;
    label?: string;
    id?: string | number;
    value?: number;
    dataIndex: number;
}

// Interface for the series object passed to CustomItemContent
interface PieSeries {
    data: PieValueType[];
}

// Interface for CustomItemContentProps
interface CustomItemContentProps {
    itemData: PieItemDataType;
    series: PieSeries;
    valueFormatter?: SeriesPieValueFormatter;
}

type PieValueType = {
    id?: string | number;
    value: number;
    label?: string | ((location: 'tooltip' | 'legend' | 'arc') => string);
    color?: string;
};

type PieItemType = {
    color?: string;
    formattedValue?: string;
    label?: string;
    id?: string | number;
    value?: number;
};

type SeriesPieValueFormatter = (
    value: PieValueType,
    context: {
        dataIndex: number;
    }
) => string;

export interface StyledPieChartProps extends ComponentProps<'div'> {
    data: PieValueType[];
    width?: number;
    height?: number;
    pieChartInnerRadius?: string;
    arcPaddingAngle?: number;
    arcLabel?:
    | 'formattedValue'
    | 'label'
    | 'value'
    | ((item: PieItemType) => string);
    valueFormatter?: SeriesPieValueFormatter;
    selectedSlotId?: number;
    onSlotClick?: (
        event: React.MouseEvent<SVGPathElement, MouseEvent>,
        identifier: PieItemIdentifier,
        item: DefaultizedPieValueType
    ) => void;
}

const colorPallete = [
    '#2196F3',
    '#26A69A',
    '#FFD699',
    '#FF9900',
    '#ED5A07',
    '#CBD2D5',
];

const CustomItemContent = ({ itemData, series, valueFormatter }: CustomItemContentProps) => {
    const formatMessage = useFormatMessage();
    const itemDataObj = series.data?.[itemData.dataIndex];

    let label: string;
    if (typeof itemDataObj?.label === 'function') {
        label = itemDataObj.label('tooltip');
    } else if (typeof itemDataObj?.label === 'string') {
        label = itemDataObj.label;
    } else {
        label = formatMessage('adaptation.charts.npv.no.label');
    }
    const value = valueFormatter
        ? valueFormatter(itemDataObj, { dataIndex: itemData.dataIndex })
        : itemDataObj?.value || formatMessage('adaptation.charts.npv.no.label');
    const color = itemDataObj?.color || '#2196F3';

    return (
        <Box sx={{
            backgroundColor: '#2b2b2b',
            color: '#ffffff',
            padding: '10px 14px',
            border: '1px solid #444',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            minWidth: '150px'
        }} key={itemData.dataIndex}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '6px',
                gap: '8px'
            }}>
                <Box sx={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color || '#2196F3',
                    flexShrink: 0
                }} />
                <Box sx={{ fontWeight: 600, fontSize: '14px' }}>
                    {label}
                </Box>
            </Box>
            <Box sx={{ fontSize: '13px', color: '#cccccc', paddingLeft: '18px' }}>
                {formatMessage('adaptation.charts.npv.no.expected.npv')} {value}
            </Box>
        </Box>
    );
};

export const StyledPieChart: FC<StyledPieChartProps> = ({
    data,
    width,
    height,
    arcLabel,
    pieChartInnerRadius = '68%',
    arcPaddingAngle = 2,
    valueFormatter,
    selectedSlotId,
    onSlotClick,
    ...props
}) => {


    return (
        <div {...props} data-testid="pie-chart">
            <PieChart
                series={[
                    {
                        data,
                        innerRadius: pieChartInnerRadius,
                        paddingAngle: arcPaddingAngle,
                        arcLabel: arcLabel,
                        valueFormatter: valueFormatter,
                    },
                ]}
                tooltip={{
                    trigger: 'item',
                }}
                slots={{
                    itemContent: (props) => <CustomItemContent {...props} valueFormatter={valueFormatter} />,
                }}
                slotProps={{
                    legend: {
                        hidden: true,
                    },
                }}
                colors={colorPallete}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: (theme) => theme.palette.primary.contrastText,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                    },
                    ...(selectedSlotId
                        ? {
                            [`& .${pieArcClasses.root}`]: {
                                opacity: '0.5 !important',
                            },
                            [`& .${pieArcClasses.root}:nth-of-type(${selectedSlotId})`]: {
                                opacity: '1 !important',
                            },
                        }
                        : {}),
                }}
                width={width}
                height={height}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                onItemClick={onSlotClick}
            />
        </div>
    );
};
