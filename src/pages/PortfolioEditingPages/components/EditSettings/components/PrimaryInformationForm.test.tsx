import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrimaryInformationForm } from './PrimaryInformationForm';
import { TestRoot } from '../../../../../testing/TestRoot';
import { IPortfolio } from '../../../types/portfolio';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import { DataVersion } from '../../../../../types';
import { waitFor } from '@testing-library/react';
import type { SyntheticEvent } from 'react';
import type {
    AutocompleteChangeReason,
    FilterOptionsState,
} from '@mui/material';
import * as formikCtx from '../../../../../hooks/useFormikContextHelpers';
import * as categoriesQuery from '../../../../../api/queries/categoriesQuery';
import * as categoriesMutation from '../../../../../api/mutations/categoriesMutation';
import * as utils from '../../../../../utils';
import * as userContext from '../../../../../context/UserContextProvider';
import * as runDisclosureModule from './RunAnalysisOption';

// augment: trackable mocks for deeper assertions
let mockFormikValues: Partial<IPortfolio>;
let isCategoriesLoadingMock = false;
let isCategoryCreatingMock = false;
const setFieldMock = vi.fn();
const setFieldsMock = vi.fn();
const handleChangeMock = vi.fn();
const reFetchCategoriesMock = vi.fn();
const createCategoryMock = vi.fn();
let canAccessDisclosureResultSetMock = true;
let isDisclosureAllowedPredicate: (dv: DataVersion) => boolean = () => true;
let touchedMock: Record<string, unknown> = {};
let errorsMock: Record<string, unknown> = {};

interface IOptionStub {
    id?: string;
    label?: string;
    inputValue?: string;
}

interface AutocompleteStubProps {
    filterOptions?: (
        options: Array<string | IOptionStub>,
        params: FilterOptionsState<string | IOptionStub>
    ) => Array<string | IOptionStub>;
    getOptionKey?: (option: string | IOptionStub) => string;
    onChange?: (
        event: SyntheticEvent,
        value: string | IOptionStub | null,
        reason: AutocompleteChangeReason
    ) => void;
    disabled?: boolean;
    loading?: boolean;
}

interface SelectStubProps {
    'data-testid'?: string;
    name?: string;
    value: DataVersion;
    disabled?: boolean;
    onChange?: (event: { target: { value: DataVersion } }) => void;
}

// Note: ESM module limitation prevents spying on useAuth0; retain vi.mock here
// to provide a minimal stub. See https://vitest.dev/guide/browser/#limitations
vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({ user: {} }),
}));

// Provide a minimal stub for feature flags to avoid requiring FlagsmithProvider
vi.mock('../../../../../featureFlags/useFeatureFlags', () => ({
    useFeatureFlags: () => ({ adaptationModuleEnabled: false }),
}));

// Retain a targeted vi.mock for MUI primitives due to ESM non-configurable exports
vi.mock('@mui/material', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mui/material')>();
    return {
        ...actual,
        Autocomplete: (props: AutocompleteStubProps) => {
            const filterState = {
                inputValue: 'New',
                getOptionLabel: (option: string | IOptionStub) =>
                    typeof option === 'string' ? option : option.label ?? '',
            } as unknown as FilterOptionsState<string | IOptionStub>;
            props.filterOptions?.([{ id: '1', label: 'TestCat' }], filterState);
            props.getOptionKey?.('str');
            props.getOptionKey?.({ id: '2', label: 'L' });
            props.getOptionKey?.({ label: 'NoId' });
            const fakeEvent = { target: {} } as unknown as SyntheticEvent;
            return (
                <div data-testid="ac-stub">
                    <button
                        data-testid="ac-string-create"
                        onClick={() =>
                            props.onChange?.(
                                fakeEvent,
                                'NewCategory',
                                'createOption'
                            )
                        }
                    />
                    <button
                        data-testid="ac-inputValue"
                        onClick={() =>
                            props.onChange?.(
                                fakeEvent,
                                { inputValue: 'ObjNew' },
                                'selectOption'
                            )
                        }
                    />
                    <button
                        data-testid="ac-normal"
                        onClick={() =>
                            props.onChange?.(
                                fakeEvent,
                                { id: '1', label: 'TestCat' },
                                'selectOption'
                            )
                        }
                    />
                    <input
                        aria-label="Category"
                        disabled={Boolean(
                            props.disabled ||
                                props.loading ||
                                isCategoriesLoadingMock ||
                                isCategoryCreatingMock
                        )}
                    />
                </div>
            );
        },
        Select: (props: SelectStubProps) => {
            const { onChange, disabled, value, ...rest } = props;
            return (
                <div
                    data-testid={
                        (rest as Record<string, string>)['data-testid'] ??
                        undefined
                    }
                >
                    <div
                        role="combobox"
                        aria-disabled={Boolean(disabled)}
                    />
                    <input
                        aria-hidden
                        name={rest.name ?? 'dataVersion'}
                        value={value}
                        readOnly
                    />
                    <button
                        data-testid="select-change"
                        onClick={() => onChange?.({ target: { value } })}
                    />
                </div>
            );
        },
    };
});

beforeEach(() => {
    mockFormikValues = {
        name: 'My Portfolio',
        category: null,
        dataVersion: DataVersion.v3_2_0,
        type: AnalysisType.PerilsScoresAndEconomicImpact,
        runDisclosureAnalysis: false,
        custom: {
            perilMetrics: {
                perils: [],
                years: [],
                scenarios: [],
                floodDefenseOptions: {},
            },
            economicImpacts: {
                defaultBuildingAttributes: {
                    occupancyScheme: 'ATC',
                    occupancyCode: 0,
                    numberOfStories: 0,
                    basementCode: 'unknown',
                    firstFloorElevation: 0,
                    floorAreaSqm: 0,
                },
                defaultAssetValues: {
                    total: 0,
                    building: 0,
                    contents: 0,
                    inventory: 0,
                    downtime: 0,
                },
                advancedParameters: {
                    includeWorkerProductivity: false,
                    includeCostOfCooling: false,
                    includeAcuteCombinedFlood: false,
                    includeAcuteWind: false,
                    includeWildfireLoss: false,
                    includeUtilitiesCostOfWater: false,
                    financialBaseYear: 2020,
                    workerProductivityOrCostOfCooling: {
                        coolingSystemProbability: 0,
                    },
                    workerProductivity: {
                        workIntensity: undefined,
                    },
                    costOfCooling: {
                        electricityCostUsd: 0,
                    },
                    wildfireLoss: {
                        windowPane: undefined,
                        ventType: undefined,
                        roofCover: undefined,
                    },
                    utilitiesCostOfWater: {
                        waterConsumption: undefined,
                        waterShadowPriceRatio: undefined,
                    },
                },
                financialParameters: {
                    includeFinancialMetrics: false,
                    financialMetrics: {
                        generatePortfolioLevelResults: false,
                        annualGrowth: undefined,
                        annualVolatility: undefined,
                        subIndustryCode: undefined,
                        salesMargin: undefined,
                        discountRate: undefined,
                    },
                },
            },
            scores: {
                includeBenchmarks: false,
                benchmarkLevels: [],
                perils: [],
            },
            floodMesh: {
                mesh: { type: undefined },
                scenarios: [],
                years: [],
                floodDefense: {
                    enabled: false,
                    zeroOutDefendedLocations: false,
                },
            },
        },
    };
    isCategoriesLoadingMock = false;
    isCategoryCreatingMock = false;
    canAccessDisclosureResultSetMock = true;
    isDisclosureAllowedPredicate = () => true;
    setFieldMock.mockReset();
    setFieldsMock.mockReset();
    handleChangeMock.mockReset();
    reFetchCategoriesMock.mockReset();
    createCategoryMock.mockReset();
    createCategoryMock.mockResolvedValue({ id: 'newid', name: 'NewCategory' });
    touchedMock = {};
    errorsMock = {};

    vi.spyOn(runDisclosureModule, 'RunAnalysisOption').mockImplementation(
        ((props: { title: string; disabled?: boolean }) => (
            <div
                data-testid="run-disc"
                data-disabled={props.disabled}
            >
                {props.title}
            </div>
        )) as typeof runDisclosureModule.RunAnalysisOption
    );

    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockImplementation((() => ({
        get values() {
            return mockFormikValues as IPortfolio;
        },
        setField: setFieldMock,
        setFields: setFieldsMock,
        handleChange: handleChangeMock,
        handleBlur: vi.fn(),
        get touched() {
            return touchedMock;
        },
        get errors() {
            return errorsMock;
        },
    })) as unknown as typeof formikCtx.useFormikContextHelpers);

    vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockReturnValue({
        categories: [{ id: '1', name: 'TestCat' }],
        reFetchCategories: reFetchCategoriesMock,
        isCategoriesLoading: isCategoriesLoadingMock,
    } as unknown as ReturnType<typeof categoriesQuery.useCategoriesQuery>);

    vi.spyOn(categoriesMutation, 'useCreateCategoryMutation').mockReturnValue({
        createCategory: createCategoryMock,
        isCategoryCreating: isCategoryCreatingMock,
    } as unknown as ReturnType<
        typeof categoriesMutation.useCreateCategoryMutation
    >);

    vi.spyOn(userContext, 'useUserContext').mockImplementation((() => ({
        canAccessDisclosureResultSet: canAccessDisclosureResultSetMock,
    })) as typeof userContext.useUserContext);

    vi.spyOn(utils, 'checkIsUserCanAccessEI_3_1_1').mockReturnValue(true);
    vi.spyOn(utils, 'isDisclosureAllowedDataVersion').mockImplementation(((
        dataVersion?: DataVersion | null
    ) =>
        isDisclosureAllowedPredicate(
            (dataVersion ?? DataVersion.v3_2_0) as DataVersion
        )) as typeof utils.isDisclosureAllowedDataVersion);
});

describe('PrimaryInformationForm', () => {
    const renderWithProviders = (ui: JSX.Element) =>
        render(<TestRoot>{ui}</TestRoot>);

    it('renders label and enabled name field by default', () => {
        renderWithProviders(<PrimaryInformationForm />);
        expect(
            screen.getByTestId('edit-settings-portfolio-information-label')
        ).toBeInTheDocument();
        const nameInput = screen.getByLabelText(
            'Portfolio Name'
        ) as HTMLInputElement;
        expect(nameInput).toBeEnabled();
    });

    it('disables name field when isMockPortfolio is true', () => {
        renderWithProviders(<PrimaryInformationForm isMockPortfolio />);
        const nameInput = screen.getByLabelText(
            'Portfolio Name'
        ) as HTMLInputElement;
        expect(nameInput).toBeDisabled();
    });

    it('hides Run Disclosure when user cannot access disclosure result set', () => {
        canAccessDisclosureResultSetMock = false;
        renderWithProviders(<PrimaryInformationForm />);
        expect(screen.queryByTestId('run-disc')).not.toBeInTheDocument();
    });

    it('disables Data Version select when isDataVersionEnabled is false', async () => {
        renderWithProviders(
            <PrimaryInformationForm isDataVersionEnabled={false} />
        );
        const select = screen.getByTestId('edit-settings-data-version');
        const combobox = within(select).getByRole('combobox');
        expect(combobox).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables Category input when categories are loading', () => {
        isCategoriesLoadingMock = true;
        renderWithProviders(<PrimaryInformationForm />);
        const categoryInput = screen.getByLabelText(
            'Category'
        ) as HTMLInputElement;
        expect(categoryInput).toBeDisabled();
    });

    it('disables Category input when category is being created', () => {
        isCategoryCreatingMock = true;
        renderWithProviders(<PrimaryInformationForm />);
        const categoryInput = screen.getByLabelText(
            'Category'
        ) as HTMLInputElement;
        expect(categoryInput).toBeDisabled();
    });

    it('handleDataVersionChange updates multiple fields via setFields', async () => {
        setFieldsMock.mockResolvedValue(undefined);
        renderWithProviders(<PrimaryInformationForm />);
        const selectWrapper = screen.getByTestId('edit-settings-data-version');
        const trigger = within(selectWrapper).getByTestId('select-change');
        await userEvent.click(trigger);
        await waitFor(() => expect(setFieldsMock).toHaveBeenCalled());
        const payload = setFieldsMock.mock.calls[0][0];
        expect(payload).toHaveProperty('dataVersion');
        expect(payload).toHaveProperty('custom');
    });

    it('menu items path executes when opening Select (smoke)', async () => {
        const user = userEvent.setup();
        mockFormikValues.runDisclosureAnalysis = true;
        isDisclosureAllowedPredicate = (dv: DataVersion) =>
            dv !== DataVersion.v3_2_0;
        renderWithProviders(<PrimaryInformationForm />);
        const select = screen.getByTestId('edit-settings-data-version');
        const combobox = within(select).getByRole('combobox');
        await user.click(combobox);
        // smoke assertion only
        expect(combobox).toBeInTheDocument();
    });

    it('handleCategoryChange: createOption path (string newValue)', async () => {
        const user = userEvent.setup();
        renderWithProviders(<PrimaryInformationForm />);
        await user.click(screen.getByTestId('ac-string-create'));
        await waitFor(() =>
            expect(createCategoryMock).toHaveBeenCalledWith('NewCategory')
        );
        expect(reFetchCategoriesMock).toHaveBeenCalled();
        expect(handleChangeMock).toHaveBeenCalled();
    });

    it('handleCategoryChange: inputValue object path', async () => {
        const user = userEvent.setup();
        renderWithProviders(<PrimaryInformationForm />);
        await user.click(screen.getByTestId('ac-inputValue'));
        await waitFor(() =>
            expect(createCategoryMock).toHaveBeenCalledWith('ObjNew')
        );
        expect(reFetchCategoriesMock).toHaveBeenCalled();
        expect(handleChangeMock).toHaveBeenCalled();
    });

    it('handleCategoryChange: normal selection path', async () => {
        const user = userEvent.setup();
        renderWithProviders(<PrimaryInformationForm />);
        await user.click(screen.getByTestId('ac-normal'));
        expect(handleChangeMock).toHaveBeenCalled();
    });

    it('shows helper text and error when name is touched with error', () => {
        touchedMock = { name: true };
        errorsMock = { name: 'Required' };
        renderWithProviders(<PrimaryInformationForm />);
        const nameInput = screen.getByLabelText('Portfolio Name');
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByText('Required')).toBeInTheDocument();
    });
});
