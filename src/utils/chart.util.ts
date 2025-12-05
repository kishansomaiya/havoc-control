import { CommonSeriesType, SeriesId } from '@mui/x-charts/internals';

export const buildSvgGradientStyleId = (id?: SeriesId) =>
    id ? `gradient-${id?.toString()}` : '';

export const buildSvgGradientStyleSX = (series: CommonSeriesType<number>[]) =>
    series.reduce(
        (result, series) => ({
            ...result,
            [`.MuiAreaElement-series-${series.id}`]: {
                fill: `url(#${buildSvgGradientStyleId(series.id)})`,
            },
        }),
        {}
    );
