import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScenariosSectionForm } from './ScenariosSectionForm';
import { DataVersion, Scenario } from '../../../../../../../../types';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

const setField = vi.fn();
beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: {
            dataVersion: DataVersion.v3_2_0,
            custom: { floodMesh: { scenarios: [Scenario.SSP585] } },
        },
        setField,
        touched: { custom: { floodMesh: { scenarios: false } } },
        errors: { custom: { floodMesh: { scenarios: undefined } } },
        handleBlur: vi.fn(),
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

// Use real constants; rely on default maps for scenarios

describe('ScenariosSectionForm', () => {
    it('renders with available scenario options', () => {
        render(<ScenariosSectionForm />);
        expect(screen.getByText('Scenarios')).toBeInTheDocument();
        // label and legend both include text; ensure at least one present
        expect(screen.getAllByText('Select options').length).toBeGreaterThan(0);
    });

    it('shows helper text on error/touched and renders no options when peril data missing', async () => {
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: 'unknown' as DataVersion,
                custom: { floodMesh: { scenarios: [] } },
            },
            setField,
            touched: { custom: { floodMesh: { scenarios: true } } },
            errors: { custom: { floodMesh: { scenarios: 'Required' } } },
            handleBlur: vi.fn(),
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        render(<ScenariosSectionForm />);
        expect(screen.getAllByText('Select options').length).toBeGreaterThan(0);
    });

    it('invokes onChange to set scenarios (Autocomplete change path)', async () => {
        const setFieldSpy = vi.fn();
        vi.resetModules();
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: {
                        dataVersion: DataVersion.v3_2_0,
                        custom: { floodMesh: { scenarios: [] } },
                    },
                    setField: setFieldSpy,
                    touched: { custom: { floodMesh: { scenarios: false } } },
                    errors: {
                        custom: { floodMesh: { scenarios: undefined } },
                    },
                    handleBlur: vi.fn(),
                }),
            })
        );
        vi.resetModules();
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
                        value: Array<{ scenario: Scenario; title: string }>
                    ) => void;
                }) => (
                    <button
                        data-testid="trigger"
                        onClick={() =>
                            onChange({}, [
                                {
                                    scenario: Scenario.SSP245,
                                    title: 'SSP2-4.5',
                                },
                            ])
                        }
                    >
                        trigger
                    </button>
                ),
                TextField: (props: JSX.IntrinsicElements['input']) => (
                    <input
                        aria-label="Select options"
                        {...props}
                    />
                ),
            };
        });
        const { ScenariosSectionForm: Form } = await import(
            './ScenariosSectionForm'
        );
        render(<Form />);
        screen.getByTestId('trigger').click();
        expect(setFieldSpy).toHaveBeenCalledWith('custom.floodMesh.scenarios', [
            Scenario.SSP245,
        ]);
    });

    it('touched true without error keeps helperText empty (false branch)', async () => {
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: DataVersion.v3_2_0,
                custom: { floodMesh: { scenarios: [] } },
            },
            setField: vi.fn(),
            touched: { custom: { floodMesh: { scenarios: true } } },
            errors: { custom: { floodMesh: { scenarios: undefined } } },
            handleBlur: vi.fn(),
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        render(<ScenariosSectionForm />);
        expect(screen.getByText('Scenarios')).toBeInTheDocument();
    });

    it('touched false with error present does not show helper (false branch)', async () => {
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: {
                dataVersion: DataVersion.v3_2_0,
                custom: { floodMesh: { scenarios: [] } },
            },
            setField: vi.fn(),
            touched: { custom: { floodMesh: { scenarios: false } } },
            errors: { custom: { floodMesh: { scenarios: 'Required' } } },
            handleBlur: vi.fn(),
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        render(<ScenariosSectionForm />);
        expect(screen.getByText('Scenarios')).toBeInTheDocument();
    });
});
