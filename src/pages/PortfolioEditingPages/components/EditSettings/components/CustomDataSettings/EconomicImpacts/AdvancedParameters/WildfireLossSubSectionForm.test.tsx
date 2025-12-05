import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WildfireLossSubSectionForm } from './WildfireLossSubSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from 'pages/PortfolioEditingPages/types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

let mockValues: IPortfolio;

beforeEach(() => {
    mockValues = {
        name: 'My Portfolio',
        dataVersion: DataVersion.v3_2_0,
        custom: {
            perilMetrics: { perils: [Peril.Fire], years: [], scenarios: [] },
            economicImpacts: {
                advancedParameters: {
                    includeWildfireLoss: true,
                    wildfireLoss: {
                        windowPane: null,
                        ventType: null,
                        roofCover: null,
                    },
                },
            },
        },
    } as unknown as IPortfolio;
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: vi.fn(),
        handleBlur: vi.fn(),
        setFields: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

describe('WildfireLossSubSectionForm', () => {
    it('renders include checkbox and select inputs', () => {
        render(<WildfireLossSubSectionForm />);
        expect(screen.getByText('Include Wildfire Loss')).toBeInTheDocument();
        expect(screen.getByLabelText('Window Pane')).toBeInTheDocument();
        expect(screen.getByLabelText('Vent Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Roof Cover')).toBeInTheDocument();
    });
});
