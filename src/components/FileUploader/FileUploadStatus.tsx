import { FC, useMemo } from 'react';
import { FileUploadingStatus } from '../../types';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { FILE_UPLOADING_STATUS_TITLES } from '../../const/fileStatusTitles';
import * as Icon from 'react-feather';

const BoxProps = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
};
export const FileUploadStatus: FC<{ status: FileUploadingStatus }> = ({
    status,
}) => {
    const theme = useTheme();
    const statusTitle = useMemo(() => {
        return FILE_UPLOADING_STATUS_TITLES[status];
    }, [status]);

    switch (status) {
        case FileUploadingStatus.Uploading:
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
        case FileUploadingStatus.Error:
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
        case FileUploadingStatus.Completed:
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
