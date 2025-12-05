import {
    ImpactType,
    LocationImpactGroup,
    LocationImpactMetric,
} from '../types';

export const LOCATION_IMPACT_METRIC_TITLE = {
    [ImpactType.Damage]: {
        [LocationImpactMetric.Flood]: 'Flood Damage',
        [LocationImpactMetric.Wind]: 'Wind Damage',
        [LocationImpactMetric.Wildfire]: 'Wildfire Damage',
        [LocationImpactMetric.HeatCooling]: 'Heat - Cooling Damage',
        [LocationImpactMetric.HeatProductivity]: 'Heat - Productivity Damage',
        [LocationImpactMetric.Drought]: 'Drought Damage',
    },
    [ImpactType.Loss]: {
        [LocationImpactMetric.Flood]: 'Flood Loss',
        [LocationImpactMetric.Wind]: 'Wind Loss',
        [LocationImpactMetric.Wildfire]: 'Wildfire Loss',
        [LocationImpactMetric.HeatCooling]: 'Heat - Cooling Loss',
        [LocationImpactMetric.HeatProductivity]: 'Heat - Productivity Loss',
        [LocationImpactMetric.Drought]: 'Drought Loss',
    },
};
export const LOCATION_IMPACT_METRIC_DESCRIPTION = {
    [ImpactType.Damage]: {
        [LocationImpactMetric.Flood]:
            'Percent damage in a single year due to flooding',
        [LocationImpactMetric.Wind]:
            'Percent damage in a single year due to wind',
        [LocationImpactMetric.Wildfire]:
            'Percent damage in a single year due to wildfire',
        [LocationImpactMetric.HeatCooling]:
            'Electricity consumed (in kWh) for cooling purposes',
        [LocationImpactMetric.HeatProductivity]:
            'The average proportion of annual work hours lost due to heat',
        [LocationImpactMetric.Drought]: 'Shadow price of water',
    },
    [ImpactType.Loss]: {
        [LocationImpactMetric.Flood]:
            'Average loss in a single year due to flooding',
        [LocationImpactMetric.Wind]:
            'Average loss in a single year due to wind',
        [LocationImpactMetric.Wildfire]:
            'Average loss in a single year due to wildfire',
        [LocationImpactMetric.HeatCooling]:
            'Cost (in monetary value) of electricity used for space cooling purposes',
        [LocationImpactMetric.HeatProductivity]:
            'The average annual loss due to impacts of heat on worker productivity',
        [LocationImpactMetric.Drought]:
            'Annual cost of water consumption, in monetary units, accounting for the societal value of water',
    },
};

export const LOCATION_IMPACT_METRIC_COLOR = {
    [LocationImpactMetric.Flood]: '#0068AD',
    [LocationImpactMetric.Wind]: '#59BFBD',
    [LocationImpactMetric.Wildfire]: '#F90',
    [LocationImpactMetric.HeatCooling]: '#DB5138',
    [LocationImpactMetric.HeatProductivity]: '#F28B51',
    [LocationImpactMetric.Drought]: '#F7BD98',
};

export const LOCATION_IMPACT_GROUP_TITLE = {
    [LocationImpactGroup.Acute]: 'Acute',
    [LocationImpactGroup.Chronic]: 'Chronic',
};

export const METRIC_GROUP_MAP: Record<
    LocationImpactMetric,
    LocationImpactGroup
> = {
    [LocationImpactMetric.Flood]: LocationImpactGroup.Acute,
    [LocationImpactMetric.Wind]: LocationImpactGroup.Acute,
    [LocationImpactMetric.Wildfire]: LocationImpactGroup.Acute,
    [LocationImpactMetric.HeatCooling]: LocationImpactGroup.Chronic,
    [LocationImpactMetric.HeatProductivity]: LocationImpactGroup.Chronic,
    [LocationImpactMetric.Drought]: LocationImpactGroup.Chronic,
};

export const LOCATION_IMPACT_METRIC_LABEL = {
    [LocationImpactMetric.Flood]: 'Flood',
    [LocationImpactMetric.Wind]: 'Wind',
    [LocationImpactMetric.Wildfire]: 'Wildfire',
    [LocationImpactMetric.HeatCooling]: 'Heat - Cooling',
    [LocationImpactMetric.HeatProductivity]: 'Heat - Productivity',
    [LocationImpactMetric.Drought]: 'Drought',
};
