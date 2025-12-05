import { FC } from 'react';
import { CommonSeriesType } from '@mui/x-charts/internals';
import { buildSvgGradientStyleId } from '../../../utils';

interface SvgGradientStylesProps {
    series: CommonSeriesType<number>[];
}

export const SvgGradientStyles: FC<SvgGradientStylesProps> = ({ series }) => {
    return (
        <>
            <defs>
                {series.map((series) => (
                    <linearGradient
                        key={series.id}
                        id={buildSvgGradientStyleId(series.id)}
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                        gradientTransform="rotate(230)"
                    >
                        <stop
                            stopColor="white"
                            stopOpacity="0.35"
                        />
                        <stop
                            offset="1"
                            stopColor={series.color}
                        />
                    </linearGradient>
                ))}
            </defs>
        </>
    );
};
