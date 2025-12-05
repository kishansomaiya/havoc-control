import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LossProjectionsTab, LossProjectionProps } from './Lossprojection';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';

describe('LossProjectionsTab', () => {
    const mockProps: LossProjectionProps = {
        years: [2025, 2030, 2035, 2040, 2045, 2050, 2055],
        adaptedLosses: {
            all: [100, 120, 140, 160, 180, 200, 220],
            flooding: [50, 60, 70, 80, 90, 100, 110],
            wind: [30, 35, 40, 45, 50, 55, 60],
            fire: [10, 12, 14, 16, 18, 20, 22],
            heat: [10, 13, 16, 19, 22, 25, 28],
        },
        unadaptedLosses: {
            all: [150, 180, 210, 240, 270, 300, 330],
            flooding: [75, 90, 105, 120, 135, 150, 165],
            wind: [45, 54, 63, 72, 81, 90, 99],
            fire: [15, 18, 21, 24, 27, 30, 33],
            heat: [15, 18, 21, 24, 27, 30, 33],
        },
    };

    const renderComponent = (props = mockProps) =>
        render(
            <TestRoot>
                <LossProjectionsTab {...props} />
            </TestRoot>
        );

    it('renders the main data container', () => {
        renderComponent();
        expect(
            screen.getByTestId('loss-projection-tab-data-container')
        ).toBeInTheDocument();
    });

    it('renders all KPI blocks with correct labels and values', () => {
        renderComponent();

        const adaptedAALLabel = formatMessageTesting(
            'adaptation.tabs.loss_projection.adaptedAAL'
        );
        const unadaptedAALLabel = formatMessageTesting(
            'adaptation.tabs.loss_projection.unadaptedAAL'
        );
        const avoidedAALLabel = formatMessageTesting(
            'adaptation.tabs.loss_projection.avoidedAAL'
        );

        // Adapted AAL
        expect(
            screen.getByTestId('loss-projection-label-adapted-aal')
        ).toHaveTextContent(adaptedAALLabel);
        expect(
            screen.getByTestId('loss-projection-value-2025-adapted-aal')
        ).toHaveTextContent('2025 $100.00');
        expect(
            screen.getByTestId('loss-projection-value-2055-adapted-aal')
        ).toHaveTextContent('2055 $220.00');

        // Unadapted AAL
        expect(
            screen.getByTestId('loss-projection-label-unadapted-aal')
        ).toHaveTextContent(unadaptedAALLabel);
        expect(
            screen.getByTestId('loss-projection-value-2025-unadapted-aal')
        ).toHaveTextContent('2025 $150.00');
        expect(
            screen.getByTestId('loss-projection-value-2055-unadapted-aal')
        ).toHaveTextContent('2055 $330.00');

        // Avoided AAL
        expect(
            screen.getByTestId('loss-projection-label-avoided-aal')
        ).toHaveTextContent(avoidedAALLabel);
        expect(
            screen.getByTestId('loss-projection-value-2025-avoided-aal')
        ).toHaveTextContent('2025 $50.00');
        expect(
            screen.getByTestId('loss-projection-value-2055-avoided-aal')
        ).toHaveTextContent('2055 $110.00');
    });

    it('renders charts containers', () => {
        renderComponent();
        expect(screen.getByTestId('aal-line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('aal-bar-chart')).toBeInTheDocument();
    });
});
