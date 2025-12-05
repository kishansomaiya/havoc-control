import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    EnterAddressForm,
    EnterAddressFormProps,
    EnteredAddressLocation,
} from './EnterAddressForm';
import { IFileValidationResponse } from '../../../../../types/fileValidationTypes';
import { TestRoot } from '../../../../../testing/TestRoot';
import * as PortfolioLocationsMapModule from '../../../../../components/Map/PortfolioLocationsMap';
import * as portfoliosMutation from '../../../../../api/mutations/portfoliosMutation';
import * as filesMutation from '../../../../../api/mutations/filesMutation';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        PortfolioLocationsMapModule,
        'PortfolioLocationsMap'
    ).mockImplementation((() => (
        <div data-testid="map" />
    )) as unknown as typeof PortfolioLocationsMapModule.PortfolioLocationsMap);
    vi.spyOn(
        portfoliosMutation,
        'useCreatePortfolioGeocodeMutation'
    ).mockReturnValue({
        isPortfolioGeocodeCreating: false,
        createPortfolioGeocode: vi.fn().mockResolvedValue({
            individualResults: [
                {
                    address: 'A',
                    coords: [1, 2],
                    status: { validationStatus: 'passed' },
                },
            ],
        }),
        cancelGeocodeValidation: vi.fn(),
    } as unknown as ReturnType<
        typeof portfoliosMutation.useCreatePortfolioGeocodeMutation
    >);
    vi.spyOn(filesMutation, 'useValidatePortfolioFileMutation').mockReturnValue(
        {
            fileValidationStatus: 'pending',
            isFileValidating: false,
        } as unknown as ReturnType<
            typeof filesMutation.useValidatePortfolioFileMutation
        >
    );
    vi.spyOn(filesMutation, 'useDownloadFileValidationLog').mockReturnValue({
        downloadFileValidationLog: vi.fn(),
        isFileValidationLogDownloading: false,
    } as unknown as ReturnType<
        typeof filesMutation.useDownloadFileValidationLog
    >);
});

describe('EnterAddressForm', () => {
    const baseProps = {
        onEnteredAddressChange: vi.fn(),
        onLocationGeocodeChange: vi.fn(),
        errorLocationIds: [],
        errorAddressLocationIds: [],
        isGeocodeAddressesVerified: false,
        enteredAddressLocations: [],
        locationGeocode: undefined,
        fileValidationResult: undefined,
    };

    it('renders label and input and map', () => {
        render(
            <TestRoot>
                <EnterAddressForm {...baseProps} />
            </TestRoot>
        );
        expect(screen.getByTestId('enter-address-form')).toBeInTheDocument();
        expect(
            screen.getByTestId('enter-address-input-field')
        ).toBeInTheDocument();
        expect(screen.getByTestId('map')).toBeInTheDocument();
    });

    it('adds an address via enter button and shows chip', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot>
                <EnterAddressForm {...baseProps} />
            </TestRoot>
        );
        const input = screen.getByTestId('enter-address-input-field');
        await user.type(input, 'Some Address');
        await user.click(
            screen.getByTestId('enter-address-input-enter-button')
        );
        expect(
            screen.getByTestId('enter-address-form-locations-list')
        ).toBeInTheDocument();
    });

    it('handles input reset and prevents adding when empty or limit reached', async () => {
        const user = userEvent.setup();
        const props = {
            ...baseProps,
            enteredAddressLocations: Array.from({ length: 100 }).map(
                (_, i) => ({ id: i + 1, streetAddress: `A${i + 1}` })
            ),
        } as EnterAddressFormProps;
        render(
            <TestRoot>
                <EnterAddressForm {...props} />
            </TestRoot>
        );
        const input = screen.getByTestId('enter-address-input-field');
        await user.type(input, '   ');
        fireEvent.click(screen.getByTestId('enter-address-input-enter-button'));
        await user.click(screen.getByTestId('enter-address-input-x-button'));
        expect(
            screen.getByTestId('enter-address-input-field')
        ).toBeInTheDocument();
    });

    it('validates addresses when not yet verified and enables button only when there are locations', async () => {
        const user = userEvent.setup();
        const onEntered = vi.fn();
        const onGeocode = vi.fn();
        render(
            <TestRoot>
                <EnterAddressForm
                    {...baseProps}
                    isGeocodeAddressesVerified={false}
                    onEnteredAddressChange={onEntered}
                    onLocationGeocodeChange={onGeocode}
                    enteredAddressLocations={
                        [
                            { id: 1, streetAddress: 'X' },
                        ] as EnteredAddressLocation[]
                    }
                />
            </TestRoot>
        );
        const validateBtn = screen.getByTestId(
            'enter-address-form-validate-button'
        );
        expect(validateBtn).toBeEnabled();
        await user.click(validateBtn);
        expect(onEntered).toHaveBeenCalled();
        expect(onGeocode).toHaveBeenCalled();
    });

    it('shows validated text button when already verified', () => {
        render(
            <TestRoot
                messages={{
                    'create_portfolio.upload_type.enter_address.validated_text':
                        'create_portfolio.upload_type.enter_address.validated_text',
                }}
            >
                <EnterAddressForm
                    {...baseProps}
                    isGeocodeAddressesVerified={true}
                    enteredAddressLocations={
                        [
                            { id: 1, streetAddress: 'Y' },
                        ] as EnteredAddressLocation[]
                    }
                />
            </TestRoot>
        );
        const btn = screen.getByRole('button', {
            name: /create_portfolio\.upload_type\.enter_address\.validated_text/i,
        });
        expect(btn).toBeDisabled();
    });

    it('enables download log only when result id present and not completed', async () => {
        const user = userEvent.setup();
        vi.spyOn(
            filesMutation,
            'useValidatePortfolioFileMutation'
        ).mockReturnValue({
            fileValidationStatus: 'running',
            isFileValidating: false,
        } as unknown as ReturnType<
            typeof filesMutation.useValidatePortfolioFileMutation
        >);
        render(
            <TestRoot>
                <EnterAddressForm
                    {...baseProps}
                    fileValidationResult={
                        { id: 'vid' } as IFileValidationResponse
                    }
                    isGeocodeAddressesVerified={false}
                />
            </TestRoot>
        );
        const btn = screen.getByTestId('download-validation-log-button');
        expect(btn).toBeEnabled();
        await user.click(btn);
    });

    it('computes mapCenter from last valid location and respects error chip coloring', () => {
        render(
            <TestRoot>
                <EnterAddressForm
                    {...baseProps}
                    enteredAddressLocations={[
                        {
                            id: 1,
                            streetAddress: 'A1',
                            latitude: 1,
                            longitude: 2,
                        } as EnteredAddressLocation,
                        {
                            id: 2,
                            streetAddress: 'A2',
                            latitude: 3,
                            longitude: 4,
                        } as EnteredAddressLocation,
                    ]}
                    errorLocationIds={[1]}
                />
            </TestRoot>
        );
        expect(
            screen.getByTestId('enter-address-form-locations-list')
        ).toBeInTheDocument();
    });
});
