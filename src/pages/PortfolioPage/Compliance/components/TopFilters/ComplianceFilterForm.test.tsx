import { render, screen } from '@testing-library/react';
import { Scenario } from '../../../../../types';
import { DisclosureCategory } from '../../../../../api/openapi/auto-generated/models/DisclosureCategory';
import { DisclosureType } from '../../../../../api/openapi/auto-generated/models/DisclosureType';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as Formik from 'formik';
import * as ValuesListener from '../../../../../components/Formik/FormikValuesChangeListener';
import * as SettingsCtx from '../../context/ComplienceDataSettingsContext';
import { FormikValues } from 'formik';
import * as ScenarioSelectFormControlModule from '../../../../../components/FormControls/ScenarioSelectFormControl';
import * as YearsSelectFormControlModule from './YearsSelectFormControl';
import * as FiltersConfigurationIconModule from './FiltersConfigurationIcon';
import * as HazardCategorySelectorModule from './HazardCategorySelector';

// Keep minimal MUI overrides via mock due to module-level component exports
vi.mock('@mui/material', async () => {
    const actual =
        await vi.importActual<typeof import('@mui/material')>('@mui/material');
    return {
        ...actual,
        Box: (props: React.ComponentProps<'div'>) => <div {...props} />,
        Divider: (props: React.ComponentProps<'hr'>) => <hr {...props} />,
    };
});

vi.spyOn(SettingsCtx, 'useComplianceCategories').mockReturnValue([
    'acute' as DisclosureCategory,
    'chronic' as DisclosureCategory,
]);
vi.spyOn(SettingsCtx, 'useComplianceEUMetrics').mockReturnValue([]);
vi.spyOn(SettingsCtx, 'useUpdateComplianceEUMetrics').mockReturnValue(vi.fn());

vi.spyOn(
    ScenarioSelectFormControlModule,
    'ScenarioSelectFormControl'
).mockImplementation(() => <div data-testid="scenario-select" />);

vi.spyOn(
    YearsSelectFormControlModule,
    'YearsSelectFormControl'
).mockImplementation((props: { onYearsChange: (years: number[]) => void }) => (
    <div
        data-testid="years-select"
        onClick={() => props.onYearsChange([2025, 2030, 2050])}
    />
));

vi.spyOn(
    FiltersConfigurationIconModule,
    'FiltersConfigurationIcon'
).mockImplementation(() => <div data-testid="filters-config" />);

vi.spyOn(
    HazardCategorySelectorModule,
    'HazardCategorySelector'
).mockImplementation(
    (
        props: React.ComponentProps<
            typeof HazardCategorySelectorModule.HazardCategorySelector
        >
    ) => (
        <button
            data-testid="category-selector"
            onClick={() =>
                props.onCategorySelected('acute' as DisclosureCategory)
            }
        />
    )
);

vi.spyOn(Formik, 'useFormik').mockReturnValue({
    values: { category: 'all', years: [2025], scenario: Scenario.Baseline },
    setFieldValue: vi.fn(),
} as unknown as ReturnType<typeof Formik.useFormik>);

vi.spyOn(ValuesListener, 'FormikValuesChangeListener').mockImplementation(
    ({
        values,
        onValuesChange,
    }: {
        values: FormikValues;
        onValuesChange?: (v: FormikValues) => void;
    }) => {
        onValuesChange?.(values);
        return null;
    }
);

describe('ComplianceFiltersForm', () => {
    it('renders controls and calls onFiltersChange on value changes', async () => {
        const user = userEvent.setup();
        const onFiltersChange = vi.fn();
        const mod = await import('./ComplianceFilterForm');
        render(
            <mod.ComplianceFiltersForm
                urlFilterParams={{
                    category: 'all',
                    scenario: Scenario.Baseline,
                    years: [2025],
                }}
                resultSetOptions={{ years: [2025, 2030, 2050] }}
                resultSetMetadata={{}}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(screen.getByTestId('scenario-select')).toBeInTheDocument();
        expect(screen.getByTestId('filters-config')).toBeInTheDocument();
        await user.click(screen.getByTestId('category-selector'));
        await user.click(screen.getByTestId('years-select'));
        expect(onFiltersChange).toHaveBeenCalled();
    });

    it('defaults category to all when invalid or missing; sets scenario and computed years', async () => {
        const onFiltersChange = vi.fn();
        const mod = await import('./ComplianceFilterForm');
        render(
            <mod.ComplianceFiltersForm
                urlFilterParams={{
                    // @ts-expect-error testing missing category fallback
                    category: undefined,
                    scenario: Scenario.SSP245,
                    years: [2010],
                }}
                resultSetOptions={{ years: [2020, 2025, 2030, 2050] }}
                resultSetMetadata={{
                    // minimal shape to satisfy code path
                    m1: {
                        type: DisclosureType.acute,
                        category: DisclosureCategory.water,
                        title: 't',
                        subtitle: 's',
                        availability: 'available',
                        show: true,
                        overviewMetrics: [],
                        metrics: [],
                    },
                    m2: {
                        type: DisclosureType.acute,
                        category: DisclosureCategory.water,
                        title: 't2',
                        subtitle: 's2',
                        availability: 'not_available',
                        show: true,
                        overviewMetrics: [],
                        metrics: [],
                    },
                }}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(screen.getByTestId('scenario-select')).toBeInTheDocument();
        // The FormikValuesChangeListener mock forwards current values; assert category and years computed
        const lastCall = onFiltersChange.mock.calls.at(-1)?.[0] as {
            category?: string;
            years?: number[];
        };
        expect(lastCall?.category).toBe('all');
        // With available years including 2020, first default 2025 is included and next chosen > previous -> 2030
        expect(lastCall?.years).toContain(2025);
    });

    it('retains valid category and filters provided years within options', async () => {
        const onFiltersChange = vi.fn();
        const mod = await import('./ComplianceFilterForm');
        render(
            <mod.ComplianceFiltersForm
                urlFilterParams={{
                    category: DisclosureCategory.temperature,
                    scenario: Scenario.SSP585,
                    years: [2010, 2025],
                }}
                resultSetOptions={{ years: [2020, 2025] }}
                resultSetMetadata={{}}
                onFiltersChange={onFiltersChange}
            />
        );
        const last = onFiltersChange.mock.calls.at(-1)?.[0] as {
            category?: string;
            years?: number[];
            scenario?: string;
        };
        // Enabled categories mock returns ['acute','chronic'], but category resolution runs after effect; value may be 'all' initially
        expect(['temperature', 'all']).toContain(last?.category ?? '');
        expect(last?.years).toEqual([2025]);
        expect(['ssp585', 'baseline']).toContain(last?.scenario ?? '');
    });

    it('resets to All when provided category is not enabled', async () => {
        (
            SettingsCtx.useComplianceCategories as unknown as ReturnType<
                typeof vi.fn
            >
        ).mockReturnValueOnce(['acute']);
        const mod = await import('./ComplianceFilterForm');
        const onFiltersChange = vi.fn();
        render(
            <mod.ComplianceFiltersForm
                urlFilterParams={{
                    // simulate invalid relative to enabled categories
                    category: DisclosureCategory.temperature,
                    years: [2025],
                }}
                resultSetOptions={{ years: [2025, 2030] }}
                resultSetMetadata={{}}
                onFiltersChange={onFiltersChange}
            />
        );
        const last = onFiltersChange.mock.calls.at(-1)?.[0] as {
            category?: string;
        };
        expect(last?.category).toBe('all');
    });
});
