import {
    DamagesResultSetOptions,
    DamagesResultSetOptionsTypeEnum,
    PerilsResultSetOptions,
    PerilsResultSetOptionsTypeEnum,
    RunPipelineRequest,
    ScoresResultSetOptions,
    ScoresResultSetOptionsTypeEnum,
    MeshResultSetOptions,
    DisclosureResultSetOptions,
    AdaptationResultSetOptionsInput,
} from '../../../../api/openapi/auto-generated';
import { IPortfolio } from '../../types/portfolio';
import { AnalysisType } from '../../types/analysisTypeEnum';
import {
    DEFAULT_DAMAGES_RESULT_SET_OPTIONS,
    DEFAULT_ENABLED_PRPL,
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
    DEFAULT_SCORE_RESULT_SET_OPTIONS,
} from '../../../../const';
import {
    prepareEconomicImpactsResultSetOptions,
    prepareFloodMeshResultSetOptions,
    preparePerilsResultSetOptions,
    prepareScoresResultSetOptions,
} from './custom';

export function preparePipeline(
    portfolio: IPortfolio
): RunPipelineRequest | undefined {
    const {
        type,
        changeAnalysisType,
        dataVersion,
        eiVersion,
        runDisclosureAnalysis,
        runAdaptationOpportunitiesAnalysis,
    } = portfolio;

    if (!changeAnalysisType) {
        return undefined;
    }

    let perilsResultSetOptions: PerilsResultSetOptions | undefined;
    let impactsResultSetOptions: DamagesResultSetOptions | undefined;
    let scoresResultSetOptions: ScoresResultSetOptions | undefined;
    let meshResultSetOptions: MeshResultSetOptions | undefined;
    let enablePrpl: boolean = false;

    let disclosureResultSetOptions: DisclosureResultSetOptions | undefined;
    let adaptationResultSetOptions: AdaptationResultSetOptionsInput | undefined;

    switch (type) {
        case AnalysisType.PerilsAndScores:
            perilsResultSetOptions = {
                ...DEFAULT_PERIL_RESULT_SET_OPTIONS[dataVersion],
                type: PerilsResultSetOptionsTypeEnum.perils,
            };
            scoresResultSetOptions = {
                ...DEFAULT_SCORE_RESULT_SET_OPTIONS[dataVersion],
                type: ScoresResultSetOptionsTypeEnum.scores,
            };
            break;
        case AnalysisType.PerilsScoresAndEconomicImpact:
            impactsResultSetOptions = {
                ...DEFAULT_DAMAGES_RESULT_SET_OPTIONS[dataVersion],
                eiVersion,
                type: DamagesResultSetOptionsTypeEnum.damages,
            };
            scoresResultSetOptions = {
                ...DEFAULT_SCORE_RESULT_SET_OPTIONS[dataVersion],
                type: ScoresResultSetOptionsTypeEnum.scores,
            };
            enablePrpl = DEFAULT_ENABLED_PRPL[dataVersion];
            break;
        case AnalysisType.Custom:
            if (portfolio.isEconomicImpactsEnabled) {
                impactsResultSetOptions =
                    prepareEconomicImpactsResultSetOptions(portfolio);

                enablePrpl =
                    portfolio.custom.economicImpacts.financialParameters
                        .financialMetrics.generatePortfolioLevelResults;
            } else if (portfolio.isPerilMetricsEnabled) {
                perilsResultSetOptions =
                    preparePerilsResultSetOptions(portfolio);
            }
            if (portfolio.isScoresEnabled) {
                scoresResultSetOptions =
                    prepareScoresResultSetOptions(portfolio);
            }
            if (portfolio.isFloodMeshEnabled) {
                meshResultSetOptions =
                    prepareFloodMeshResultSetOptions(portfolio);
            }
            break;
    }

    if (runDisclosureAnalysis) {
        disclosureResultSetOptions = {
            dataVersion: '3.2.0',
        };
    }

    if (runAdaptationOpportunitiesAnalysis) {
        adaptationResultSetOptions = {
            type: 'adaptation',
        };
    }

    return {
        portfolioId: '',
        perilsResultSetOptions,
        impactsResultSetOptions,
        scoresResultSetOptions,
        meshResultSetOptions,
        disclosureResultSetOptions,
        adaptationResultSetOptions,
        enablePrpl,
    };
}
