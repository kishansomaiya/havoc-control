import { Scenario } from '../types';

export const SCENARIO_TITLES: { [key: string]: string } = {
    [Scenario.Baseline]: 'Baseline',
    [Scenario.SSP126]: 'SSP1-2.6',
    [Scenario.SSP245]: 'SSP2-4.5',
    [Scenario.SSP585]: 'SSP5-8.5',
};

export const SCENARIO_EXTENDED_TITLES: { [key: string]: string } = {
    [Scenario.Baseline]: 'Historical Baseline',
    [Scenario.SSP126]: 'SSP1-2.6 Low GHG Emissions',
    [Scenario.SSP245]: 'SSP2-4.5 Middle GHG Emissions',
    [Scenario.SSP585]: 'SSP5-8.5 High GHG Emissions',
};

export const SCENARIO_DESCRIPTION: { [key: string]: string } = {
    [Scenario.Baseline]:
        'Represents climate conditions for a 20-year period centered on 1995, consistent with the IPCC AR5 definition of the historical baseline period.',
    [Scenario.SSP126]:
        'Assumes a strong global commitment to reducing greenhouse gas emissions, leading to low levels of warming.',
    [Scenario.SSP245]:
        'Assumes moderate efforts to reduce greenhouse gas emissions and balanced outcome in terms of socio-economic development and climate change impacts.',
    [Scenario.SSP585]:
        'In this scenario, greenhouse gas emissions continue to rise, leading to high levels of warming and significant climate change impacts.',
};
