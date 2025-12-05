import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DefaultAssetValuesSectionForm } from './DefaultAssetValuesSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

const setFieldMock = vi.fn();
let mockValues: IPortfolio;
let mockTouched: Partial<IPortfolio> | undefined;
let mockErrors: Partial<IPortfolio> | undefined;

beforeEach(() => {
    mockValues = {
        dataVersion: DataVersion.v3_2_0,
        custom: {
            perilMetrics: { perils: [Peril.Heat], years: [], scenarios: [] },
            economicImpacts: {
                defaultAssetValues: {
                    total: 0,
                    building: 0,
                    contents: 0,
                    inventory: 0,
                    downtime: 0,
                },
            },
        },
    } as unknown as IPortfolio;
    setFieldMock.mockReset();
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation((() => ({
        get values() {
            return mockValues;
        },
        setField: setFieldMock,
        handleBlur: vi.fn(),
        get touched() {
            return (mockTouched ?? {}) as IPortfolio;
        },
        get errors() {
            return (mockErrors ?? {}) as IPortfolio;
        },
    })) as unknown as typeof formikCtx.useFormikContextHelpers);
});

describe('DefaultAssetValuesSectionForm', () => {
    it('renders all price fields', () => {
        render(<DefaultAssetValuesSectionForm />);
        expect(screen.getByText('Default Asset Values')).toBeInTheDocument();
        expect(screen.getByLabelText('Total Value')).toBeInTheDocument();
        expect(screen.getByLabelText('Building Value')).toBeInTheDocument();
        expect(screen.getByLabelText('Contents Value')).toBeInTheDocument();
        expect(screen.getByLabelText('Inventory Value')).toBeInTheDocument();
        expect(screen.getByLabelText('Downtime Value')).toBeInTheDocument();
    });

    it('marks Total Value invalid when touched with error', async () => {
        mockTouched = {
            custom: {
                economicImpacts: { defaultAssetValues: { total: true } },
            },
        } as unknown as IPortfolio;
        mockErrors = {
            custom: {
                economicImpacts: { defaultAssetValues: { total: 'Err total' } },
            },
        } as unknown as IPortfolio;
        const { DefaultAssetValuesSectionForm: Comp } = await import(
            './DefaultAssetValuesSectionForm'
        );
        render(<Comp />);
        const input = screen.getByLabelText('Total Value');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('marks Inventory Value invalid when touched with error', async () => {
        mockTouched = {
            custom: {
                economicImpacts: { defaultAssetValues: { inventory: true } },
            },
        } as unknown as IPortfolio;
        mockErrors = {
            custom: {
                economicImpacts: {
                    defaultAssetValues: { inventory: 'Err inventory' },
                },
            },
        } as unknown as IPortfolio;
        const { DefaultAssetValuesSectionForm: Comp } = await import(
            './DefaultAssetValuesSectionForm'
        );
        render(<Comp />);
        const input = screen.getByLabelText('Inventory Value');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('disables Downtime Value when flagged disabled by options', async () => {
        vi.resetModules();
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: mockValues,
                    setField: setFieldMock,
                    handleBlur: vi.fn(),
                    touched: (mockTouched ?? {}) as IPortfolio,
                    errors: (mockErrors ?? {}) as IPortfolio,
                }),
            })
        );
        vi.doMock('../../../../../../../../const', () => ({
            ECONOMIC_IMPACT_DISABLED_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    downtimeValue: true,
                },
            },
        }));
        const { DefaultAssetValuesSectionForm: Comp } = await import(
            './DefaultAssetValuesSectionForm'
        );
        render(<Comp />);
        const input = screen.getByLabelText('Downtime Value');
        // TextField adds disabled to input directly
        expect(input).toBeDisabled();
    });
});
