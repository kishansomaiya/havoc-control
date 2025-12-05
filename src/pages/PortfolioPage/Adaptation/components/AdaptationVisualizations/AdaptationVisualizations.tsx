import { Box } from '@mui/material';
import { AdaptationSidebar } from '../Sidebar/Sidebar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import {
    LossProjectionsTab,
    ProjectionCategories,
} from '../Tabs/Lossprojection';
import { CapexTab } from '../Tabs/Capex';
import { NpvAnalysisTab, NpvTabProps } from '../Tabs/NpvAnalysisTab';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { AdaptationStepsType } from '../../adaptationSteps';
import {
    useFetchAdaptationConsistencyState,
    useFetchAdaptationKpis,
    useFetchInvestmentMatrix,
} from '../../../../../api/queries/adaptationQueries';
import { CoveredLoadingSpinner } from '../../../../../components/CoveredLoadingSpinner/CoveredLoadingSpinner';
import { floatToRatio } from '../../../../../utils';
import {
    convertStrategiesToSidebarSelection,
    extractInconsistencyState,
    InconsistentState,
    initialSelectedSettings,
    SidebarSelection,
} from './sidebarParsingUtils';
import { LocationAssetAttributes } from '../../../../../api/openapi/auto-generated';

export type AdaptationVisualizationsProps = {
    setView: Dispatch<SetStateAction<AdaptationStepsType>>;
    analysisId: string;
    selectedLocationIds: number[];
    locationList?: LocationAssetAttributes[];
};

const defaultLossData: Record<ProjectionCategories, number[]> = {
    all: [],
    fire: [],
    heat: [],
    flooding: [],
    wind: [],
};

export function AdaptationVisualizations({
    setView,
    analysisId,
    selectedLocationIds,
    locationList,
}: AdaptationVisualizationsProps) {
    const formatMessage = useFormatMessage();
    const [inconsistencyState, setInconsistencyState] =
        useState<InconsistentState>({});
    const [selectedSettings, setSelectedSettings] = useState<SidebarSelection>(
        initialSelectedSettings
    );
    const [tabValue, setTabValue] = useState(0);
    const [shouldVisualizeSelectedAssets, setShouldVisualizeSelectedAssets] =
        useState(true);

    const { data: consistencyData, isFetching: isConsistencyStateFetching } =
        useFetchAdaptationConsistencyState(analysisId, selectedLocationIds);

    const { data: kpiData, isFetching: isAdaptationKpisLoading } =
        useFetchAdaptationKpis(
            analysisId,
            shouldVisualizeSelectedAssets ? selectedLocationIds : []
        );

    const {
        data: investmentMatrixData,
        isFetching: isInvestmentMatrixLoading,
    } = useFetchInvestmentMatrix(
        analysisId,
        shouldVisualizeSelectedAssets ? selectedLocationIds : []
    );

    const isLoading = isAdaptationKpisLoading || isInvestmentMatrixLoading;

    const npvRoiAnalysis: NpvTabProps['kpis'] = useMemo(() => {
        const valueRatio =
            kpiData?.keyPerformanceIndicators?.valueRangeRatio ?? 0;

        return {
            totalNpv: kpiData?.keyPerformanceIndicators?.totalNpv ?? 0,
            averageAssetValue: 0,
            topPerformer:
                kpiData?.keyPerformanceIndicators?.topPerformerNpv ?? 0,
            topPerformerId:
                kpiData?.keyPerformanceIndicators?.topPerformerNpvLocation ?? 0,
            concentration:
                kpiData?.keyPerformanceIndicators?.portfolioConcentration ?? 0,
            valueRange: floatToRatio(valueRatio),
        };
    }, [kpiData]);

    useEffect(() => {
        if (!consistencyData?.strategies) return;

        setSelectedSettings(
            convertStrategiesToSidebarSelection(consistencyData)
        );
        setInconsistencyState(
            extractInconsistencyState(consistencyData, locationList)
        );
    }, [consistencyData, locationList]);

    return (
        <Box
            display={'grid'}
            gridTemplateColumns={'422px 1fr'}
            height={'100%'}
            data-testid="adaptation-visualizations"
        >
            <Box
                padding={'36px'}
                height={'calc(100vh - 170px)'}
                sx={{
                    borderRight: '1px solid #8D9498',
                    overflowX: 'auto',
                }}
                data-testid="sidebar-container"
            >
                <CoveredLoadingSpinner
                    isLoading={isConsistencyStateFetching}
                    testId={'adaptation-sidebar-loader'}
                >
                    <AdaptationSidebar
                        analysisId={analysisId}
                        inconsistencyState={inconsistencyState}
                        selectedLocationIds={selectedLocationIds}
                        selections={selectedSettings}
                        setSelections={setSelectedSettings}
                        setView={setView}
                    />
                </CoveredLoadingSpinner>
            </Box>
            <Box
                sx={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    overflowY: isLoading ? 'hidden' : 'scroll',
                }}
                data-testid="content-container"
            >
                <Box sx={{ borderBottom: '1px solid #8D9498' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: '8px',
                        }}
                        data-testid="tabs-header"
                    >
                        <Tabs
                            value={tabValue}
                            onChange={(_, v) => setTabValue(v)}
                            textColor="inherit"
                            TabIndicatorProps={{
                                style: { backgroundColor: 'transparent' },
                            }}
                            sx={{
                                minHeight: '32px',
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 400,
                                    minHeight: '32px',
                                    fontSize: '14px',
                                    color: '#fff',
                                    border: '1px solid #8D9498',
                                    backgroundColor: 'transparent',
                                    padding: '6px 16px',
                                    minWidth: 'auto',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#3F464B',
                                },
                            }}
                            data-testid="tabs"
                        >
                            <Tab
                                label={formatMessage(
                                    'adaptation.tabs.loss.projection'
                                )}
                                style={{
                                    borderTopLeftRadius: '4px',
                                    borderBottomLeftRadius: '4px',
                                }}
                                data-testid="loss-projection-tab"
                            />
                            <Tab
                                label={formatMessage(
                                    'adaptation.tabs.capex.analysis'
                                )}
                                data-testid="capex-tab"
                            />
                            <Tab
                                label={formatMessage(
                                    'adaptation.tabs.npv_roi.analysis'
                                )}
                                style={{
                                    borderTopRightRadius: '4px',
                                    borderBottomRightRadius: '4px',
                                }}
                                data-testid="npv-roi-tab"
                            />
                        </Tabs>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                            data-testid="switch-container"
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: '#fff', fontSize: '14px' }}
                                data-testid="switch-label"
                            >
                                {formatMessage(
                                    'adaptation.tabs.visualize.switch'
                                )}
                                {` (${selectedLocationIds.length}) `}
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        border: '1px solid #B0B0B0',
                                        textAlign: 'center',
                                        lineHeight: '16px',
                                        fontWeight: 'bold',
                                        fontFamily: 'Italiana, serif',
                                    }}
                                >
                                    i
                                </span>
                            </Typography>
                            <Switch
                                checked={shouldVisualizeSelectedAssets}
                                onChange={(e) =>
                                    setShouldVisualizeSelectedAssets(
                                        e.target.checked
                                    )
                                }
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#4FC3F7',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                        {
                                            backgroundColor: '#4FC3F7',
                                        },
                                }}
                                data-testid="visualize-switch"
                            />
                        </Box>
                    </Box>
                </Box>
                <CoveredLoadingSpinner
                    isLoading={isLoading}
                    testId={'visualization-loading-spinner'}
                >
                    <Box
                        padding={'0 24px'}
                        height={'calc(100vh - 300px)'}
                        data-testid={'visualization-container'}
                    >
                        {tabValue === 0 && (
                            <LossProjectionsTab
                                years={kpiData?.timeseries?.aal?.years ?? []}
                                adaptedLosses={
                                    (kpiData?.timeseries?.aal
                                        ?.adapted as Record<
                                        ProjectionCategories,
                                        number[]
                                    >) ?? defaultLossData
                                }
                                unadaptedLosses={
                                    (kpiData?.timeseries?.aal
                                        ?.unadapted as Record<
                                        ProjectionCategories,
                                        number[]
                                    >) ?? defaultLossData
                                }
                            />
                        )}
                        {tabValue === 1 && (
                            <CapexTab
                                investmentData={investmentMatrixData}
                                capitalCommitment={
                                    kpiData?.keyPerformanceIndicators
                                        ?.totalCapitalCommitment ?? 0
                                }
                                averageAnnualCapex={
                                    kpiData?.keyPerformanceIndicators
                                        ?.averageAnnualCapex ?? 0
                                }
                                peakAnnualInvestment={
                                    kpiData?.keyPerformanceIndicators
                                        ?.peakAnnualInvestment ?? 0
                                }
                                capexYears={
                                    kpiData?.timeseries?.growthCapex?.years ??
                                    []
                                }
                                capexAnnualExpenditure={
                                    kpiData?.timeseries?.growthCapex
                                        ?.growthCapex ?? []
                                }
                            />
                        )}
                        {tabValue === 2 && (
                            <NpvAnalysisTab
                                kpis={npvRoiAnalysis}
                                investmentData={investmentMatrixData}
                            />
                        )}
                    </Box>
                </CoveredLoadingSpinner>
            </Box>
        </Box>
    );
}
