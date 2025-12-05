import { useMemo } from 'react';
import { DataVersion, EIVersion } from '../../../types';
import { defaultCustomAnalysisData, IPortfolio } from '../types/portfolio';
import { AnalysisType } from '../types/analysisTypeEnum';

export interface UseInitialFormValuesParams {
    name?: string;
    locationCount?: number;
    category?: {
        id: string;
        label: string;
    } | null;
    dataVersion?: DataVersion;
    eiVersion?: EIVersion;
    changeAnalysisType: boolean;
    isMockPortfolio?: boolean;
    runDisclosureAnalysis?: boolean;
}

export function useInitialFormValues({
    name,
    locationCount,
    category,
    dataVersion,
    eiVersion,
    changeAnalysisType,
    isMockPortfolio = false,
    runDisclosureAnalysis,
}: UseInitialFormValuesParams): {
    initialFormValues?: IPortfolio;
} {
    const initialFormValues = useMemo<IPortfolio | undefined>(() => {
        if (
            name === undefined ||
            category === undefined ||
            dataVersion === undefined
        ) {
            return undefined;
        }
        const initialFormValues: IPortfolio = {
            name,
            locationCount: locationCount ?? 0,
            category,
            dataVersion,
            eiVersion,
            type: AnalysisType.PerilsAndScores,

            runDisclosureAnalysis: runDisclosureAnalysis ?? false,

            changeAnalysisType,
            isMockPortfolio: isMockPortfolio ?? false,

            isPerilMetricsEnabled: false,
            isEconomicImpactsEnabled: false,
            isScoresEnabled: false,
            isFloodMeshEnabled: false,

            custom: defaultCustomAnalysisData(dataVersion),
        };
        return initialFormValues;
    }, [
        runDisclosureAnalysis,
        category,
        changeAnalysisType,
        dataVersion,
        name,
        isMockPortfolio,
        eiVersion,
        locationCount,
    ]);
    return { initialFormValues };
}
