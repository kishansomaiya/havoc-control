import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadTypeSelection } from './UploadTypeSelection';
import { UploadLocationsType } from '../types/uploadLocationsTypeEnum';
import { TestRoot } from '../../../../../testing/TestRoot';
import * as utils from '../../../../../utils';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(utils, 'downloadFile').mockImplementation(vi.fn());
});

describe('UploadTypeSelection', () => {
    it('renders label and options; clicking items changes type', async () => {
        const user = userEvent.setup();
        const onTypeChange = vi.fn();
        render(
            <TestRoot
                messages={{
                    'create_portfolio.upload_type.label':
                        'create_portfolio.upload_type.label',
                    'create_portfolio.download_template_button':
                        'create_portfolio.download_template_button',
                }}
            >
                <UploadTypeSelection
                    type={UploadLocationsType.ImportFile}
                    onTypeChange={onTypeChange}
                />
            </TestRoot>
        );
        expect(screen.getByTestId('upload-type-label')).toBeInTheDocument();
        await user.click(
            within(
                screen.getByTestId('enter-lat-long-radio-button')
            ).getByLabelText('A')
        );
        expect(onTypeChange).toHaveBeenCalledWith(
            UploadLocationsType.EnterLatLong
        );
        await user.click(
            within(
                screen.getByTestId('enter-address-radio-button')
            ).getByLabelText('A')
        );
        expect(onTypeChange).toHaveBeenCalledWith(
            UploadLocationsType.EnterAddress
        );
        await user.click(
            within(
                screen.getByTestId('upload-csv-radio-button')
            ).getByLabelText('A')
        );
        expect(onTypeChange).toHaveBeenCalledWith(
            UploadLocationsType.ImportFile
        );
    });

    it('download template button present', () => {
        render(
            <TestRoot
                messages={{
                    'create_portfolio.download_template_button':
                        'create_portfolio.download_template_button',
                }}
            >
                <UploadTypeSelection
                    type={UploadLocationsType.ImportFile}
                    onTypeChange={vi.fn()}
                />
            </TestRoot>
        );
        expect(
            screen.getByTestId('download-template-button')
        ).toBeInTheDocument();
    });
});
