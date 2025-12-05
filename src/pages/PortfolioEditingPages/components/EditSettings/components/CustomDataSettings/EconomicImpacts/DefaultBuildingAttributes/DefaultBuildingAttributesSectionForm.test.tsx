import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DefaultBuildingAttributesSectionForm } from './DefaultBuildingAttributesSectionForm';
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
                defaultBuildingAttributes: {
                    occupancyScheme: 'OED',
                    occupancyCode: 0,
                    numberOfStories: 0,
                    basementCode: null,
                    firstFloorElevation: 0,
                    floorAreaSqm: 0,
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
            return (mockTouched ?? {}) as unknown as IPortfolio;
        },
        get errors() {
            return (mockErrors ?? {}) as unknown as IPortfolio;
        },
    })) as unknown as typeof formikCtx.useFormikContextHelpers);
});

describe('DefaultBuildingAttributesSectionForm', () => {
    it('renders fields and labels', () => {
        render(<DefaultBuildingAttributesSectionForm />);
        expect(
            screen.getByText('Default Building Attributes')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Occupancy Scheme')).toBeInTheDocument();
        expect(screen.getByLabelText('Occupancy Code')).toBeInTheDocument();
        expect(screen.getByLabelText('Number of Stories')).toBeInTheDocument();
        expect(screen.getByLabelText('Basement Code')).toBeInTheDocument();
        expect(
            screen.getByLabelText('First Floor Elevation')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Floor Area')).toBeInTheDocument();
    });

    it('marks Occupancy Code invalid when touched with errors', async () => {
        mockTouched = {
            custom: {
                economicImpacts: {
                    defaultBuildingAttributes: { occupancyCode: true },
                },
            },
        } as unknown as IPortfolio;
        mockErrors = {
            custom: {
                economicImpacts: {
                    defaultBuildingAttributes: { occupancyCode: 'Err Code' },
                },
            },
        } as unknown as IPortfolio;
        const { DefaultBuildingAttributesSectionForm } = await import(
            './DefaultBuildingAttributesSectionForm'
        );
        render(<DefaultBuildingAttributesSectionForm />);
        const input = screen.getByLabelText('Occupancy Code');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('disables fields when flagged disabled by options', async () => {
        vi.resetModules();
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: mockValues,
                    setField: setFieldMock,
                    handleBlur: vi.fn(),
                    touched: (mockTouched ?? {}) as unknown as IPortfolio,
                    errors: (mockErrors ?? {}) as unknown as IPortfolio,
                }),
            })
        );
        vi.doMock('../../../../../../../../const', () => ({
            ECONOMIC_IMPACT_DISABLED_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    firstFloorElevation: true,
                    floorAreaSqm: true,
                },
            },
        }));
        const { DefaultBuildingAttributesSectionForm } = await import(
            './DefaultBuildingAttributesSectionForm'
        );
        render(<DefaultBuildingAttributesSectionForm />);
        const elev = screen.getByLabelText('First Floor Elevation');
        const area = screen.getByLabelText('Floor Area');
        expect(elev).toBeDisabled();
        expect(area).toBeDisabled();
    });
});
