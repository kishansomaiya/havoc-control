import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScenariosSectionForm } from './ScenariosSectionForm';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';
import * as consts from '../../../../../../../../const';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: {
            dataVersion: '3.2.0',
            custom: { perilMetrics: { scenarios: [] } },
        },
        setField: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

beforeEach(() => {
    vi.spyOn(consts, 'DEFAULT_PERIL_RESULT_SET_OPTIONS', 'get').mockReturnValue(
        {
            '3.2.0': { scenarios: ['SSP245', 'SSP585'] },
        } as unknown as typeof consts.DEFAULT_PERIL_RESULT_SET_OPTIONS
    );
    vi.spyOn(consts, 'SCENARIO_TITLES', 'get').mockReturnValue({
        SSP245: 'SSP2-4.5',
        SSP585: 'SSP5-8.5',
    } as typeof consts.SCENARIO_TITLES);
});

describe('PerilMetrics ScenariosSectionForm', () => {
    it('renders select all and scenario options', async () => {
        const user = userEvent.setup();
        render(<ScenariosSectionForm />);
        expect(screen.getByText('Select All')).toBeInTheDocument();
        await user.click(screen.getByText('Select All'));
    });

    it('renders indeterminate and individual options; toggles one', async () => {
        const user = userEvent.setup();
        render(<ScenariosSectionForm />);
        // Click an individual option label
        await user.click(screen.getByLabelText('SSP5-8.5'));
        expect(screen.getByText('Select All')).toBeInTheDocument();
    });

    it('shows helper text when errors present', async () => {
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: '3.2.0',
                custom: { perilMetrics: { scenarios: [] } },
            },
            setField: vi.fn(),
            touched: { custom: { perilMetrics: { scenarios: true } } },
            errors: { custom: { perilMetrics: { scenarios: 'Required' } } },
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        render(<ScenariosSectionForm />);
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('select all checks when none selected', async () => {
        const setFieldSpy = vi.fn();
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: '3.2.0',
                custom: { perilMetrics: { scenarios: [] } },
            },
            setField: setFieldSpy,
            touched: {},
            errors: {},
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        const user = userEvent.setup();
        render(<ScenariosSectionForm />);
        await user.click(screen.getByText('Select All'));
        expect(setFieldSpy).toHaveBeenCalledWith(
            'custom.perilMetrics.scenarios',
            ['SSP245', 'SSP585']
        );
    });

    it('select all unchecks when all selected', async () => {
        const setFieldSpy = vi.fn();
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: '3.2.0',
                custom: {
                    perilMetrics: { scenarios: ['SSP245', 'SSP585'] },
                },
            },
            setField: setFieldSpy,
            touched: {},
            errors: {},
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        const user = userEvent.setup();
        render(<ScenariosSectionForm />);
        await user.click(screen.getByText('Select All'));
        expect(setFieldSpy).toHaveBeenCalledWith(
            'custom.perilMetrics.scenarios',
            []
        );
    });

    it('checking individual adds id', async () => {
        const setFieldSpy = vi.fn();
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: '3.2.0',
                custom: { perilMetrics: { scenarios: [] } },
            },
            setField: setFieldSpy,
            touched: {},
            errors: {},
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        const user = userEvent.setup();
        render(<ScenariosSectionForm />);
        await user.click(screen.getByLabelText('SSP2-4.5'));
        expect(setFieldSpy).toHaveBeenCalledWith(
            'custom.perilMetrics.scenarios',
            ['SSP245']
        );
    });
});
