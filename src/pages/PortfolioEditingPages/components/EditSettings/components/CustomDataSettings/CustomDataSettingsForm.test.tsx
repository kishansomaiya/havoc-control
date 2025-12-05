import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomDataSettingsForm } from './CustomDataSettingsForm';
import { ComponentProps } from 'react';
import { PerilMetricsOptionsForm } from './PerilMetrics/PerilMetricsOptionsForm';
import { EconomicImpactsOptionsForm } from './EconomicImpacts/EconomicImpactsOptionsForm';
import { ScoresOptionsForm } from './Scores/ScoresOptionsForm';
import { FloodMeshOptionsForm } from './FloodMesh/FloodMeshOptionsForm';
import * as PerilMetricsOptionsFormModule from './PerilMetrics/PerilMetricsOptionsForm';
import * as EconomicImpactsOptionsFormModule from './EconomicImpacts/EconomicImpactsOptionsForm';
import * as ScoresOptionsFormModule from './Scores/ScoresOptionsForm';
import * as FloodMeshOptionsFormModule from './FloodMesh/FloodMeshOptionsForm';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        PerilMetricsOptionsFormModule,
        'PerilMetricsOptionsForm'
    ).mockImplementation(
        (
            props: ComponentProps<typeof PerilMetricsOptionsForm> & {
                'data-testid'?: string;
            }
        ) => <div data-testid={props['data-testid'] || 'peril'} />
    );
    vi.spyOn(
        EconomicImpactsOptionsFormModule,
        'EconomicImpactsOptionsForm'
    ).mockImplementation(
        (
            props: ComponentProps<typeof EconomicImpactsOptionsForm> & {
                'data-testid'?: string;
            }
        ) => <div data-testid={props['data-testid'] || 'ei'} />
    );
    vi.spyOn(ScoresOptionsFormModule, 'ScoresOptionsForm').mockImplementation(
        (
            props: ComponentProps<typeof ScoresOptionsForm> & {
                'data-testid'?: string;
            }
        ) => <div data-testid={props['data-testid'] || 'scores'} />
    );
    vi.spyOn(
        FloodMeshOptionsFormModule,
        'FloodMeshOptionsForm'
    ).mockImplementation(
        (
            props: ComponentProps<typeof FloodMeshOptionsForm> & {
                'data-testid'?: string;
            }
        ) => <div data-testid={props['data-testid'] || 'flood'} />
    );
});

describe('CustomDataSettingsForm', () => {
    it('renders all option forms with data-testids', () => {
        render(<CustomDataSettingsForm />);
        expect(
            screen.getByTestId('custom-data-settings-form')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('custom-data-settings-form-peril')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('custom-data-settings-form-economic-impacts')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('custom-data-settings-form-scores')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('custom-data-settings-form-flood-mesh')
        ).toBeInTheDocument();
    });
});
