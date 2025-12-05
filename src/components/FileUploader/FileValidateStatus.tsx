import { FC, useMemo } from 'react';
import { FileValidationRequestStatus } from '../../types';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { FILE_VALIDATION_STATUS_TITLES } from '../../const/fileStatusTitles';
import * as Icon from 'react-feather';

const BoxProps = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
};
export const FileValidateStatus: FC<{
    status: FileValidationRequestStatus;
}> = ({ status }) => {
    const theme = useTheme();
    const statusTitle = useMemo(() => {
        return FILE_VALIDATION_STATUS_TITLES[status];
    }, [status]);

    switch (status) {
        case FileValidationRequestStatus.Validating:
            return (
                <Box {...BoxProps}>
                    <CircularProgress
                        size="0.875rem"
                        color="secondary"
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {statusTitle}
                    </Typography>
                </Box>
            );
        case FileValidationRequestStatus.Error:
            return (
                <Box {...BoxProps}>
                    <Icon.AlertTriangle
                        size="0.875rem"
                        color={theme.palette.error.main}
                    />
                    <Typography
                        variant="body2"
                        color="error"
                    >
                        {statusTitle}
                    </Typography>
                </Box>
            );
        case FileValidationRequestStatus.Completed:
            return (
                <Box {...BoxProps}>
                    <Icon.CheckCircle
                        size="0.875rem"
                        color={theme.palette.success.main}
                    />
                    <Typography
                        variant="body2"
                        color="success.main"
                    >
                        {statusTitle}
                    </Typography>
                </Box>
            );
        case FileValidationRequestStatus.CompletedWithWarningsAndErrors:
        case FileValidationRequestStatus.CompletedWithWarnings:
        case FileValidationRequestStatus.CompletedWithErrors:
            return (
                <Box {...BoxProps}>
                    <Icon.AlertTriangle
                        size="0.875rem"
                        color={theme.palette.warning.main}
                    />
                    <Typography
                        variant="body2"
                        color="warning.main"
                    >
                        {statusTitle}
                    </Typography>
                </Box>
            );
        default:
            return (
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {status}
                </Typography>
            );
    }
};
