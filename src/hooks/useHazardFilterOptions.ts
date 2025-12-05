import {
    PerilsOptions,
    PerilsOptionsOutput,
    ResultSetDataSchema,
} from '../api/openapi/auto-generated';
import { Scenario, Score } from '../types';
import {
    RESULT_SET_DEFAULT_YEAR_TO,
    RESULT_SET_MIN_YEAR_FROM,
    SCENARIO_DESCRIPTION,
    SCENARIO_EXTENDED_TITLES,
} from '../const';
import { useMemo } from 'react';

export const useScenarioSelectOptions = ({
    resultSetOptions,
}: {
    resultSetOptions: PerilsOptions | PerilsOptionsOutput;
}): Array<{ title: string; id: Scenario; description: string }> => {
    return useMemo<
        Array<{ title: string; id: Scenario; description: string }>
    >(() => {
        return (resultSetOptions.scenarios as Array<Scenario>)
            .filter((scenario) => scenario !== Scenario.Baseline)
            .map((scenario) => {
                return {
                    title: SCENARIO_EXTENDED_TITLES[scenario],
                    description: SCENARIO_DESCRIPTION[scenario],
                    id: scenario,
                };
            });
    }, [resultSetOptions]);
};

export const useYearSelectOptions = ({
    resultSetOptions,
}: {
    resultSetOptions: PerilsOptionsOutput;
}): number[] => {
    return useMemo(() => {
        return (resultSetOptions.years || []).filter(
            (year) => +year >= RESULT_SET_MIN_YEAR_FROM
        );
    }, [resultSetOptions]);
};

export const useMetricSelectOptions = ({
    resultSetSchema,
    score,
}: {
    resultSetSchema: Array<ResultSetDataSchema>;
    score: Score;
}): Array<ResultSetDataSchema> => {
    return useMemo(() => {
        return resultSetSchema.filter(
            ({ peril, id }) => peril === score && id.includes('_mean')
        );
    }, [resultSetSchema, score]);
};

export const getDefaultYearOptionValue = (
    yearSelectOptions: number[] | undefined
): number | undefined => {
    if (!yearSelectOptions || yearSelectOptions.length === 0) {
        return;
    }

    return yearSelectOptions.includes(RESULT_SET_DEFAULT_YEAR_TO)
        ? RESULT_SET_DEFAULT_YEAR_TO
        : yearSelectOptions[yearSelectOptions.length - 1];
};

export const getDefaultScenarioOptionValue = (
    scenarioSelectOptions: Array<{
        title: string;
        id: Scenario;
        description: string;
    }>
): Scenario | undefined => {
    if (!scenarioSelectOptions || scenarioSelectOptions.length === 0) {
        return;
    }

    const availableScenarios: Scenario[] = scenarioSelectOptions.map(
        ({ id }) => id
    );

    const preferredScenarios = [
        Scenario.SSP585,
        Scenario.SSP245,
        Scenario.SSP126,
    ];
    return (
        preferredScenarios.find((scenario) =>
            availableScenarios.includes(scenario)
        ) ?? scenarioSelectOptions[0].id
    );
};
