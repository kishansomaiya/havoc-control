import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkerProductivityAndCoolingSubSectionForm } from './WorkerProductivityAndCoolingSubSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

let mockValues: IPortfolio;
let mockTouched: Partial<IPortfolio> | undefined;
let mockErrors: Partial<IPortfolio> | undefined;

beforeEach(() => {
    mockValues = {
        dataVersion: DataVersion.v3_2_0,
        custom: {
            perilMetrics: {
                perils: [Peril.Heat],
                years: [2020],
                scenarios: ['ssp245'],
            },
            economicImpacts: {
                advancedParameters: {
                    includeWorkerProductivity: true,
                    includeCostOfCooling: true,
                    workerProductivity: { workIntensity: null },
                    costOfCooling: { electricityCostUsd: 0 },
                    workerProductivityOrCostOfCooling: {
                        coolingSystemProbability: 0,
                    },
                },
            },
        },
    } as unknown as IPortfolio;
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation(() => {
        return {
            values: mockValues,
            setField: vi.fn(),
            handleBlur: vi.fn(),
            setFields: vi.fn(),
            touched: (mockTouched ?? {}) as IPortfolio,
            errors: (mockErrors ?? {}) as IPortfolio,
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>;
    });
});

describe('WorkerProductivityAndCoolingSubSectionForm', () => {
    it('renders both include checkboxes and inputs', () => {
        render(<WorkerProductivityAndCoolingSubSectionForm />);
        expect(screen.getByText('Include Cost of Cooling')).toBeInTheDocument();
        expect(
            screen.getByText('Include Worker Productivity')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Electricity Cost')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Cooling System Probability')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Work Intensity')).toBeInTheDocument();
    });

    it('disables WP and CoC when Heat not selected', () => {
        mockValues.custom.perilMetrics.perils = [] as unknown as Peril[];
        render(<WorkerProductivityAndCoolingSubSectionForm />);
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).toBeDisabled();
        expect(checkboxes[1]).toBeDisabled();
    });

    it('disables Worker Productivity when SSP245+2020 missing', () => {
        mockValues.custom.perilMetrics.years = [];
        render(<WorkerProductivityAndCoolingSubSectionForm />);
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[1]).toBeDisabled();
    });

    it('marks cooling probability invalid when error present', () => {
        mockTouched = {
            custom: {
                economicImpacts: {
                    advancedParameters: {
                        workerProductivityOrCostOfCooling: {
                            coolingSystemProbability: true,
                        },
                    },
                },
            },
        } as unknown as IPortfolio;
        mockErrors = {
            custom: {
                economicImpacts: {
                    advancedParameters: {
                        workerProductivityOrCostOfCooling: {
                            coolingSystemProbability: 'Err prob',
                        },
                    },
                },
            },
        } as unknown as IPortfolio;
        render(<WorkerProductivityAndCoolingSubSectionForm />);
        const input = screen.getByLabelText('Cooling System Probability');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });
});
