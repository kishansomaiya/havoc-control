import { AdaptationTeaser } from './components/AdaptationTeaser/AdaptationTeaser';
import { useFeatureFlags } from '../../../featureFlags/useFeatureFlags';
import { useEffect, useRef, useState } from 'react';
import { AdaptationSteps, AdaptationStepsType } from './adaptationSteps';
import {
    useGetAdaptationAnalysisSettings,
    useGetAdaptationLocationList,
} from '../../../api/queries/adaptationQueries';
import { CoveredLoadingSpinner } from '../../../components/CoveredLoadingSpinner/CoveredLoadingSpinner';
import { usePortfolioQuery } from '../../../api/queries/portfoliosQuery';
import { useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useFormatMessage } from '../../../localization/useFormatMessage';

export function PortfolioAdaptationTab() {
    const formatMessage = useFormatMessage();
    const { portfolioId } = useParams();
    const queryClient = useQueryClient();
    const { portfolio, isPortfolioLoading } = usePortfolioQuery(portfolioId);
    const refetchTimer = useRef<{
        timeout?: NodeJS.Timeout;
        refetchCount: number;
    } | null>(null);

    const analysisId = portfolio?.pipelines?.[0]?.adaptationResultSetId ?? '';
    const {
        data: analysisSettings,
        isFetching: isLoadingAnalysisSettings,
        isFetched: hasLoadedInitialAnalysisSettings,
        refetch: refetchAnalysisSettings,
    } = useGetAdaptationAnalysisSettings(analysisId);

    const { data: locationList, isLoading: isLocationListLoading } =
        useGetAdaptationLocationList(analysisId);

    const [view, setView] = useState<AdaptationStepsType>('assetSelection');
    const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>(
        []
    );

    const { adaptationModuleEnabled } = useFeatureFlags(
        'adaptationModuleEnabled'
    );

    const showSpinner =
        isPortfolioLoading ||
        isLoadingAnalysisSettings ||
        !analysisSettings?.status ||
        analysisSettings.status === 'pending';

    useEffect(() => {
        if (
            !adaptationModuleEnabled ||
            isLoadingAnalysisSettings ||
            refetchTimer.current !== null ||
            (!!analysisSettings?.status &&
                analysisSettings.status !== 'pending')
        ) {
            return;
        }

        const refetchBackOff = ({
            data,
        }: {
            data?: typeof analysisSettings;
        }) => {
            const cleanRefetch = () => {
                clearTimeout(refetchTimer.current?.timeout);
                refetchTimer.current = null;
            };

            if (!!data?.status && data.status !== 'pending') {
                cleanRefetch();
                [
                    'adaptationInvestmentMatrix',
                    'adaptationKpis',
                    'adaptationConsistencyState',
                ].forEach((key) => {
                    queryClient.refetchQueries({
                        queryKey: [analysisId, key, ...selectedLocationIds],
                        stale: true,
                        exact: true,
                    });
                });
                return;
            }

            if (refetchTimer.current === null) {
                refetchTimer.current = {
                    refetchCount: 0,
                };
            }

            refetchTimer.current.refetchCount += 1;
            let waitTime = 1000;
            if (refetchTimer.current?.refetchCount > 10)
                waitTime =
                    Math.floor(refetchTimer.current.refetchCount / 10) * 1000;
            if (refetchTimer.current?.refetchCount > 50) return cleanRefetch();

            refetchTimer.current.timeout = setTimeout(() => {
                refetchAnalysisSettings()
                    .then(refetchBackOff)
                    .catch(refetchBackOff);
            }, waitTime);
        };

        refetchBackOff({ data: analysisSettings });
    }, [
        analysisId,
        selectedLocationIds,
        queryClient,
        adaptationModuleEnabled,
        refetchAnalysisSettings,
        analysisSettings,
        isLoadingAnalysisSettings,
    ]);

    if (!adaptationModuleEnabled) {
        return <AdaptationTeaser />;
    }

    const Component = AdaptationSteps[view];

    return (
        <CoveredLoadingSpinner
            isLoading={showSpinner}
            testId={'page-adaptation-tab'}
            text={
                hasLoadedInitialAnalysisSettings && !!analysisSettings?.status
                    ? formatMessage('adaptation.recalculating.loader')
                    : undefined
            }
            zIndex={2}
        >
            <Component
                setView={setView}
                analysisId={analysisSettings?.status ? analysisId : ''}
                analysisSettings={analysisSettings}
                isLoadingAnalysisSettings={isLoadingAnalysisSettings}
                selectedLocationIds={selectedLocationIds}
                setSelectedLocationIds={setSelectedLocationIds}
                locationList={locationList}
                isLocationListLoading={isLocationListLoading}
            />
        </CoveredLoadingSpinner>
    );
}
