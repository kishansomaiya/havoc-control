import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AdaptationTeaser } from './AdaptationTeaser';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';

// Mock analytics to avoid side effects
vi.mock('../../../../../heap-analytics', () => ({
    default: { trackCustomEvent: vi.fn() },
}));

describe('AdaptationTeaser', () => {
    const renderComponent = () =>
        render(
            <TestRoot>
                <AdaptationTeaser />
            </TestRoot>
        );

    it('renders sidebar and tabs', () => {
        renderComponent();
        expect(screen.getByTestId('adaptation-sidebar')).toBeInTheDocument();
        // Tabs presence check (there can be more tab-like roles in the DOM)
        expect(screen.getAllByRole('tab').length).toBeGreaterThanOrEqual(3);
        expect(screen.getByTestId('loss-projection-tab')).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.loss.projection')
        );
        expect(screen.getByTestId('capex-tab')).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.capex.analysis')
        );
        expect(screen.getByTestId('npv-roi-tab')).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.npv_roi.analysis')
        );
    });

    it('switches between tabs and renders corresponding content', async () => {
        renderComponent();
        const user = userEvent.setup();
        const tabs = screen.getAllByRole('tab');

        // Tab 0 default shows loss projections (chart titles through i18n)
        expect(
            screen.getByTestId('loss-projection-tab-data-container')
        ).toBeInTheDocument();

        // Tab 1: Capex
        await user.click(tabs[1]);
        expect(
            screen.getByTestId('capex-tab-data-container')
        ).toBeInTheDocument();

        // Tab 2: NPV/ROI
        await user.click(tabs[2]);
        expect(
            screen.getByTestId('npv-roi-tab-data-container')
        ).toBeInTheDocument();
    });
});
