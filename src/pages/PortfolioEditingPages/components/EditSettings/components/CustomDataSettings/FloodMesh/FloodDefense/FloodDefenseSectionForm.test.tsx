import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { FloodDefenseSectionForm } from './FloodDefenseSectionForm';

const setField = vi.fn();
const setFields = vi.fn();
vi.mock('../../../../../../../../hooks/useFormikContextHelpers', () => ({
    useFormikContextHelpers: () => ({
        values: {
            custom: {
                floodMesh: {
                    floodDefense: {
                        enabled: false,
                        zeroOutDefendedLocations: false,
                    },
                },
            },
        },
        setField,
        setFields,
    }),
}));

describe('FloodDefenseSectionForm', () => {
    it('enables flood defenses and auto-checks zero-out when toggled on', () => {
        render(<FloodDefenseSectionForm />);
        const enable = screen.getByRole('checkbox', {
            name: 'Enable Flood Defenses',
        });
        fireEvent.click(enable);
        expect(setFields).toHaveBeenCalledWith({
            'custom.floodMesh.floodDefense.enabled': true,
            'custom.floodMesh.floodDefense.zeroOutDefendedLocations': true,
        });
    });

    it('updates zero-out checkbox when enabled', () => {
        (setFields as Mock).mockClear();
        (setField as Mock).mockClear();
        // remock with enabled true
        vi.doMock(
            '../../../../../../../../hooks/useFormikContextHelpers',
            () => ({
                useFormikContextHelpers: () => ({
                    values: {
                        custom: {
                            floodMesh: {
                                floodDefense: {
                                    enabled: true,
                                    zeroOutDefendedLocations: false,
                                },
                            },
                        },
                    },
                    setField,
                    setFields,
                }),
            })
        );
        // dynamic import component to use new mock
        import('./FloodDefenseSectionForm').then(
            ({ FloodDefenseSectionForm: Comp }) => {
                render(<Comp />);
                const zeroOut = screen.getByRole('checkbox', {
                    name: 'Adjust depths for protected locations',
                });
                fireEvent.click(zeroOut);
                expect(setField).toHaveBeenCalledWith(
                    'custom.floodMesh.floodDefense.zeroOutDefendedLocations',
                    true
                );
            }
        );
    });
});
