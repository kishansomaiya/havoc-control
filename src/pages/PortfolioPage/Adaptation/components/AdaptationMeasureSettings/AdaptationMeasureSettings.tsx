import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { DataGrid } from '@mui/x-data-grid';
import { AdaptationStepsType } from '../../adaptationSteps';
import { SearchBar } from '../../../../../components/Inputs/SearchBar';
import { MeasureData, TabValues, useTableColumns } from './useTableColumns';
import {
    useFetchInvestmentMatrix,
    usePostAdaptationIndividualLocations,
} from '../../../../../api/queries/adaptationQueries';
import { mapStrategies, mapStrategiesForSubmit } from './utils';
import { CoveredLoadingSpinner } from '../../../../../components/CoveredLoadingSpinner/CoveredLoadingSpinner';
import { LoadingButton } from '@mui/lab';

interface AdaptationMeasureSettingsProps {
    setView: Dispatch<SetStateAction<AdaptationStepsType>>;
    analysisId: string;
    selectedLocationIds: number[];
}

export function AdaptationMeasureSettings({
    setView,
    analysisId,
    selectedLocationIds,
}: AdaptationMeasureSettingsProps) {
    const formatMessage = useFormatMessage();
    const [tabValue, setTabValue] = useState<TabValues>('loss');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeData, setActiveData] = useState<MeasureData[]>([]);
    const [showConfirm, setShowConfirm] = useState<'save' | 'cancel' | null>(
        null
    );

    const { data, isLoading } = useFetchInvestmentMatrix(
        analysisId,
        selectedLocationIds
    );
    const { mutateAsync, isPending } =
        usePostAdaptationIndividualLocations(analysisId);

    const parsedValues = useMemo<MeasureData[]>(() => {
        if (!data) return [];

        return data.map((measureData) => {
            const unadaptedAAL = measureData?.unadaptedAal2025 ?? 0;
            const adaptedAAL = measureData?.adaptedAal2025 ?? 0;

            return {
                ...mapStrategies(measureData?.strategies),
                locationId: measureData?.customerLocationId,
                locationName: measureData?.name ?? '',
                npv: measureData?.netPresentValue,
                breakevenYear: measureData?.breakevenYear,
                implementationYear: measureData?.implementationYear
                    ? measureData.implementationYear.toString()
                    : '',
                roi: measureData?.returnOnInvestment,
                unadaptedAAL,
                adaptedAAL,
                delta: unadaptedAAL - adaptedAAL,
                capex: measureData?.growthCapex,
                occupancy: measureData?.occupancyName ?? '',
            };
        });
    }, [data]);

    const tableColumns = useTableColumns(parsedValues, setActiveData);

    const selectedTabColumns = useMemo(
        () =>
            tableColumns[tabValue].map((c) => ({
                ...c,
                headerName: formatMessage(c.headerName),
            })),
        [formatMessage, tabValue, tableColumns]
    );

    const filteredData = useMemo(() => {
        // Merges the active list and loadedList to handle partialSends
        const mergedData = parsedValues.map((v) => {
            const active = activeData.find(
                (a) => a.locationId === v.locationId
            );
            return active ?? v;
        });

        if (!searchTerm) return mergedData;
        return mergedData.filter(
            (d) =>
                d.locationName &&
                d.locationName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, parsedValues, activeData]);

    const handleSave = () => setShowConfirm('save');
    const handleCancel = () => setShowConfirm('cancel');
    const handleTabChange = (_: React.SyntheticEvent, newValue: TabValues) =>
        setTabValue(newValue);

    const handleConfirmNo = () => setShowConfirm(null);
    const handleConfirmYes = () => {
        if (showConfirm === 'save') {
            const locations = activeData.map((a) => ({
                ...a,
                customerLocationId: a.locationId,
                strategies: mapStrategiesForSubmit(a),
                implementationYear: parseInt(a.implementationYear),
            }));
            mutateAsync({ locations }).then(() => {
                setView('visualizations');
            });
        } else if (showConfirm === 'cancel') {
            setView('visualizations');
        }
    };

    return (
        <CoveredLoadingSpinner
            isLoading={isLoading}
            testId={'adaptation-measure-settings-loading-spinner'}
        >
            <Box
                sx={{
                    backgroundColor: '#2d2d2d',
                    color: 'white',
                    minHeight: '100vh',
                    p: 3,
                    marginBottom: 10,
                    overflowY: 'scroll',
                    paddingBottom: '200px',
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            mb: 1,
                            fontWeight: 600,
                            fontSize: '1.5rem',
                        }}
                    >
                        {formatMessage('adaptation.measure_settings.title')}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            width: '75%',
                        }}
                    >
                        {formatMessage(
                            'adaptation.measure_settings.description'
                        )}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Box
                        width={'100%'}
                        maxWidth={'400px'}
                    >
                        <SearchBar
                            testId={'adaptation-measures-search'}
                            placeholder={formatMessage('search_bar.search')}
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onClearIconClick={() => setSearchTerm('')}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={handleCancel}
                            sx={{
                                color: '#cccccc',
                                borderColor: '#555',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                '&:hover': {
                                    borderColor: '#777',
                                    backgroundColor: '#404040',
                                },
                            }}
                            variant="outlined"
                        >
                            {formatMessage('general.cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            color="inherit"
                            sx={{
                                backgroundColor: '#1976d2 !important',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
                            {formatMessage('general.save')}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="measure settings tabs"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#404040',
                                height: 0.5,
                            },
                            '& .MuiTab-root': {
                                color: '#ffffff',
                                border: '1px solid #555',
                                textTransform: 'uppercase',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                minHeight: '24px',
                                '&.Mui-selected': {
                                    color: '#fff',
                                    backgroundColor: '#404040',
                                },
                            },
                        }}
                    >
                        <Tab
                            value={'loss'}
                            label={formatMessage(
                                'adaptation.measure_settings.tabs.loss_financial_metrics'
                            )}
                            sx={{ borderRadius: '4px 0 0 4px' }}
                        />
                        <Tab
                            value={'flood'}
                            label={formatMessage(
                                'adaptation.measure_settings.tabs.flood'
                            )}
                        />
                        <Tab
                            value={'wind'}
                            label={formatMessage(
                                'adaptation.measure_settings.tabs.wind'
                            )}
                        />
                        <Tab
                            value={'wildfire'}
                            label={formatMessage(
                                'adaptation.measure_settings.tabs.wildfire'
                            )}
                        />
                        <Tab
                            value={'heat'}
                            label={formatMessage(
                                'adaptation.measure_settings.tabs.heat'
                            )}
                            sx={{ borderRadius: '0 4px 4px 0' }}
                        />
                    </Tabs>
                </Box>

                <DataGrid
                    columns={selectedTabColumns}
                    rows={filteredData}
                    getRowId={(r) => r.locationId}
                />
                <Dialog
                    open={!!showConfirm}
                    onClose={handleConfirmNo}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#2d2d2d',
                            color: 'white',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: '#2d2d2d',
                            color: 'white',
                            fontSize: '1.25rem',
                        }}
                    >
                        {showConfirm === 'save'
                            ? formatMessage(
                                  'adaptation.measure_settings.confirm_save'
                              )
                            : formatMessage(
                                  'adaptation.measure_settings.confirm_cancel'
                              )}
                    </DialogTitle>
                    <DialogContent sx={{ backgroundColor: '#2d2d2d' }}>
                        <Typography sx={{ color: 'white' }}>
                            {formatMessage(
                                'adaptation.measure_settings.confirm_message',
                                {
                                    action:
                                        showConfirm === 'save'
                                            ? 'save'
                                            : 'cancel',
                                    effect:
                                        showConfirm === 'save'
                                            ? 'apply'
                                            : 'discard',
                                }
                            )}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: '#2d2d2d' }}>
                        <Button
                            onClick={handleConfirmNo}
                            sx={{ color: '#cccccc' }}
                        >
                            {formatMessage('general.no')}
                        </Button>
                        <LoadingButton
                            onClick={handleConfirmYes}
                            variant="contained"
                            color="inherit"
                            sx={{ backgroundColor: '#1976d2 !important' }}
                            loading={isPending}
                        >
                            {showConfirm === 'save'
                                ? formatMessage('general.yes')
                                : formatMessage('general.ok')}
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
        </CoveredLoadingSpinner>
    );
}
