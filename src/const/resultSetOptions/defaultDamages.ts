import {
    APIEIModule,
    DamagesResultSetOptions,
    DamagesResultSetOptionsTypeEnum,
} from '../../api/openapi/auto-generated';
import { DataVersion } from '../../types';
import {
    DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS,
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
} from '.';

export const DEFAULT_DAMAGES_RESULT_SET_OPTIONS: {
    [key in DataVersion]: DamagesResultSetOptions;
} = {
    [DataVersion.v3_3_0]: {
        defaults:
            DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[DataVersion.v3_3_0],
        eiModules: [
            APIEIModule.acuteCombinedFlood,
            APIEIModule.acuteWind,
            APIEIModule.utilitiesCooling,
            APIEIModule.productivityHeat,
            APIEIModule.acuteFire,
            APIEIModule.utilitiesWater,
            APIEIModule.financial,
        ],
        perilsOptions: DEFAULT_PERIL_RESULT_SET_OPTIONS[DataVersion.v3_3_0],
        type: DamagesResultSetOptionsTypeEnum.damages,
    },
    [DataVersion.v3_2_0]: {
        defaults:
            DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[DataVersion.v3_2_0],
        eiModules: [
            APIEIModule.acuteCombinedFlood,
            APIEIModule.acuteWind,
            APIEIModule.utilitiesCooling,
            APIEIModule.productivityHeat,
            APIEIModule.acuteFire,
            APIEIModule.utilitiesWater,
            APIEIModule.financial,
        ],
        perilsOptions: DEFAULT_PERIL_RESULT_SET_OPTIONS[DataVersion.v3_2_0],
        type: DamagesResultSetOptionsTypeEnum.damages,
    },
    [DataVersion.v3_1_0]: {
        defaults:
            DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[DataVersion.v3_1_0],
        eiModules: [
            APIEIModule.acuteCombinedFlood,
            APIEIModule.acuteWind,
            APIEIModule.utilitiesCooling,
            APIEIModule.productivityHeat,
            APIEIModule.acuteFire,
            APIEIModule.utilitiesWater,
            APIEIModule.financial,
        ],
        perilsOptions: DEFAULT_PERIL_RESULT_SET_OPTIONS[DataVersion.v3_1_0],
        type: DamagesResultSetOptionsTypeEnum.damages,
    },
    [DataVersion.v3_0_0]: {
        defaults:
            DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[DataVersion.v3_0_0],
        eiModules: [
            APIEIModule.acuteCombinedFlood,
            APIEIModule.acuteWind,
            APIEIModule.utilitiesCooling,
            APIEIModule.productivityHeat,
            APIEIModule.financial,
        ],
        perilsOptions: DEFAULT_PERIL_RESULT_SET_OPTIONS[DataVersion.v3_0_0],
        type: DamagesResultSetOptionsTypeEnum.damages,
    },
    [DataVersion.v2_6_2]: {
        defaults:
            DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS[DataVersion.v2_6_2],
        eiModules: [APIEIModule.acuteCombinedFlood, APIEIModule.acuteWind],
        perilsOptions: DEFAULT_PERIL_RESULT_SET_OPTIONS[DataVersion.v2_6_2],
        type: DamagesResultSetOptionsTypeEnum.damages,
    },
};
