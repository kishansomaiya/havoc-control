import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdaptationVisualizations } from './AdaptationVisualizations';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';
import { TestRoot } from '../../../../../testing/TestRoot';

const setViewFn = vi.fn();
const renderComponent = (props = {}) => {
    const defaultProps = {
        setView: setViewFn,
        analysisId: '1',
        selectedLocationIds: [],
        ...props,
    };
    return render(<AdaptationVisualizations {...defaultProps} />, {
        wrapper: TestRoot,
    });
};

describe('AdaptationVisualizations', () => {
    beforeEach(() => {
        setViewFn.mockClear();
    });

    it('renders the main container with correct structure', () => {
        renderComponent();

        expect(
            screen.getByTestId('adaptation-visualizations')
        ).toBeInTheDocument();
        expect(screen.getByTestId('sidebar-container')).toBeInTheDocument();
        expect(screen.getByTestId('content-container')).toBeInTheDocument();
    });

    it('renders tabs header with all tabs', () => {
        renderComponent();

        expect(screen.getByTestId('tabs-header')).toBeInTheDocument();
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
        expect(screen.getByTestId('loss-projection-tab')).toBeInTheDocument();
        expect(screen.getByTestId('capex-tab')).toBeInTheDocument();
        expect(screen.getByTestId('npv-roi-tab')).toBeInTheDocument();
    });

    it('displays correct tab labels', () => {
        renderComponent();

        expect(
            screen.getByText(
                formatMessageTesting('adaptation.tabs.loss.projection')
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.tabs.capex.analysis')
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.tabs.npv_roi.analysis')
            )
        ).toBeInTheDocument();
    });

    it('renders switch container with label and switch', () => {
        renderComponent();

        expect(screen.getByTestId('switch-container')).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.visualize.switch')
        );
        expect(screen.getByTestId('switch-label')).toBeInTheDocument();
        expect(screen.getByTestId('visualize-switch')).toBeInTheDocument();
    });

    it('displays loss projections tab content by default', () => {
        renderComponent();

        expect(
            screen.getByTestId('loss-projection-tab-data-container')
        ).toBeInTheDocument();
    });

    it('switches to capex tab when clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByTestId('capex-tab'));
        expect(
            screen.getByTestId('capex-tab-data-container')
        ).toBeInTheDocument();
    });

    it('switches to npv analysis tab when clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByTestId('npv-roi-tab'));
        expect(
            screen.getByTestId('npv-roi-tab-data-container')
        ).toBeInTheDocument();
    });

    it('can switch back to loss projections tab', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByTestId('capex-tab'));
        expect(
            screen.getByTestId('capex-tab-data-container')
        ).toBeInTheDocument();

        await user.click(screen.getByTestId('loss-projection-tab'));
        expect(
            screen.getByTestId('loss-projection-tab-data-container')
        ).toBeInTheDocument();
    });

    it('has switch initially turned on', () => {
        renderComponent();

        const switchElement = screen
            .getByTestId('visualize-switch')
            .querySelector('input');
        expect(switchElement).toBeChecked();
    });

    it('toggles switch when clicked', async () => {
        const user = userEvent.setup();
        renderComponent();

        const switchElement = screen
            .getByTestId('visualize-switch')
            .querySelector('input');
        expect(switchElement).toBeChecked();

        await user.click(switchElement!);
        expect(switchElement).not.toBeChecked();

        await user.click(switchElement!);
        expect(switchElement).toBeChecked();
    });

    it('renders info icon in switch label', () => {
        renderComponent();

        const switchLabel = screen.getByTestId('switch-label');
        expect(switchLabel).toBeInTheDocument();
        expect(switchLabel.querySelector('span')).toBeInTheDocument();
        expect(switchLabel.querySelector('span')).toHaveTextContent('i');
    });
});
