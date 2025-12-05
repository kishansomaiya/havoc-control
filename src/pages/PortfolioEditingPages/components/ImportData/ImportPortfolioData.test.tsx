import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImportPortfolioData } from './ImportPortfolioData';
import { UploadLocationsType } from './types/uploadLocationsTypeEnum';
import { ComponentProps } from 'react';
import * as UploadTypeSelectionModule from './components/UploadTypeSelection';
import * as UploadCsvFileFormModule from './components/UploadCsvFileForm';
import * as EnterLatLongFormModule from './components/EnterLatLongForm';
import * as EnterAddressFormModule from './components/EnterAddressForm';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        UploadTypeSelectionModule,
        'UploadTypeSelection'
    ).mockImplementation(((
        props: ComponentProps<
            typeof UploadTypeSelectionModule.UploadTypeSelection
        >
    ) => (
        <button
            data-testid="upload-type"
            onClick={() => props.onTypeChange(UploadLocationsType.EnterLatLong)}
        >
            UploadType
        </button>
    )) as typeof UploadTypeSelectionModule.UploadTypeSelection);
    vi.spyOn(UploadCsvFileFormModule, 'UploadCsvFileForm').mockImplementation(((
        props: ComponentProps<typeof UploadCsvFileFormModule.UploadCsvFileForm>
    ) => (
        <div
            data-testid="csv-form"
            data-prop={!!props.onFileValidationCompleted}
        />
    )) as typeof UploadCsvFileFormModule.UploadCsvFileForm);
    vi.spyOn(EnterLatLongFormModule, 'EnterLatLongForm').mockImplementation(((
        props: ComponentProps<typeof EnterLatLongFormModule.EnterLatLongForm>
    ) => (
        <div
            data-testid="latlong-form"
            data-props={!!props.onEnteredLocationsChange}
        />
    )) as typeof EnterLatLongFormModule.EnterLatLongForm);
    vi.spyOn(EnterAddressFormModule, 'EnterAddressForm').mockImplementation(((
        props: ComponentProps<typeof EnterAddressFormModule.EnterAddressForm>
    ) => (
        <div
            data-testid="address-form"
            data-props={props.enteredAddressLocations?.length || 0}
        />
    )) as typeof EnterAddressFormModule.EnterAddressForm);
});

describe('ImportPortfolioData', () => {
    const baseProps = {
        onFileValidationChange: vi.fn(),
        onUploadLocationsTypeChange: vi.fn(),
        onEnteredLocationsChange: vi.fn(),
        onEnteredAddressChange: vi.fn(),
        onLocationGeocodeChange: vi.fn(),
        isGeocodeAddressesVerified: false,
        uploadLocationsType: UploadLocationsType.ImportFile,
        errorLocationIds: [],
        errorAddressLocationIds: [],
        enteredAddressLocations: [],
        fileValidationResult: undefined,
    };

    it('renders csv form for ImportFile', () => {
        render(<ImportPortfolioData {...baseProps} />);
        expect(screen.getByTestId('csv-form')).toBeInTheDocument();
    });

    it('renders lat/long form when type is EnterLatLong', () => {
        render(
            <ImportPortfolioData
                {...baseProps}
                uploadLocationsType={UploadLocationsType.EnterLatLong}
            />
        );
        expect(screen.getByTestId('latlong-form')).toBeInTheDocument();
    });

    it('renders address form when type is EnterAddress', () => {
        render(
            <ImportPortfolioData
                {...baseProps}
                uploadLocationsType={UploadLocationsType.EnterAddress}
            />
        );
        expect(screen.getByTestId('address-form')).toBeInTheDocument();
    });

    it('clicking upload type triggers onUploadLocationsTypeChange', async () => {
        const user = userEvent.setup();
        render(<ImportPortfolioData {...baseProps} />);
        await user.click(screen.getByTestId('upload-type'));
        expect(baseProps.onUploadLocationsTypeChange).toHaveBeenCalledWith(
            UploadLocationsType.EnterLatLong
        );
    });
});
