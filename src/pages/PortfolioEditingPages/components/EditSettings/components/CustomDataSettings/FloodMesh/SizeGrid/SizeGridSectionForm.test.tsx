import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SizeGridSectionForm } from './SizeGridSectionForm';
import { IPortfolio } from 'pages/PortfolioEditingPages/types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';
import * as userContext from '../../../../../../../../context/UserContextProvider';

const setFieldMock = vi.fn();
let canAccessLargeGrid = false;
let mockValues: IPortfolio;

beforeEach(() => {
    mockValues = {
        custom: { floodMesh: { mesh: { type: 'dynamic' } } },
    } as unknown as IPortfolio;
    setFieldMock.mockReset();
    canAccessLargeGrid = false;
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: setFieldMock,
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    vi.spyOn(userContext, 'useUserContext').mockImplementation((() => ({
        get canAccessLargeGrid() {
            return canAccessLargeGrid;
        },
    })) as typeof userContext.useUserContext);
});

describe('SizeGridSectionForm', () => {
    it('renders and disables fixed option without permission', () => {
        render(<SizeGridSectionForm />);
        const fixed = screen.getByLabelText('15x15') as HTMLInputElement;
        expect(fixed).toBeDisabled();
        const dynamic = screen.getByLabelText('Dynamic') as HTMLInputElement;
        expect(dynamic).toBeEnabled();
    });

    it('enables fixed option when permission is granted and changes selection', async () => {
        const user = userEvent.setup();
        canAccessLargeGrid = true;
        render(<SizeGridSectionForm />);
        const fixed = screen.getByLabelText('15x15') as HTMLInputElement;
        expect(fixed).toBeEnabled();
        await user.click(fixed);
        expect(setFieldMock).toHaveBeenCalledWith(
            'custom.floodMesh.mesh.type',
            'fixed'
        );
    });
});
