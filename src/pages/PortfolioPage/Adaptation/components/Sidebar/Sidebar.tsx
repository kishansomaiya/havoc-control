import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Switch } from '../../../../../components/Switch/Switch';
import {
    MessageKeys,
    useFormatMessage,
} from '../../../../../localization/useFormatMessage';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { PrefixLevelSelect } from '../PrefixLevelSelect';
import { Select } from '../../../../../components/Select/Select';
import { Menu, MenuItem } from '@mui/material';
import { MoreVertical } from 'react-feather';
import { AdaptationStepsType } from '../../adaptationSteps';
import { useBulkUpdateAdaptationSettings } from '../../../../../api/queries/adaptationQueries';
import { LoadingButton } from '@mui/lab';
import {
    InconsistentState,
    SidebarSelection,
} from '../AdaptationVisualizations/sidebarParsingUtils';
import { AssetWarning } from './AssetWarning';
import { effectivenessLevels, implementationYears } from '../../config';

const selectionUpdater = (
    key: keyof SidebarSelection,
    setter: Dispatch<SetStateAction<SidebarSelection>>
) => {
    return (value: unknown) => {
        setter((old) => ({ ...old, [key]: value }));
    };
};

const navSelection: {
    view: AdaptationStepsType;
    label: MessageKeys;
}[] = [
    {
        view: 'assetSelection',
        label: 'adaptation.sidebar.nav.asset_selection',
    },
    {
        view: 'settingsView',
        label: 'adaptation.sidebar.nav.analysis_settings',
    },
    {
        view: 'measureSettings',
        label: 'adaptation.sidebar.nav.measure_settings',
    },
];

export type AdaptationSidebarProps = {
    selections: SidebarSelection;
    setSelections: Dispatch<SetStateAction<SidebarSelection>>;
    setView: Dispatch<SetStateAction<AdaptationStepsType>>;
    inconsistencyState: InconsistentState;
    analysisId: string;
    selectedLocationIds: number[];
};

export function AdaptationSidebar({
    selections,
    setSelections,
    setView,
    analysisId,
    selectedLocationIds,
    inconsistencyState,
}: AdaptationSidebarProps) {
    const formatMessage = useFormatMessage();
    const navIconRef = useRef(null);
    const [openNavMenu, setOpenNavMenu] = useState(false);

    const { mutateAsync, isPending } =
        useBulkUpdateAdaptationSettings(analysisId);

    const handleApplyOnClick = useCallback(() => {
        const checkEnabled = (b: boolean) => (b ? 'Enabled' : undefined);
        const designLevelOption = (b: boolean, val: string) =>
            b ? `${val}yr` : undefined;
        const effectivenessOption = (b: boolean, val: string) =>
            b ? val : undefined;
        mutateAsync({
            customerLocationIds: selectedLocationIds,
            implementationYear: parseInt(selections.implementationYear),
            strategies: {
                flooding: {
                    strategies: {
                        FL_elevateStructure: designLevelOption(
                            selections.floodRaiseStructure,
                            selections.floodRaiseStructureDesignLevel
                        ),
                        FL_siteProtection: designLevelOption(
                            selections.floodElevateSensitive,
                            selections.floodElevateSensitiveDesignLevel
                        ),
                        FL_dryFloodproof: checkEnabled(
                            selections.floodProofing
                        ),
                    },
                },
                wind: {
                    strategies: {
                        WS_windRetrofit: designLevelOption(
                            selections.windEngineering,
                            selections.windDesignLevel
                        ),
                    },
                },
                fire: {
                    strategies: {
                        FR_roof: checkEnabled(
                            selections.wildfireNonFlammableRoof
                        ),
                        FR_windows: checkEnabled(
                            selections.wildfireDoublePaneWindows
                        ),
                        FR_vents: checkEnabled(selections.nonExposedVents),
                    },
                },
                heat: {
                    strategies: {
                        HT_airConditioning: effectivenessOption(
                            selections.heatActiveCooling,
                            selections.heatEffectiveness
                        ),
                        HT_coolRoof: checkEnabled(
                            selections.heatPassiveCooling
                        ),
                    },
                },
            },
        });
    }, [selections, mutateAsync, selectedLocationIds]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'scroll',
            }}
            data-testid="adaptation-sidebar"
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h3"
                        data-testid="adaptation-measures-title"
                    >
                        {formatMessage(
                            'adaptation.sidebar.adaptation_measures'
                        )}
                    </Typography>

                    <Box
                        ref={navIconRef}
                        onClick={() => setOpenNavMenu(true)}
                        sx={{ cursor: 'pointer' }}
                        data-testid="nav-menu-icon"
                    >
                        <MoreVertical size={'1.25rem'} />
                    </Box>
                    <Menu
                        open={openNavMenu}
                        onClose={() => setOpenNavMenu(false)}
                        anchorEl={navIconRef.current}
                        data-testid="nav-menu"
                    >
                        {navSelection.map(({ view, label }) => (
                            <MenuItem
                                key={view}
                                onClick={() => setView(view)}
                                data-testid={`nav-menu-item-${view}`}
                            >
                                {formatMessage(label)}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <Select
                    value={selections.implementationYear}
                    onChange={selectionUpdater(
                        'implementationYear',
                        setSelections
                    )}
                    label={formatMessage(
                        'adaptation.sidebar.implementation_year'
                    )}
                    options={implementationYears.map((y) => ({
                        label: y,
                        value: y,
                    }))}
                    data-testid="implementation-year-select"
                />
            </Box>
            <Box data-testid="flood-section">
                <Typography
                    variant="h3"
                    sx={{ textDecoration: 'underline' }}
                    data-testid="flood-section-title"
                >
                    {formatMessage('adaptation.sidebar.flood')}
                </Typography>
                <AssetWarning
                    reason={inconsistencyState['FL_elevateStructure']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.flood.raise_structure'
                    )}
                >
                    <Switch
                        checked={selections.floodRaiseStructure}
                        onCheckedChange={selectionUpdater(
                            'floodRaiseStructure',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.flood.raise_structure'
                        )}
                        data-testid="flood-raise-structure-switch"
                    />
                    <PrefixLevelSelect
                        disabled={!selections.floodRaiseStructure}
                        selectedLevel={
                            selections.floodRaiseStructureDesignLevel
                        }
                        onLevelChange={selectionUpdater(
                            'floodRaiseStructureDesignLevel',
                            setSelections
                        )}
                        data-testid="flood-design-level-select"
                    />
                </AssetWarning>
                <AssetWarning
                    reason={inconsistencyState['FL_siteProtection']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.flood.elevate_sensitive'
                    )}
                >
                    <Switch
                        checked={selections.floodElevateSensitive}
                        onCheckedChange={selectionUpdater(
                            'floodElevateSensitive',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.flood.elevate_sensitive'
                        )}
                        data-testid="flood-elevate-sensitive-switch"
                    />
                    <PrefixLevelSelect
                        disabled={!selections.floodElevateSensitive}
                        selectedLevel={
                            selections.floodElevateSensitiveDesignLevel
                        }
                        onLevelChange={selectionUpdater(
                            'floodElevateSensitiveDesignLevel',
                            setSelections
                        )}
                        data-testid="flood-design-level-select"
                    />
                </AssetWarning>
                <AssetWarning
                    reason={inconsistencyState['FL_dryFloodproof']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.flood.proofing'
                    )}
                >
                    <Switch
                        checked={selections.floodProofing}
                        onCheckedChange={selectionUpdater(
                            'floodProofing',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.flood.proofing'
                        )}
                        data-testid="flood-proofing-switch"
                    />
                </AssetWarning>
            </Box>
            <Box data-testid="wind-section">
                <Typography
                    variant="h3"
                    sx={{ textDecoration: 'underline' }}
                    data-testid="wind-section-title"
                >
                    {formatMessage('adaptation.sidebar.wind')}
                </Typography>
                <AssetWarning
                    reason={inconsistencyState['WS_windRetrofit']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.wind.engineering'
                    )}
                >
                    <Switch
                        checked={selections.windEngineering}
                        onCheckedChange={selectionUpdater(
                            'windEngineering',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.wind.engineering'
                        )}
                        data-testid="wind-engineering-switch"
                    />
                    <PrefixLevelSelect
                        disabled={!selections.windEngineering}
                        selectedLevel={selections.windDesignLevel}
                        onLevelChange={selectionUpdater(
                            'windDesignLevel',
                            setSelections
                        )}
                        data-testid="wind-design-level-select"
                    />
                </AssetWarning>
            </Box>
            <Box data-testid="wildfire-section">
                <Typography
                    variant="h3"
                    sx={{ textDecoration: 'underline' }}
                    data-testid="wildfire-section-title"
                >
                    {formatMessage('adaptation.sidebar.wildfire')}
                </Typography>
                <AssetWarning
                    reason={inconsistencyState['FR_roof']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.wildfire.non_flammable_roof'
                    )}
                >
                    <Switch
                        checked={selections.wildfireNonFlammableRoof}
                        onCheckedChange={selectionUpdater(
                            'wildfireNonFlammableRoof',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.wildfire.non_flammable_roof'
                        )}
                        data-testid="wildfire-non-flammable-roof-switch"
                    />
                </AssetWarning>
                <AssetWarning
                    reason={inconsistencyState['FR_windows']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.wildfire.double_pane_windows'
                    )}
                >
                    <Switch
                        checked={selections.wildfireDoublePaneWindows}
                        onCheckedChange={selectionUpdater(
                            'wildfireDoublePaneWindows',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.wildfire.double_pane_windows'
                        )}
                        data-testid="wildfire-double-pane-windows-switch"
                    />
                </AssetWarning>
                <AssetWarning
                    reason={inconsistencyState['FR_vents']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.wildfire.non_exposed_vents'
                    )}
                >
                    <Switch
                        checked={selections.nonExposedVents}
                        onCheckedChange={selectionUpdater(
                            'nonExposedVents',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.wildfire.non_exposed_vents'
                        )}
                        data-testid="wildfire-non-exposed-vents-switch"
                    />
                </AssetWarning>
            </Box>
            <Box data-testid="heat-section">
                <Typography
                    variant="h3"
                    sx={{ textDecoration: 'underline' }}
                    data-testid="heat-section-title"
                >
                    {formatMessage('adaptation.sidebar.heat')}
                </Typography>
                <AssetWarning
                    reason={inconsistencyState['HT_airConditioning']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.heat.active_cooling'
                    )}
                >
                    <Switch
                        checked={selections.heatActiveCooling}
                        onCheckedChange={selectionUpdater(
                            'heatActiveCooling',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.heat.active_cooling'
                        )}
                        data-testid="heat-active-cooling-switch"
                    />
                    <PrefixLevelSelect
                        disabled={!selections.heatActiveCooling}
                        selectedLevel={selections.heatEffectiveness}
                        onLevelChange={selectionUpdater(
                            'heatEffectiveness',
                            setSelections
                        )}
                        levels={effectivenessLevels}
                        postfix={''}
                        baseMessage={'adaptation.sidebar.effectiveness'}
                        data-testid="heat-effectiveness-select"
                    />
                </AssetWarning>
                <AssetWarning
                    reason={inconsistencyState['HT_coolRoof']}
                    strategyName={formatMessage(
                        'adaptation.sidebar.heat.passive_cooling'
                    )}
                >
                    <Switch
                        checked={selections.heatPassiveCooling}
                        onCheckedChange={selectionUpdater(
                            'heatPassiveCooling',
                            setSelections
                        )}
                        label={formatMessage(
                            'adaptation.sidebar.heat.passive_cooling'
                        )}
                        data-testid="heat-passive-cooling-switch"
                    />
                </AssetWarning>
            </Box>
            <Box
                display={'flex'}
                justifyContent={'end'}
                data-testid="apply-changes-section"
            >
                <Box width={'min-content'}>
                    <LoadingButton
                        loading={isPending}
                        variant="contained"
                        fullWidth
                        color={'secondary'}
                        data-testid="apply-changes-button"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={handleApplyOnClick}
                    >
                        {formatMessage('adaptation.sidebar.apply_changes')}
                    </LoadingButton>
                </Box>
            </Box>
        </Box>
    );
}
