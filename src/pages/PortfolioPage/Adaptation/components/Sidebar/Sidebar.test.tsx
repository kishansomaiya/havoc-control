import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdaptationSidebar } from './Sidebar';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';
import userEvent from '@testing-library/user-event';
import { useBulkUpdateAdaptationSettings } from '../../../../../api/queries/adaptationQueries';
import { SidebarSelection } from '../AdaptationVisualizations/sidebarParsingUtils';

const initialSelections: SidebarSelection = {
    implementationYear: '',
    floodRaiseStructure: false,
    floodRaiseStructureDesignLevel: '50',
    floodElevateSensitive: false,
    floodElevateSensitiveDesignLevel: '50',
    floodProofing: false,
    windEngineering: false,
    windDesignLevel: '50',
    wildfireNonFlammableRoof: false,
    wildfireDoublePaneWindows: false,
    nonExposedVents: false,
    heatActiveCooling: false,
    heatPassiveCooling: false,
    heatEffectiveness: '100%',
};

vi.mocked(useBulkUpdateAdaptationSettings, { partial: true });

const setViewFn = vi.fn();
const renderComponent = (
    props?: Partial<SidebarSelection>,
    setSelections = vi.fn()
) =>
    render(
        <TestRoot>
            <AdaptationSidebar
                analysisId={''}
                selectedLocationIds={[]}
                selections={{ ...initialSelections, ...props }}
                setSelections={setSelections}
                setView={setViewFn}
                inconsistencyState={{}}
            />
        </TestRoot>
    );

describe('AdaptationSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders sidebar container', () => {
        renderComponent();
        expect(screen.getByTestId('adaptation-sidebar')).toBeInTheDocument();
    });

    it('renders adaptation measures section', () => {
        renderComponent();
        expect(
            screen.getByTestId('adaptation-measures-title')
        ).toBeInTheDocument();
    });

    it('renders navigation menu icon', () => {
        renderComponent();
        expect(screen.getByTestId('nav-menu-icon')).toBeInTheDocument();
    });

    it('opens navigation menu when icon is clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        const navIcon = screen.getByTestId('nav-menu-icon');
        await user.click(navIcon);

        // Check that menu items are visible using findBy to wait for them to appear
        const assetSelectionItem = await screen.findByTestId(
            'nav-menu-item-assetSelection'
        );
        const analysisSettingsItem = await screen.findByTestId(
            'nav-menu-item-settingsView'
        );
        const measureSettingsItem = await screen.findByTestId(
            'nav-menu-item-measureSettings'
        );

        expect(assetSelectionItem).toBeInTheDocument();
        expect(analysisSettingsItem).toBeInTheDocument();
        expect(measureSettingsItem).toBeInTheDocument();

        // Verify the text content
        expect(assetSelectionItem).toHaveTextContent(
            formatMessageTesting('adaptation.sidebar.nav.asset_selection')
        );
        expect(analysisSettingsItem).toHaveTextContent(
            formatMessageTesting('adaptation.sidebar.nav.analysis_settings')
        );
        expect(measureSettingsItem).toHaveTextContent(
            formatMessageTesting('adaptation.sidebar.nav.measure_settings')
        );
    });

    it('calls setView when navigation menu item is clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        // Open the menu
        const navIcon = screen.getByTestId('nav-menu-icon');
        await user.click(navIcon);

        // Click on asset selection menu item
        const assetSelectionItem = await screen.findByTestId(
            'nav-menu-item-assetSelection'
        );
        await user.click(assetSelectionItem);

        expect(setViewFn).toHaveBeenCalledWith('assetSelection');
    });

    it('calls setView with correct values for all navigation menu items', async () => {
        const user = userEvent.setup();
        renderComponent();

        // Test asset selection
        const navIcon = screen.getByTestId('nav-menu-icon');
        await user.click(navIcon);

        const assetSelectionItem = await screen.findByTestId(
            'nav-menu-item-assetSelection'
        );
        await user.click(assetSelectionItem);
        expect(setViewFn).toHaveBeenCalledWith('assetSelection');

        // Test analysis settings
        await user.click(navIcon);
        const analysisSettingsItem = await screen.findByTestId(
            'nav-menu-item-settingsView'
        );
        await user.click(analysisSettingsItem);
        expect(setViewFn).toHaveBeenCalledWith('settingsView');

        // Test measure settings
        await user.click(navIcon);
        const measureSettingsItem = await screen.findByTestId(
            'nav-menu-item-measureSettings'
        );
        await user.click(measureSettingsItem);
        expect(setViewFn).toHaveBeenCalledWith('measureSettings');
    });

    it('renders implementation year select with correct label', () => {
        renderComponent();
        const expectedLabel = formatMessageTesting(
            'adaptation.sidebar.implementation_year'
        );
        const select = screen.getByLabelText(expectedLabel);
        expect(select).toBeInTheDocument();
    });

    it('renders flood section with correct heading', () => {
        renderComponent();
        expect(screen.getByTestId('flood-section')).toBeInTheDocument();
        expect(screen.getByTestId('flood-section-title')).toBeInTheDocument();
    });

    it('renders flood section switches with correct labels and initial states', () => {
        renderComponent();

        const raiseStructureLabel = formatMessageTesting(
            'adaptation.sidebar.flood.raise_structure'
        );
        const elevateSensitiveLabel = formatMessageTesting(
            'adaptation.sidebar.flood.elevate_sensitive'
        );
        const floodProofingLabel = formatMessageTesting(
            'adaptation.sidebar.flood.proofing'
        );

        expect(screen.getByLabelText(raiseStructureLabel)).not.toBeChecked();
        expect(screen.getByLabelText(elevateSensitiveLabel)).not.toBeChecked();
        expect(screen.getByLabelText(floodProofingLabel)).not.toBeChecked();
    });

    it('renders wind section switches with correct labels and initial states', () => {
        renderComponent();

        const windEngineeringLabel = formatMessageTesting(
            'adaptation.sidebar.wind.engineering'
        );

        expect(screen.getByLabelText(windEngineeringLabel)).not.toBeChecked();
    });

    it('renders wildfire section switches with correct labels and initial states', () => {
        renderComponent();

        const nonFlammableRoofLabel = formatMessageTesting(
            'adaptation.sidebar.wildfire.non_flammable_roof'
        );
        const doublePaneWindowsLabel = formatMessageTesting(
            'adaptation.sidebar.wildfire.double_pane_windows'
        );
        const nonExposedVentsLabel = formatMessageTesting(
            'adaptation.sidebar.wildfire.non_exposed_vents'
        );

        expect(screen.getByLabelText(nonFlammableRoofLabel)).not.toBeChecked();
        expect(screen.getByLabelText(doublePaneWindowsLabel)).not.toBeChecked();
        expect(screen.getByLabelText(nonExposedVentsLabel)).not.toBeChecked();
    });

    it('renders heat section switches with correct labels and initial states', () => {
        renderComponent();

        const activeCoolingLabel = formatMessageTesting(
            'adaptation.sidebar.heat.active_cooling'
        );
        const passiveCoolingLabel = formatMessageTesting(
            'adaptation.sidebar.heat.passive_cooling'
        );

        expect(screen.getByLabelText(activeCoolingLabel)).not.toBeChecked();
        expect(screen.getByLabelText(passiveCoolingLabel)).not.toBeChecked();
    });

    it('renders Apply Changes button', () => {
        renderComponent();
        expect(screen.getByTestId('apply-changes-button')).toBeInTheDocument();
    });

    it('reflects correct initial state for checked switches', () => {
        renderComponent({
            floodRaiseStructure: true,
            windEngineering: true,
            heatActiveCooling: true,
            nonExposedVents: true,
        });

        const raiseStructureLabel = formatMessageTesting(
            'adaptation.sidebar.flood.raise_structure'
        );
        const windEngineeringLabel = formatMessageTesting(
            'adaptation.sidebar.wind.engineering'
        );
        const activeCoolingLabel = formatMessageTesting(
            'adaptation.sidebar.heat.active_cooling'
        );
        const nonExposedVentsLabel = formatMessageTesting(
            'adaptation.sidebar.wildfire.non_exposed_vents'
        );

        expect(screen.getByLabelText(raiseStructureLabel)).toBeChecked();
        expect(screen.getByLabelText(windEngineeringLabel)).toBeChecked();
        expect(screen.getByLabelText(activeCoolingLabel)).toBeChecked();
        expect(screen.getByLabelText(nonExposedVentsLabel)).toBeChecked();
    });
});
