import { Box, IconButton, Link, Typography, useTheme } from '@mui/material';
import {
    ChangeEvent,
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useState,
} from 'react';
import * as Icon from 'react-feather';
import { fileSizeFormatter } from '../../utils';
import { FileUploadingStatus, FileValidationRequestStatus } from '../../types';
import { FileUploadStatus } from './FileUploadStatus';
import { FileValidateStatus } from './FileValidateStatus';

interface FileUploaderProps extends ComponentProps<typeof Box> {
    allowedFileExtensions?: string[];
    allowedFileTypes?: string[];
    description?: string;
    onFileSelected?: (file: File | null) => void;
    onFileDeleted?: () => void;
    fileUploadingStatus?: FileUploadingStatus;
    fileValidationRequestStatus?: FileValidationRequestStatus;
}

export const FileUploader: FC<FileUploaderProps> = ({
    allowedFileExtensions = ['.csv'],
    allowedFileTypes = ['text/csv'],
    description = '',
    onFileSelected,
    onFileDeleted,
    fileUploadingStatus = FileUploadingStatus.Uploading,
    fileValidationRequestStatus = FileValidationRequestStatus.NotStarted,
    ...props
}) => {
    const theme = useTheme();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (!onFileSelected) {
            return;
        }
        onFileSelected(selectedFile);
    }, [selectedFile, onFileSelected]);

    const handleFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file: File | undefined = event.target.files?.[0];
            if (!file) {
                // file was not selected
                return;
            }

            if (
                !!allowedFileTypes.length &&
                !allowedFileTypes.includes(file.type) &&
                !file.name.endsWith('.csv')
            ) {
                // wrong file type
                event.target.value = '';
                return;
            }

            setSelectedFile(file);
        },
        [allowedFileTypes]
    );

    const handleFileReset = useCallback(() => {
        if (onFileDeleted) {
            onFileDeleted();
        }
        setSelectedFile(null);
    }, [onFileDeleted]);

    return (
        <Box {...props}>
            {!selectedFile && (
                <Box
                    width="100%"
                    p={4}
                    sx={{
                        borderWidth: '0.0625rem',
                        borderStyle: 'dashed',
                        borderColor: 'grey.500',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        position: 'relative',
                    }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Icon.FilePlus
                        size="1.5rem"
                        color={theme.palette.secondary.main}
                        data-testid="upload-file-input-icon"
                    />
                    <Typography
                        variant="h6"
                        pt={2}
                        pb={1}
                    >
                        <Link
                            className="MuiLink-secondary"
                            color="secondary"
                            data-testid="upload-file-input-text"
                        >
                            Upload file
                        </Link>
                        &nbsp;or drag and drop
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {description}
                    </Typography>
                    <input
                        type="file"
                        id="file-input"
                        data-testid="upload-file-input"
                        accept={allowedFileExtensions.join(',')}
                        onChange={handleFileChange}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            top: 0,
                            zIndex: 1,
                            opacity: 0,
                            cursor: 'pointer',
                        }}
                    />
                </Box>
            )}
            {selectedFile && (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        gap={1}
                        alignItems="center"
                    >
                        <Icon.File
                            size="1.5rem"
                            color={theme.palette.secondary.main}
                            data-testid="file-icon"
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            data-testid="selected-file-info"
                        >
                            <Typography
                                variant="body1"
                                data-testid="selected-file-name"
                            >
                                {selectedFile.name}
                            </Typography>
                            <Box
                                display="flex"
                                flexDirection="row"
                                gap={1}
                                alignItems="center"
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    data-testid="selected-file-size"
                                >
                                    {fileSizeFormatter(selectedFile.size)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {'•'}
                                </Typography>
                                <Typography data-testid="file-upload-status">
                                    <FileUploadStatus
                                        status={fileUploadingStatus}
                                    />
                                </Typography>
                                {fileValidationRequestStatus !==
                                    FileValidationRequestStatus.NotStarted && (
                                    <>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {'•'}
                                        </Typography>
                                        <Typography data-testid="file-validation-status">
                                            <FileValidateStatus
                                                status={
                                                    fileValidationRequestStatus
                                                }
                                            />
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <IconButton
                            aria-label="delete"
                            color="primary"
                            onClick={handleFileReset}
                            title="Remove selected file"
                            data-testid="upload-csv-form-delete-icon"
                        >
                            <Icon.Trash size="1.25rem" />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
