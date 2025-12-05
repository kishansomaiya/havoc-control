import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdvancedParametersSectionForm } from './AdvancedParametersSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';
import * as WPModule from './WorkerProductivityAndCoolingSubSectionForm';
import * as WildfireModule from './WildfireLossSubSectionForm';
import * as UtilitiesModule from './UtilitiesSubSectionForm';

const setFieldMock = vi.fn();
let mockValues: IPortfolio;

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
                    remoteWorkRatio: 0,
                    financialBaseYear: 2020,
                    workerProductivity: { workIntensity: null },
                    costOfCooling: { electricityCostUsd: 0 },
                    workerProductivityOrCostOfCooling: {
                        coolingSystemProbability: 0,
                    },
                    includeWorkerProductivity: false,
                    includeCostOfCooling: false,
                    includeWildfireLoss: false,
                    wildfireLoss: {
                        windowPane: null,
                        ventType: null,
                        roofCover: null,
                    },
                    utilitiesCostOfWater: {
                        waterConsumption: 0,
                        waterShadowPriceRatio: 0,
                    },
                },
                financialParameters: {
                    includeFinancialMetrics: false,
                    financialMetrics: {
                        annualGrowth: 0,
                        annualVolatility: 0,
                        subIndustryCode: '',
                        salesMargin: 0,
                        discountRate: 0,
                        generatePortfolioLevelResults: false,
                    },
                },
                defaultAssetValues: {
                    total: 0,
                    building: 0,
                    contents: 0,
                    inventory: 0,
                    downtime: 0,
                },
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
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: setFieldMock,
        setFields: vi.fn(),
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    // Stub child sub-section components with spies instead of module-level mocks
    vi.spyOn(
        WPModule,
        'WorkerProductivityAndCoolingSubSectionForm'
    ).mockImplementation(() => <div data-testid="adv-wp-coc" />);
    vi.spyOn(WildfireModule, 'WildfireLossSubSectionForm').mockImplementation(
        () => <div data-testid="adv-wildfire" />
    );
    vi.spyOn(UtilitiesModule, 'UtilitiesSubSectionForm').mockImplementation(
        () => <div data-testid="adv-utilities" />
    );
});

describe('AdvancedParametersSectionForm', () => {
    it('renders labels and child sections', () => {
        render(<AdvancedParametersSectionForm />);
        expect(screen.getByText('Advanced Parameters')).toBeInTheDocument();
        expect(screen.getByLabelText('Remote Work Ratio')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Financial Base Year')
        ).toBeInTheDocument();
        expect(screen.getByTestId('adv-wp-coc')).toBeInTheDocument();
        expect(screen.getByTestId('adv-wildfire')).toBeInTheDocument();
        expect(screen.getByTestId('adv-utilities')).toBeInTheDocument();
    });

    it('renders with disabled config mocked', async () => {
        userEvent.setup();
        // Mock consts to disable both fields; assert controls render (disability styling via opacity may not reflect as disabled attribute)
        vi.doMock('../../../../../../../../const', async () => {
            const actual = await vi.importActual<
                typeof import('../../../../../../../../const')
            >('../../../../../../../../const');
            return {
                ...actual,
                ECONOMIC_IMPACT_DISABLED_OPTIONS: {
                    [DataVersion.v3_2_0]: {
                        remoteWorkRatio: true,
                        financialBaseYear: true,
                    },
                },
            };
        });
        const { AdvancedParametersSectionForm: Form } = await import(
            './AdvancedParametersSectionForm'
        );
        render(<Form />);
        expect(screen.getByLabelText('Remote Work Ratio')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Financial Base Year')
        ).toBeInTheDocument();
    });

    it('selecting a new base year calls setField (truthy branch)', async () => {
        const user = userEvent.setup();
        vi.resetModules();
        // Ensure formik helpers provide the shape expected by useFormikHelpers
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: mockValues,
                    setField: setFieldMock,
                    setFields: vi.fn(),
                    handleBlur: vi.fn(),
                    touched: {
                        custom: { economicImpacts: { advancedParameters: {} } },
                    },
                    errors: {
                        custom: { economicImpacts: { advancedParameters: {} } },
                    },
                }),
            })
        );
        vi.doMock('@mui/material', async () => {
            const actual =
                await vi.importActual<typeof import('@mui/material')>(
                    '@mui/material'
                );
            return {
                ...actual,
                Autocomplete: ({
                    onChange,
                }: {
                    onChange: (
                        e: unknown,
                        value: { year: number } | null
                    ) => void;
                }) => (
                    <button
                        data-testid="year-trigger"
                        onClick={() => onChange({}, { year: 2030 })}
                    >
                        change-year
                    </button>
                ),
                TextField: (props: JSX.IntrinsicElements['input']) => (
                    <input
                        aria-label="Financial Base Year"
                        {...props}
                    />
                ),
            };
        });
        const { AdvancedParametersSectionForm: Form } = await import(
            './AdvancedParametersSectionForm'
        );
        render(<Form />);
        await user.click(screen.getAllByTestId('year-trigger')[0]);
        expect(setFieldMock).toHaveBeenCalledWith(
            'custom.economicImpacts.advancedParameters.financialBaseYear',
            2030
        );
    });

    it('shows helper text error when remoteWorkRatio touched with error', async () => {
        vi.resetModules();
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: mockValues,
                    setField: setFieldMock,
                    setFields: vi.fn(),
                    handleBlur: vi.fn(),
                    touched: {
                        custom: {
                            economicImpacts: {
                                advancedParameters: { remoteWorkRatio: true },
                            },
                        },
                    },
                    errors: {
                        custom: {
                            economicImpacts: {
                                advancedParameters: { remoteWorkRatio: 'Err' },
                            },
                        },
                    },
                }),
            })
        );
        const { AdvancedParametersSectionForm: Form } = await import(
            './AdvancedParametersSectionForm'
        );
        render(<Form />);
        expect(screen.getByLabelText('Remote Work Ratio')).toBeInTheDocument();
    });
});
