import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FloodMeshOptionsForm } from './FloodMeshOptionsForm';
import { IPortfolio } from 'pages/PortfolioEditingPages/types/portfolio';
import * as formikCtx from '../../../../../../../hooks/useFormikContextHelpers';
import * as SizeGridSectionFormModule from './SizeGrid/SizeGridSectionForm';
import * as ScenariosSectionFormModule from './Scenarios/ScenariosSectionForm';
import * as YearsSectionFormModule from './Years/YearsSectionForm';
import * as FloodDefenseSectionFormModule from './FloodDefense/FloodDefenseSectionForm';

const setFieldMock = vi.fn();
let mockValues: IPortfolio;

beforeEach(() => {
    mockValues = {
        isFloodMeshEnabled: true,
        locationCount: 10,
    } as unknown as IPortfolio;
    setFieldMock.mockReset();
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: setFieldMock,
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    vi.spyOn(
        SizeGridSectionFormModule,
        'SizeGridSectionForm'
    ).mockImplementation((() => (
        <div data-testid="fm-sizegrid" />
    )) as typeof SizeGridSectionFormModule.SizeGridSectionForm);
    vi.spyOn(
        ScenariosSectionFormModule,
        'ScenariosSectionForm'
    ).mockImplementation((() => (
        <div data-testid="fm-scenarios" />
    )) as typeof ScenariosSectionFormModule.ScenariosSectionForm);
    vi.spyOn(YearsSectionFormModule, 'YearsSectionForm').mockImplementation(
        (() => (
            <div data-testid="fm-years" />
        )) as typeof YearsSectionFormModule.YearsSectionForm
    );
    vi.spyOn(
        FloodDefenseSectionFormModule,
        'FloodDefenseSectionForm'
    ).mockImplementation((() => (
        <div data-testid="fm-flooddefense" />
    )) as typeof FloodDefenseSectionFormModule.FloodDefenseSectionForm);
});

describe('FloodMeshOptionsForm', () => {
    it('renders sections and toggles the switch', async () => {
        const user = userEvent.setup();
        render(<FloodMeshOptionsForm />);

        expect(screen.getByText('Flood Mesh')).toBeInTheDocument();
        expect(screen.getByTestId('fm-sizegrid')).toBeInTheDocument();
        expect(screen.getByTestId('fm-scenarios')).toBeInTheDocument();
        expect(screen.getByTestId('fm-years')).toBeInTheDocument();
        expect(screen.getByTestId('fm-flooddefense')).toBeInTheDocument();

        const toggle = screen.getByRole('checkbox');
        await user.click(toggle);
        expect(setFieldMock).toHaveBeenCalledWith('isFloodMeshEnabled', false);
    });

    it('disables the switch when location count is over the limit', () => {
        mockValues.locationCount = 999;
        render(<FloodMeshOptionsForm />);
        const toggle = screen.getByRole('checkbox');
        expect(toggle).toBeDisabled();
    });
});
