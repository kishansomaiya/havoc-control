import { ScoreLevel } from '../types';
import { MeshOptionsDataVersionEnum } from '../api/openapi/auto-generated';

type FloodMeshScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isFractionMetric: boolean,
        dataVersion?: MeshOptionsDataVersionEnum
    ) => string | undefined;
};

const DEFAULT_DESCRIPTION_VALUE = undefined;

export const FLOOD_MESH_SCORE_LEVEL_DESCRIPTION: FloodMeshScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isFractionMetric: boolean,
            dataVersion?: MeshOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '0%';
            }

            if (dataVersion === MeshOptionsDataVersionEnum._262) {
                return '< 0.25 m';
            }

            if (
                dataVersion === MeshOptionsDataVersionEnum._310 ||
                dataVersion === MeshOptionsDataVersionEnum._300
            ) {
                return '< 0.1 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isFractionMetric: boolean,
            dataVersion?: MeshOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '0-25%';
            }

            if (dataVersion === MeshOptionsDataVersionEnum._262) {
                return '0.25-1.0 m';
            }

            if (
                dataVersion === MeshOptionsDataVersionEnum._310 ||
                dataVersion === MeshOptionsDataVersionEnum._300
            ) {
                return '0.1 - 0.5 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isFractionMetric: boolean,
            dataVersion?: MeshOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '25-50%';
            }

            if (dataVersion === MeshOptionsDataVersionEnum._262) {
                return '1.0 - 2.0 m';
            }

            if (
                dataVersion === MeshOptionsDataVersionEnum._310 ||
                dataVersion === MeshOptionsDataVersionEnum._300
            ) {
                return '0.5 - 1.0 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isFractionMetric: boolean,
            dataVersion?: MeshOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '50-75%';
            }

            if (dataVersion === MeshOptionsDataVersionEnum._262) {
                return '2.0 - 3.0 m';
            }

            if (
                dataVersion === MeshOptionsDataVersionEnum._310 ||
                dataVersion === MeshOptionsDataVersionEnum._300
            ) {
                return '1.0 - 2.0 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isFractionMetric: boolean,
            dataVersion?: MeshOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '> 75%';
            }

            if (dataVersion === MeshOptionsDataVersionEnum._262) {
                return '>= 3.0 m';
            }

            if (
                dataVersion === MeshOptionsDataVersionEnum._310 ||
                dataVersion === MeshOptionsDataVersionEnum._300
            ) {
                return '>= 2.0 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

export const getFloodMeshScoreLevelDescription = (
    scoreLevel: ScoreLevel,
    isFractionMetric: boolean,
    dataVersion?: MeshOptionsDataVersionEnum
): string | undefined => {
    return FLOOD_MESH_SCORE_LEVEL_DESCRIPTION[scoreLevel](
        isFractionMetric,
        dataVersion
    );
};
