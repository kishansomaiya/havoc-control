import { ConfirmModal } from '../../../../../components/ConfirmModal/ConfirmModal';
import { ComponentProps, FC, useMemo } from 'react';
import { Box } from '@mui/material';
import { getFileValidationErrors } from '../../../../../utils';
import { IFileValidationResponse } from '../../../../../types/fileValidationTypes';

interface FileErrorsModalProps extends ComponentProps<typeof Box> {
    open: boolean;
    fileValidationResult: IFileValidationResponse | undefined;
    onModalClose: () => void;
}

export const FileErrorsModal: FC<FileErrorsModalProps> = ({
    open,
    onModalClose,
    fileValidationResult,
}) => {
    const errorMessage = useMemo<string>(() => {
        if (!fileValidationResult) {
            return 'Unknown error';
        }
        const validationErrors = getFileValidationErrors(fileValidationResult);
        if (!validationErrors.length) {
            return 'Unknown error';
        }

        return validationErrors.map(({ message }) => message).join(' ');
    }, [fileValidationResult]);

    return (
        <Box>
            <ConfirmModal
                isOpen={open}
                title="File upload error"
                message={errorMessage}
                onConfirm={onModalClose}
                onCancel={onModalClose}
                confirmLabel="Go Back"
                cancelLabel=""
            />
        </Box>
    );
};
