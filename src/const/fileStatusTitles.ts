import { FileUploadingStatus, FileValidationRequestStatus } from '../types';

export const FILE_UPLOADING_STATUS_TITLES = {
    [FileUploadingStatus.Uploading]: 'Uploading',
    [FileUploadingStatus.Error]: 'Upload Error',
    [FileUploadingStatus.Completed]: 'Upload Complete',
};

export const FILE_VALIDATION_STATUS_TITLES = {
    [FileValidationRequestStatus.NotStarted]: 'Not Started',
    [FileValidationRequestStatus.Validating]: 'Validating',
    [FileValidationRequestStatus.Error]: 'Validation Error',
    [FileValidationRequestStatus.Completed]: 'Validation Successful',
    [FileValidationRequestStatus.CompletedWithWarningsAndErrors]:
        'Validation Complete with Warnings and Errors',
    [FileValidationRequestStatus.CompletedWithWarnings]:
        'Validation Complete with Warnings',
    [FileValidationRequestStatus.CompletedWithErrors]:
        'Validation Complete with Errors',
};
