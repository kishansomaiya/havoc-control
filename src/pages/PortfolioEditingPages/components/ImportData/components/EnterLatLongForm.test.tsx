import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnterLatLongForm } from './EnterLatLongForm';
import { TestRoot } from '../../../../../testing/TestRoot';
import * as PortfolioLocationsMapModule from '../../../../../components/Map/PortfolioLocationsMap';
import * as filesMutation from '../../../../../api/mutations/filesMutation';
import { MessageKeys } from '../../../../../localization/useFormatMessage';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        PortfolioLocationsMapModule,
        'PortfolioLocationsMap'
    ).mockImplementation((() => (
        <div data-testid="map" />
    )) as typeof PortfolioLocationsMapModule.PortfolioLocationsMap);
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

describe('EnterLatLongForm', () => {
    it('renders label and input and map', () => {
        render(
            <TestRoot
                messages={{
                    'create_portfolio.upload_type.enter_lat_long.input_label_text':
                        'create_portfolio.upload_type.enter_lat_long.input_label_text',
                }}
            >
                <EnterLatLongForm
                    onEnteredLocationsChange={vi.fn()}
                    fileValidationResult={undefined}
                    errorLocationIds={[]}
                />
            </TestRoot>
        );
        expect(screen.getByTestId('enter-lat-long-form')).toBeInTheDocument();
        expect(
            screen.getByTestId('enter-lat-long-input-field')
        ).toBeInTheDocument();
        expect(screen.getByTestId('map')).toBeInTheDocument();
    });

    it('adds and removes a location chip', async () => {
        const user = userEvent.setup();
        render(
            <TestRoot
                messages={{
                    'create_portfolio.upload_type.enter_lat_long.input_label_text':
                        'create_portfolio.upload_type.enter_lat_long.input_label_text',
                }}
            >
                <EnterLatLongForm
                    onEnteredLocationsChange={vi.fn()}
                    fileValidationResult={undefined}
                    errorLocationIds={[]}
                />
            </TestRoot>
        );
        const input = screen.getByLabelText(
            'create_portfolio.upload_type.enter_lat_long.input_label_text' as MessageKeys
        );
        await user.type(input, '10,20');
        await user.click(
            screen.getByTestId('enter-lat-long-input-enter-button')
        );
        const chip = await screen.findByTestId(
            'enter-lat-long-form-location-chip'
        );
        expect(chip).toBeInTheDocument();
        await user.click(
            screen.getByTestId('enter-lat-long-form-locations-chip-x-icon')
        );
        expect(
            screen.queryByTestId('enter-lat-long-form-location-chip')
        ).not.toBeInTheDocument();
    });
});
