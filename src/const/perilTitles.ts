import { Peril } from '../types';

export const PERIL_TITLES: { [key: string]: string } = {
    [Peril.Cold]: 'Cold',
    [Peril.CombinedFlood]: 'Combined Flood',
    [Peril.Drought]: 'Drought',
    [Peril.CoastalFlood]: 'Coastal Flood',
    [Peril.Fire]: 'Wildfire',
    [Peril.Hail]: 'Hail',
    [Peril.Heat]: 'Heat',
    [Peril.Precipitation]: 'Precipitation',
    [Peril.Wind]: 'Wind',
    [Peril.FluvialFlood]: 'Fluvial Flood',
    [Peril.PluvialFlood]: 'Pluvial Flood',
    [Peril.Subsidence]: 'Subsidence',
};
