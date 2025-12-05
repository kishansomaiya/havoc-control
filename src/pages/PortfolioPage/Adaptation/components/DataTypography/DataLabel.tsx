import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { Info } from 'react-feather';
import { FC, ReactNode } from 'react';

export interface DataLabelProps {
    text: string;
    info?: string;
    testId?: string;
    children?: ReactNode;
}

export const DataLabel: FC<DataLabelProps> = ({
    text,
    info,
    testId,
    children,
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                data-testid={testId}
            >
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                >
                    {text}
                </Typography>
                {info && (
                    <Tooltip
                        title={info}
                        placement="top"
                        arrow
                    >
                        <Box
                            component="span"
                            sx={{ display: 'inline-flex', lineHeight: 0 }}
                            color={theme.palette.text.secondary}
                        >
                            <Info size="1rem" />
                        </Box>
                    </Tooltip>
                )}
            </Box>
            {children}
        </Box>
    );
};
