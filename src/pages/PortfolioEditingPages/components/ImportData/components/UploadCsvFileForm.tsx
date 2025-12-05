import {
    Backdrop,
    Box,
    CircularProgress,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import * as Icon from 'react-feather';
import Grid from '@mui/material/Unstable_Grid2';
import { FileUploader } from '../../../../../components/FileUploader/FileUploader';
import { removeFileExtension } from '../../../../../utils';
import {
    useDownloadFileValidationLog,
    useUploadPortfolioFileMutation,
    useValidatePortfolioFileMutation,
} from '../../../../../api/mutations/filesMutation';
import {
    FileResponse,
    FileValidationStatus,
} from '../../../../../api/openapi/auto-generated';
import { FileErrorsModal } from './FileErrorsModal';
import { useFileValidationLocationsQuery } from '../../../../../api/queries/fileValidationsQuery';
import { PortfolioLocationsMap } from '../../../../../components/Map/PortfolioLocationsMap';
import { FileValidationRequestStatus } from '../../../../../types';
import { IFileValidationResponse } from '../../../../../types/fileValidationTypes';
import { LocationErrorsModal } from '../../LocationErrorsModal/LocationErrorsModal';
import { LoadingButton } from '@mui/lab';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';

interface UploadCsvFileFormProps extends ComponentProps<typeof Box> {
    onFileValidationCompleted?: (
        validation: IFileValidationResponse | undefined,
        filename?: string | undefined
    ) => void;
}

export const UploadCsvFileForm: FC<UploadCsvFileFormProps> = ({
    onFileValidationCompleted,
}) => {
    const formatMessage = useFormatMessage();
    const { uploadPortfolioFile, cancelUpload, fileUploadingStatus } =
        useUploadPortfolioFileMutation();
    const {
        validatePortfolioFile,
        cancelValidation,
        fileValidationStatus,
        isFileValidating,
    } = useValidatePortfolioFileMutation();
    const { downloadFileValidationLog, isFileValidationLogDownloading } =
        useDownloadFileValidationLog();
    const [showFileErrorsModal, setShowFileErrorsModal] =
        useState<boolean>(false);
    const [showLocationErrorsModal, setShowLocationErrorsModal] =
        useState<boolean>(false);
    const [fileValidationResult, setFileValidationResult] = useState<
        IFileValidationResponse | undefined
    >();
    const [filenameWithoutExtension, setFilenameWithoutExtension] = useState<
        string | undefined
    >();
    const { locations, isLocationsLoading } = useFileValidationLocationsQuery({
        fileValidationId:
            fileValidationStatus === FileValidationRequestStatus.Completed
                ? fileValidationResult?.id
                : undefined,
    });

    useEffect(() => {
        if (!onFileValidationCompleted) {
            return;
        }
        onFileValidationCompleted(
            fileValidationResult,
            filenameWithoutExtension
        );
    }, [
        fileValidationResult,
        filenameWithoutExtension,
        onFileValidationCompleted,
    ]);

    const portfolioLocations = useMemo(() => {
        return locations.map(({ customerLocationId, geometry }) => {
            return {
                id: customerLocationId,
                geometry,
            };
        });
    }, [locations]);

    const handleFileValidationErrors = useCallback(
        (validationResult: IFileValidationResponse) => {
            const {
                fileMessages,
                locationErrorMessages,
                rowErrorMessages,
                status,
            } = validationResult;

            if (fileMessages?.length) {
                setShowFileErrorsModal(true);
                return;
            }

            if (
                status === FileValidationStatus.failed &&
                (locationErrorMessages?.length || rowErrorMessages?.length)
            ) {
                setShowLocationErrorsModal(true);
                return;
            }
        },
        [setShowFileErrorsModal, setShowLocationErrorsModal]
    );

    const handleValidateUploadedFile = useCallback(
        async (id: string) => {
            const validationResult: IFileValidationResponse =
                await validatePortfolioFile(id);
            setFileValidationResult(validationResult);
            handleFileValidationErrors(validationResult);
        },
        [validatePortfolioFile, handleFileValidationErrors]
    );

    const handleFileSelection = useCallback(
        async (file: File | null) => {
            if (!file) {
                return;
            }

            const uploadedFile: FileResponse = await uploadPortfolioFile(file);
            await handleValidateUploadedFile(uploadedFile.id);
            setFilenameWithoutExtension(
                removeFileExtension(uploadedFile.filename)
            );
        },
        [uploadPortfolioFile, handleValidateUploadedFile]
    );

    const handleFileDelete = useCallback(() => {
        setFileValidationResult(undefined);
        cancelUpload();
        cancelValidation();
        onFileValidationCompleted?.(undefined);
    }, [cancelUpload, cancelValidation, onFileValidationCompleted]);

    const handleDownloadValidationLog = useCallback(async () => {
        if (!fileValidationResult?.id) {
            return;
        }
        await downloadFileValidationLog(fileValidationResult.id);
    }, [downloadFileValidationLog, fileValidationResult]);

    const handleFileErrorsModalClose = useCallback(() => {
        setShowFileErrorsModal(false);
    }, [setShowFileErrorsModal]);

    const handleLocationErrorsModalClose = useCallback(() => {
        setShowLocationErrorsModal(false);
    }, [setShowLocationErrorsModal]);

    useEffect(() => {
        return () => {
            // on component unmount
            cancelUpload();
            cancelValidation();
        };
    }, [cancelUpload, cancelValidation]);

    return (
        <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="upload-csv-form-label"
                >
                    {formatMessage(
                        'create_portfolio.upload_type.import_file.title_text'
                    )}
                </Typography>
                <Tooltip
                    title={
                        fileValidationStatus ===
                        FileValidationRequestStatus.Completed
                            ? formatMessage(
                                  'create_portfolio.validation_log.no_validation_errors'
                              )
                            : ''
                    }
                    arrow
                    placement="bottom-start"
                    disableHoverListener={
                        isFileValidating ||
                        !fileValidationResult ||
                        isFileValidationLogDownloading
                    }
                >
                    <span>
                        <LoadingButton
                            variant="outlined"
                            endIcon={<Icon.Download size="1rem" />}
                            onClick={handleDownloadValidationLog}
                            data-testid="download-validation-log-button"
                            disabled={
                                isFileValidating ||
                                !fileValidationResult ||
                                isFileValidationLogDownloading ||
                                fileValidationStatus ===
                                    FileValidationRequestStatus.Completed
                            }
                            loadingPosition="end"
                            loading={isFileValidationLogDownloading}
                        >
                            {isFileValidationLogDownloading
                                ? formatMessage(
                                      'create_portfolio.validation_log.downloading'
                                  )
                                : formatMessage(
                                      'create_portfolio.validation_log.download_validation_log'
                                  )}
                        </LoadingButton>
                    </span>
                </Tooltip>
            </Box>
            <Grid
                container
                spacing={3}
                flexGrow={1}
                minHeight="17rem"
            >
                <Grid
                    xs={12}
                    data-testid="upload-csv-form"
                >
                    <FileUploader
                        onFileSelected={handleFileSelection}
                        onFileDeleted={handleFileDelete}
                        description=""
                        fileUploadingStatus={fileUploadingStatus}
                        fileValidationRequestStatus={fileValidationStatus}
                        data-testid="upload-csv-form-input-field"
                    />
                    <LocationErrorsModal
                        fileValidationResult={fileValidationResult}
                        fileValidationRequestStatus={fileValidationStatus}
                        open={showLocationErrorsModal}
                        onGoBack={handleLocationErrorsModalClose}
                        data-testid="location-error-modal"
                    />
                    <FileErrorsModal
                        open={showFileErrorsModal}
                        fileValidationResult={fileValidationResult}
                        onModalClose={handleFileErrorsModalClose}
                        data-testid="file-error-modal"
                    />
                    <Typography
                        pt={3}
                        variant="body2"
                        color="text.secondary"
                        data-testid="upload-csv-help-text"
                        sx={{ whiteSpace: 'pre-line' }}
                    >
                        {formatMessage('create_portfolio.enter_csv.help_text')}
                    </Typography>
                </Grid>
                <Grid
                    xs={12}
                    minHeight="100%"
                    position="relative"
                    data-testid="create-new-portfolio-csv-map"
                    sx={{ height: '300px' }}
                >
                    <Backdrop
                        sx={{
                            color: '#fff',
                            zIndex: 1,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        open={isLocationsLoading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <PortfolioLocationsMap
                        locations={portfolioLocations || []}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
