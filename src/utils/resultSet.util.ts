import {
    DataVersion,
    IPortfolioItem,
    ResultSetStatus,
    ResultSetType,
    Scenario,
} from '../types';
import {
    APIEIModule,
    DamagesResultSetOptions,
    LossAssetAttributes,
    PerilsResultSetOptions,
    PipelineStatus,
    ResultSetResponse,
    ScoresResultSetOptions,
} from '../api/openapi/auto-generated';
import {
    DEFAULT_DAMAGES_RESULT_SET_OPTIONS,
    DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS_RES,
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
    DEFAULT_SCORE_RESULT_SET_OPTIONS,
} from '../const';
import { isEqual, isNil } from 'lodash';

const getPortfolioPipelineResultSets = (
    portfolio: IPortfolioItem
): ResultSetResponse[] => {
    if (!portfolio || !portfolio.pipelines?.length) {
        return [];
    }

    const [pipeline] = portfolio.pipelines;
    if (pipeline.status === PipelineStatus.failed) {
        return [];
    }

    if (!portfolio.resultSets.length) {
        return [];
    }

    return portfolio.resultSets.filter(({ id }) =>
        [
            pipeline.perilsResultSetId,
            pipeline.impactsResultSetId,
            pipeline.prplResultSetId,
            pipeline.scoresResultSetId,
            pipeline.meshResultSetId,
            pipeline.disclosureResultSetId,
        ].includes(id)
    );
};

const getResultsSetsFromPortfolioPipeline = (
    portfolio: IPortfolioItem
): string[] => {
    if (!portfolio?.pipelines?.length) {
        return [];
    }

    const [pipeline] = portfolio.pipelines;
    if (pipeline.status === PipelineStatus.failed) {
        return [];
    }

    const resultSetMap: Record<string, string> = {
        impactsResultSetId: 'damages',
        prplResultSetId: 'portfolio_financial',
        perilsResultSetId: 'perils',
        scoresResultSetId: 'scores',
        meshResultSetId: 'mesh',
        disclosureResultSetId: 'disclosure',
    };

    return Object.entries(resultSetMap)
        .filter(([key]) => Boolean(pipeline[key as keyof typeof pipeline]))
        .map(([, name]) => name);
};

const getPortfolioResultType = (portfolio: IPortfolioItem): string => {
    const resultSetNames = getResultsSetsFromPortfolioPipeline(portfolio);

    if (!resultSetNames.length) {
        return 'No Analysis available';
    }

    const resultSetsTypes = [];

    if (resultSetNames.includes('disclosure')) {
        resultSetsTypes.push(ResultSetType.DISCLOSURE);
    }

    if (
        resultSetNames.includes('damages') ||
        resultSetNames.includes('perils')
    ) {
        resultSetsTypes.push(ResultSetType.PERILS);
    }

    if (resultSetNames.includes('damages')) {
        resultSetsTypes.push(ResultSetType.ECONOMIC_IMPACTS);
    }

    if (resultSetNames.includes('scores')) {
        resultSetsTypes.push(ResultSetType.SCORES);
    }

    if (resultSetNames.includes('mesh')) {
        resultSetsTypes.push(ResultSetType.FLOOD_MESH);
    }

    return resultSetsTypes.join(', ');
};

export const getPortfolioResultDataVersion = (
    portfolio: IPortfolioItem
): string => {
    if (!portfolio?.pipelines?.length) {
        return '';
    }

    const [pipeline] = portfolio.pipelines;
    if (pipeline.status === PipelineStatus.failed) {
        return '';
    }

    const dataVersion = pipeline.dataVersion as DataVersion;

    if (dataVersion) {
        return dataVersion as string;
    }

    return '';
};

export const getPortfolioResultEIVersion = (
    portfolio: IPortfolioItem
): string => {
    const resultSets = getPortfolioPipelineResultSets(portfolio);

    if (!resultSets?.length) {
        return '';
    }

    const resultSet = resultSets.find(({ options }) => 'eiVersion' in options);

    if (!resultSet) {
        return '';
    }

    if ('eiVersion' in resultSet.options) {
        return resultSet.options.eiVersion as string;
    }

    return '';
};

export const getPortfolioResultSetLabel = (
    portfolio: IPortfolioItem
): string => {
    if (portfolio.pipelines?.[0]?.status === PipelineStatus.pending) {
        return 'Pending';
    }

    if (portfolio.pipelines?.[0]?.status === PipelineStatus.failed) {
        return 'Result set(s) failed';
    }

    const resultType = getPortfolioResultType(portfolio);
    const dataVersion = getPortfolioResultDataVersion(portfolio);

    return `${resultType}${dataVersion ? ` (v${dataVersion})` : ''}`;
};

export const getEconomicImpactsResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.impactsResultSetId
    );

export const getPerilsResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) =>
            id ===
            (portfolio.pipelines?.[0]?.impactsResultSetId ||
                portfolio.pipelines?.[0]?.perilsResultSetId)
    );

export const getScoresResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.scoresResultSetId
    );

export const getDisclosureResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.disclosureResultSetId
    );

export const getFloodResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.meshResultSetId
    );

export const getPortfolioMetricsResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.prplResultSetId
    );

export const getEIResultSetWithFinancialMetrics = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined => {
    const financialResultset = portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.impactsResultSetId
    );

    if (
        financialResultset?.options?.type === 'damages' &&
        financialResultset.options.eiModules?.includes(APIEIModule.financial)
    ) {
        return financialResultset;
    }
};

export const getComplianceResultSet = (
    portfolio: IPortfolioItem
): ResultSetResponse | undefined =>
    portfolio.resultSets.find(
        ({ id }) => id === portfolio.pipelines?.[0]?.disclosureResultSetId
    );

export const checkIsDefaultAnalysisRun = (
    resultSet?: ResultSetResponse,
    dataVersion?: DataVersion | null
): boolean => {
    const type = resultSet?.options.type;
    if (!type || !dataVersion) {
        return false;
    }

    switch (type) {
        case 'perils': {
            const { perils, years, scenarios, floodDefense } =
                DEFAULT_PERIL_RESULT_SET_OPTIONS[dataVersion];
            const {
                perils: rsPerils,
                years: rsYears,
                scenarios: rsScenarios,
                floodDefense: rsFloodDefense,
            } = resultSet.options;

            return isEqual(
                {
                    perils: perils?.sort(),
                    years: years?.sort(),
                    scenarios: scenarios?.sort(),
                    floodDefense,
                },
                {
                    perils: rsPerils?.sort(),
                    years: rsYears?.sort(),
                    scenarios: rsScenarios?.sort(),
                    floodDefense: rsFloodDefense,
                }
            );
        }
        case 'damages': {
            const { eiModules } =
                DEFAULT_DAMAGES_RESULT_SET_OPTIONS[dataVersion];
            const {
                defaults: rsDefaults,
                eiModules: rsEIModules,
                perilsOptions: rsPerilOptions,
            } = resultSet.options;
            const isEIDefaultsSetDefault = Object.entries(
                DEFAULT_ECONOMIC_IMPACT_RESULT_SET_OPTIONS_RES
            ).reduce((acc, [key, value]) => {
                const eiDefValue =
                    rsDefaults?.[key as keyof LossAssetAttributes];
                return (
                    acc &&
                    ((isNil(eiDefValue) && isNil(value)) ||
                        isEqual(eiDefValue, value))
                );
            }, true);

            return (
                isEIDefaultsSetDefault &&
                isEqual(
                    {
                        eiModules: eiModules?.sort(),
                    },
                    {
                        eiModules: rsEIModules?.sort(),
                    }
                ) &&
                checkIsDefaultAnalysisRun(
                    {
                        options: { ...rsPerilOptions, type: 'perils' },
                    } as ResultSetResponse,
                    dataVersion
                )
            );
        }
        case 'scores': {
            const { benchmarkLevels, perils, includeBenchmarks } =
                DEFAULT_SCORE_RESULT_SET_OPTIONS[dataVersion];
            const {
                benchmarkLevels: rsBenchmarkLevels,
                perils: rsPerils,
                includeBenchmarks: rsIncludeBenchmarks,
            } = resultSet.options;

            return isEqual(
                {
                    benchmarkLevels: benchmarkLevels?.sort(),
                    perils: perils?.sort(),
                    includeBenchmarks,
                },
                {
                    benchmarkLevels: rsBenchmarkLevels?.sort(),
                    perils: rsPerils?.sort(),
                    includeBenchmarks: rsIncludeBenchmarks,
                }
            );
        }
        default: {
            return false;
        }
    }
};

export const checkIsDownloadSLRDisabled = (
    perilsResultSet: ResultSetResponse | undefined,
    scoresResultSet: ResultSetResponse | undefined
): boolean => {
    if (!perilsResultSet || !scoresResultSet) {
        return true;
    }

    if (
        perilsResultSet.status !== ResultSetStatus.Completed ||
        scoresResultSet.status !== ResultSetStatus.Completed
    ) {
        return true;
    }

    const scoresOptions = scoresResultSet.options as ScoresResultSetOptions;
    const perilsOptions =
        (perilsResultSet.options as DamagesResultSetOptions).perilsOptions ||
        (perilsResultSet.options as PerilsResultSetOptions);

    if (
        !scoresOptions.dataVersion ||
        scoresOptions.dataVersion !== perilsOptions.dataVersion ||
        ![DataVersion.v3_0_0, DataVersion.v3_1_0, DataVersion.v3_2_0].includes(
            scoresOptions.dataVersion as DataVersion
        )
    ) {
        return true;
    }

    if (
        !perilsOptions.scenarios ||
        (!perilsOptions.scenarios.includes(Scenario.SSP245) &&
            !perilsOptions.scenarios.includes(Scenario.SSP585))
    ) {
        return true;
    }

    return false;
};
