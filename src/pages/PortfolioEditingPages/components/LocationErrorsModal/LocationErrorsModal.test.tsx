import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationErrorsModal } from './LocationErrorsModal';
import { FileValidationRequestStatus } from '../../../../types/fileEnum';
import { FileValidationStatus } from '../../../../api/openapi/auto-generated';
import { ComponentProps } from 'react';
import { IFileValidationResponse } from '../../../../types/fileValidationTypes';

import { TestRoot } from '../../../../testing/TestRoot';
import * as filesMutation from '../../../../api/mutations/filesMutation';
import * as ConfirmModalModule from '../../../../components/ConfirmModal/ConfirmModal';
import * as utils from '../../../../utils';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(filesMutation, 'useDownloadFileValidationLog').mockReturnValue({
        downloadFileValidationLog: vi.fn(),
        isFileValidationLogDownloading: false,
    } as unknown as ReturnType<
        typeof filesMutation.useDownloadFileValidationLog
    >);
    vi.spyOn(ConfirmModalModule, 'ConfirmModal').mockImplementation(((
        props: ComponentProps<typeof ConfirmModalModule.ConfirmModal>
    ) => (
        <div data-testid="confirm-modal">
            <div data-testid="confirm-modal-title">{props.title}</div>
            <div data-testid="confirm-modal-message">{props.message}</div>
            <button
                data-testid="confirm-button"
                onClick={props.onConfirm}
            >
                {props.confirmLabel}
            </button>
            {props.cancelLabel ? (
                <button
                    data-testid="cancel-button"
                    onClick={props.onCancel}
                >
                    {props.cancelLabel}
                </button>
            ) : null}
            {Array.isArray(props.buttons) &&
                props.buttons.map((b, i) => (
                    <button
                        key={i}
                        data-testid={b.testId}
                        onClick={b.onClick}
                        disabled={b.disabled}
                    >
                        {b.label}
                    </button>
                ))}
        </div>
    )) as unknown as typeof ConfirmModalModule.ConfirmModal);
    vi.spyOn(utils, 'getLocationValidationErrors').mockReturnValue([
        { code: 'E1', message: 'LocErr', rowNumber: 2 },
    ] as unknown as ReturnType<typeof utils.getLocationValidationErrors>);
    vi.spyOn(utils, 'getRowValidationErrors').mockReturnValue([
        { code: 'W2', message: 'RowErr', rowNumber: 3 },
    ] as unknown as ReturnType<typeof utils.getRowValidationErrors>);
});

describe('LocationErrorsModal', () => {
    it('renders Unknown error when no validation result', () => {
        render(
            <TestRoot>
                <LocationErrorsModal
                    open
                    onGoBack={() => {}}
                    onContinue={() => {}}
                    fileValidationResult={undefined}
                    fileValidationRequestStatus={
                        FileValidationRequestStatus.Completed
                    }
                />
            </TestRoot>
        );
        expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
        expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });

    it('renders errors view and disables download when request completed', async () => {
        const user = userEvent.setup();
        const onContinue = vi.fn();
        const onGoBack = vi.fn();
        render(
            <TestRoot>
                <LocationErrorsModal
                    open
                    onGoBack={onGoBack}
                    onContinue={onContinue}
                    fileValidationResult={
                        {
                            status: FileValidationStatus.succeeded,
                        } as IFileValidationResponse
                    }
                    fileValidationRequestStatus={
                        FileValidationRequestStatus.Completed
                    }
                />
            </TestRoot>
        );
        // Tabs rendered inside message
        const message = screen.getByTestId('confirm-modal-message');
        const tabs = within(message).getByTestId('tab-list');
        const tabItems = within(tabs).getAllByTestId('tab-item');
        expect(tabItems.length).toBeGreaterThan(0);

        // Download button disabled
        expect(
            screen.getByTestId('download-validation-log-button')
        ).toBeDisabled();

        // Confirm calls onContinue when available and not allFailed
        await user.click(screen.getByTestId('confirm-button'));
        expect(onContinue).toHaveBeenCalled();

        // Switch to Row Messages tab and verify the Row Messages tab exists
        await user.click(tabItems[1]);
        expect(within(message).getByText('Row Messages')).toBeInTheDocument();
    });

    it('falls back to Go Back when all failed and no onContinue', async () => {
        const user = userEvent.setup();
        const onGoBack = vi.fn();
        render(
            <TestRoot>
                <LocationErrorsModal
                    open
                    onGoBack={onGoBack}
                    fileValidationResult={
                        {
                            status: FileValidationStatus.failed,
                        } as IFileValidationResponse
                    }
                    fileValidationRequestStatus={
                        FileValidationRequestStatus.CompletedWithErrors
                    }
                />
            </TestRoot>
        );
        expect(screen.getByTestId('confirm-button')).toHaveTextContent(
            'Go Back'
        );
        await user.click(screen.getByTestId('confirm-button'));
        expect(onGoBack).toHaveBeenCalled();
    });
});
