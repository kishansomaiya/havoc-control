import { useApi } from '../helpers/useApiHook';
import { useMutation } from '@tanstack/react-query';
import {
    APIFilePurpose,
    FileUploadingStatus,
    FileValidationRequestStatus,
} from '../../types';
import { FileResponse, FileValidationStatus } from '../openapi/auto-generated';
import { useCallback, useRef, useState } from 'react';
import {
    PORTFOLIO_LOCATIONS_COUNT_LIMIT,
    UPLOADED_FILE_TOO_LARGE_ERROR,
    UPLOADED_FILE_UNKNOWN_ERROR,
} from '../../const';
import { IFileValidationResponse } from '../../types/fileValidationTypes';
import { downloadFile } from '../../utils';
import { useAddAlert } from '../../context/AlertProvider';

export const useUploadPortfolioFileMutation = () => {
    const { filesApi } = useApi();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [fileUploadingStatus, setFileUploadingStatus] =
        useState<FileUploadingStatus>(FileUploadingStatus.Error);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async (file: Blob): Promise<FileResponse> => {
            setFileUploadingStatus(FileUploadingStatus.Uploading);
            abortControllerRef.current = new AbortController();
            const purpose = APIFilePurpose.PortfolioUpload;
            return await filesApi.createFileFilesPost(
                {
                    file,
                    purpose,
                },
                { signal: abortControllerRef.current.signal }
            );
        },
        onError: () => {
            if (abortControllerRef?.current?.signal?.aborted) {
                setFileUploadingStatus(FileUploadingStatus.Uploading);
                return;
            }
            setFileUploadingStatus(FileUploadingStatus.Error);
        },
        onSuccess: () => {
            setFileUploadingStatus(FileUploadingStatus.Completed);
        },
    });

    const cancelUpload = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
        setFileUploadingStatus(FileUploadingStatus.Uploading);
    }, [reset, setFileUploadingStatus]);

    return {
        uploadPortfolioFile: mutateAsync,
        isFileUploading: isPending,
        isFileUploadingError: isError,
        fileUploadingError: error,
        cancelUpload,
        abortControllerRef,
        fileUploadingStatus,
    };
};
export const useValidatePortfolioFileMutation = () => {
    const { newFileValidationsApi, fileValidationMessagesApi } = useApi();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [fileValidationStatus, setFileValidationStatus] =
        useState<FileValidationRequestStatus>(
            FileValidationRequestStatus.NotStarted
        );

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async (
            fileId: string
        ): Promise<IFileValidationResponse> => {
            abortControllerRef.current = new AbortController();
            setFileValidationStatus(FileValidationRequestStatus.Validating);

            let fileValidationStatus: FileValidationStatus =
                FileValidationStatus.pending;
            let validationResponse: IFileValidationResponse =
                await newFileValidationsApi.createFileValidationFileValidationsPost(
                    {
                        fileValidationInput: { file: fileId },
                    },
                    { signal: abortControllerRef.current.signal }
                );

            const delayBetweenRetries = 5000;

            while (
                !isError &&
                fileValidationStatus === FileValidationStatus.pending &&
                !abortControllerRef.current.signal.aborted
            ) {
                await new Promise((r) => setTimeout(r, delayBetweenRetries));
                validationResponse =
                    await newFileValidationsApi.retrieveFileValidationFileValidationsFileValidationIdGet(
                        {
                            fileValidationId: validationResponse.id,
                        },
                        { signal: abortControllerRef.current.signal }
                    );

                fileValidationStatus = validationResponse.status;
            }

            const {
                succeededCount = 0,
                warningCount = 0,
                fileMessages = [],
                status,
            } = validationResponse;

            if (
                succeededCount + warningCount >
                PORTFOLIO_LOCATIONS_COUNT_LIMIT
            ) {
                validationResponse.status = FileValidationStatus.failed;
                validationResponse.fileMessages = [
                    ...fileMessages,
                    UPLOADED_FILE_TOO_LARGE_ERROR,
                ];
            }

            if (validationResponse.locationMessageCount) {
                const locationMsgsData =
                    await fileValidationMessagesApi.listFileValidationFileValidationIdMessagesLocationGet(
                        {
                            fileValidationId: validationResponse.id,
                            limit: PORTFOLIO_LOCATIONS_COUNT_LIMIT,
                        }, // PORTFOLIO_LOCATIONS_COUNT_LIMIT as we want to fetch all errors in one go for now
                        { signal: abortControllerRef.current.signal }
                    );
                validationResponse.locationErrorMessages =
                    locationMsgsData.data ?? [];
            }

            if (validationResponse.rowMessageCount) {
                const rowMsgsData =
                    await fileValidationMessagesApi.listFileValidationFileValidationIdMessagesRowGet(
                        {
                            fileValidationId: validationResponse.id,
                            limit: PORTFOLIO_LOCATIONS_COUNT_LIMIT,
                        }, // PORTFOLIO_LOCATIONS_COUNT_LIMIT as we want to fetch all errors in one go for now
                        { signal: abortControllerRef.current.signal }
                    );
                validationResponse.rowErrorMessages = rowMsgsData.data ?? [];
            }

            const { locationErrorMessages = [], rowErrorMessages = [] } =
                validationResponse;

            if (
                succeededCount === 0 &&
                fileMessages.length === 0 &&
                locationErrorMessages.length === 0 &&
                rowErrorMessages.length === 0 &&
                status === FileValidationStatus.failed
            ) {
                validationResponse.fileMessages = [
                    ...fileMessages,
                    UPLOADED_FILE_UNKNOWN_ERROR,
                ];
            }

            return validationResponse;
        },
        onError: () => {
            if (abortControllerRef?.current?.signal?.aborted) {
                setFileValidationStatus(FileValidationRequestStatus.NotStarted);
                return;
            }
            setFileValidationStatus(FileValidationRequestStatus.Error);
        },
        onSuccess: (data: IFileValidationResponse) => {
            const { status, failedCount = 0, warningCount = 0 } = data;
            if (
                status === FileValidationStatus.pending ||
                status === FileValidationStatus.failed
            ) {
                setFileValidationStatus(FileValidationRequestStatus.Error);
                return;
            }

            if (failedCount > 0 && warningCount > 0) {
                setFileValidationStatus(
                    FileValidationRequestStatus.CompletedWithWarningsAndErrors
                );
                return;
            }

            if (failedCount === 0 && warningCount > 0) {
                setFileValidationStatus(
                    FileValidationRequestStatus.CompletedWithWarnings
                );
                return;
            }

            if (warningCount === 0 && failedCount > 0) {
                setFileValidationStatus(
                    FileValidationRequestStatus.CompletedWithErrors
                );
                return;
            }

            setFileValidationStatus(FileValidationRequestStatus.Completed);
        },
    });

    const cancelValidation = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
        setFileValidationStatus(FileValidationRequestStatus.NotStarted);
    }, [reset, setFileValidationStatus]);

    return {
        validatePortfolioFile: mutateAsync,
        isFileValidating: isPending,
        isFileValidationError: isError,
        fileValidationError: error,
        cancelValidation,
        abortControllerRef,
        fileValidationStatus,
    };
};

export const useDownloadFileValidationLog = () => {
    const { fileValidationsApi } = useApi();
    const addAlert = useAddAlert();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (fileValidationId: string) => {
            try {
                const blob =
                    await fileValidationsApi.validationLogDownloadFileValidationsFileValidationIdLogDownloadGet(
                        { fileValidationId }
                    );
                const downloadURL = URL.createObjectURL(blob);
                downloadFile(downloadURL, 'validation-log.csv');
                URL.revokeObjectURL(downloadURL);
            } catch (err) {
                addAlert(
                    'Encountered error while downloading validation log, please try again.',
                    'error'
                );
                throw err;
            }
        },
    });

    return {
        downloadFileValidationLog: mutateAsync,
        isFileValidationLogDownloading: isPending,
        isFileValidationLogDownloadError: isError,
        fileValidationLogDownloadError: error,
    };
};
