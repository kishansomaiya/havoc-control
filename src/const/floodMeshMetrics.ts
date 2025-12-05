import { MetricComparisonType } from '../types';

export const FLOOD_MESH_METRIC_TITLE = {
    [MetricComparisonType.Average]: (isFractionMetric: boolean) =>
        isFractionMetric
            ? 'Average Flood Fraction (%)'
            : 'Average Flood Depth (Meters)',
    [MetricComparisonType.Min]: (isFractionMetric: boolean) =>
        isFractionMetric
            ? 'Min Flood Fraction (%)'
            : 'Min Flood Depth (Meters)',
    [MetricComparisonType.Max]: (isFractionMetric: boolean) =>
        isFractionMetric
            ? 'Max Flood Fraction (%)'
            : 'Max Flood Depth (Meters)',
};
export const FLOOD_MESH_METRIC_DESCRIPTION = {
    [MetricComparisonType.Average]: (isFractionMetric: boolean) =>
        isFractionMetric
            ? 'Average flood fraction of all the mean flood values within the mesh grid'
            : 'Average flood depth of all the mean flood values within the mesh grid',
    [MetricComparisonType.Min]: (isFractionMetric: boolean) =>
        isFractionMetric
            ? 'Minimum flood fraction of all the mean flood values within the mesh grid'
            : 'Minimum flood depth of all the mean flood values within the mesh grid',
    [MetricComparisonType.Max]: (isFractionMetric: boolean) =>
        isFractionMetric
            ? 'Maximum flood fraction of all the mean flood values within the mesh grid'
            : 'Maximum flood depth of all the mean flood values within the mesh grid',
};
