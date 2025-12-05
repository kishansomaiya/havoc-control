import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UtilitiesSubSectionForm } from './UtilitiesSubSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';
import userEvent from '@testing-library/user-event';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

let mockValues: IPortfolio;
const setFieldMock = vi.fn();

beforeEach(() => {
    mockValues = {
        dataVersion: DataVersion.v3_2_0,
        custom: {
            perilMetrics: { perils: [Peril.Heat], years: [], scenarios: [] },
            economicImpacts: {
                advancedParameters: {
                    includeUtilitiesCostOfWater: true,
                    utilitiesCostOfWater: {
                        waterConsumption: 0,
                        waterShadowPriceRatio: 0,
                    },
                },
            },
        },
    } as unknown as IPortfolio;
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: setFieldMock,
        handleBlur: vi.fn(),
        setFields: vi.fn(),
        touched: {} as IPortfolio,
        errors: {} as IPortfolio,
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

describe('UtilitiesSubSectionForm', () => {
    it('renders include checkbox and water fields', () => {
        render(<UtilitiesSubSectionForm />);
        expect(screen.getByText('Include Cost of Water')).toBeInTheDocument();
        expect(screen.getByLabelText('Water Consumption')).toBeInTheDocument();
        expect(screen.getByLabelText('Shadow Price Ratio')).toBeInTheDocument();
    });

    it('disables water fields when include is false', () => {
        mockValues.custom.economicImpacts.advancedParameters.includeUtilitiesCostOfWater =
            false;
        render(<UtilitiesSubSectionForm />);
        const wc = screen.getByLabelText(
            'Water Consumption'
        ) as HTMLInputElement;
        const sp = screen.getByLabelText(
            'Shadow Price Ratio'
        ) as HTMLInputElement;
        expect(wc).toBeDisabled();
        expect(sp).toBeDisabled();
    });

    it('shows error helper text when touched with errors', async () => {
        // remock with errors
        vi.resetModules();
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: mockValues,
                    setField: setFieldMock,
                    handleBlur: vi.fn(),
                    setFields: vi.fn(),
                    touched: {
                        custom: {
                            economicImpacts: {
                                advancedParameters: {
                                    utilitiesCostOfWater: {
                                        waterConsumption: true,
                                        waterShadowPriceRatio: true,
                                    },
                                },
                            },
                        },
                    } as unknown as IPortfolio,
                    errors: {
                        custom: {
                            economicImpacts: {
                                advancedParameters: {
                                    utilitiesCostOfWater: {
                                        waterConsumption: 'Err',
                                        waterShadowPriceRatio: 'Err',
                                    },
                                },
                            },
                        },
                    } as unknown as IPortfolio,
                }),
            })
        );
        const { UtilitiesSubSectionForm } = await import(
            './UtilitiesSubSectionForm'
        );
        render(<UtilitiesSubSectionForm />);
        expect(screen.getAllByText('Err').length).toBeGreaterThanOrEqual(1);
    });

    it('disables include checkbox when additional option is disabled', async () => {
        vi.resetModules();
        vi.doMock('../../../../../../../../const', () => ({
            DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    includeUtilitiesCostOfWater: { disabled: true },
                },
            },
            ECONOMIC_IMPACT_DISABLED_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    waterConsumption: false,
                    waterShadowPriceRatio: false,
                },
            },
        }));
        const { UtilitiesSubSectionForm } = await import(
            './UtilitiesSubSectionForm'
        );
        render(<UtilitiesSubSectionForm />);
        const include = screen.getByRole('checkbox', {
            name: 'Include Cost of Water',
        });
        expect(include).toBeDisabled();
    });

    it('disables fields when disabled flags are true in options', async () => {
        vi.resetModules();
        vi.doMock('../../../../../../../../const', () => ({
            DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    includeUtilitiesCostOfWater: { disabled: false },
                },
            },
            ECONOMIC_IMPACT_DISABLED_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    waterConsumption: true,
                    waterShadowPriceRatio: true,
                },
            },
        }));
        const { UtilitiesSubSectionForm } = await import(
            './UtilitiesSubSectionForm'
        );
        render(<UtilitiesSubSectionForm />);
        expect(screen.getByLabelText('Water Consumption')).toBeDisabled();
        expect(screen.getByLabelText('Shadow Price Ratio')).toBeDisabled();
    });

    it('calls setField when toggling include checkbox', async () => {
        const user = userEvent.setup();
        render(<UtilitiesSubSectionForm />);
        const include = screen.getByRole('checkbox', {
            name: 'Include Cost of Water',
        });
        await user.click(include);
        expect(setFieldMock).toHaveBeenCalledWith(
            'custom.economicImpacts.advancedParameters.includeUtilitiesCostOfWater',
            false
        );
    });
});
