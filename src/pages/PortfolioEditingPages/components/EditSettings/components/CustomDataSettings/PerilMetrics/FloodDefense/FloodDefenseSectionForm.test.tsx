import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FloodDefenseSectionForm } from './FloodDefenseSectionForm';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: {
            dataVersion: '3.2.0',
            custom: {
                perilMetrics: {
                    floodDefenseOptions: {
                        enabled: true,
                        zeroOutDefendedLocations: false,
                    },
                },
            },
        },
        setFields: vi.fn(),
        handleChange: vi.fn(),
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

vi.mock('../../../../../../../../const', async (importOriginal) => {
    const actual =
        await importOriginal<typeof import('../../../../../../../../const')>();
    return {
        ...actual,
        PERIL_FLOOD_DEFENSE_DISABLED_OPTIONS: {
            '3.2.0': { zeroOutDefendedLocations: false },
        },
    };
});

describe('PerilMetrics FloodDefenseSectionForm', () => {
    it('renders and toggles enabled checkbox', async () => {
        const user = userEvent.setup();
        render(<FloodDefenseSectionForm />);
        const label = screen.getByText('Enable Flood Defenses');
        expect(label).toBeInTheDocument();
        await user.click(label);
    });
});
