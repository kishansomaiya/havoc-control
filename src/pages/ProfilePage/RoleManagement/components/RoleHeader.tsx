import { LoadingButton } from '@mui/lab';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import * as Icon from 'react-feather';

interface HeaderButtonProps {
    label: string;
    variant: 'outlined' | 'contained';
    testId: string;
    onClick: () => void;
    btnStyles?: React.CSSProperties;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
    disabled?: boolean;
    isLoading?: boolean;
    tooltip?: string | ReactNode;
}

interface RoleHeaderProps {
    title: string;
    buttons: HeaderButtonProps[];
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({ title, buttons }) => {
    const theme = useTheme();
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={'100%'}
        >
            <Box
                display="flex"
                gap={1}
                alignItems="end"
            >
                <Typography
                    variant="h3"
                    sx={{
                        textTransform: 'uppercase',
                        lineHeight: '160%',
                        letterSpacing: '0.025rem',
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Box
                display="flex"
                gap={1}
                alignItems="end"
            >
                {buttons.map((button, index) => (
                    <Tooltip
                        title={button.tooltip}
                        arrow
                        placement="top"
                    >
                        <span>
                            <LoadingButton
                                key={index}
                                variant={button.variant}
                                data-testid={button.testId}
                                color={button.color || 'primary'}
                                sx={{ width: '105px', ...button.btnStyles }}
                                onClick={button.onClick}
                                disabled={button.disabled}
                                loading={button.isLoading}
                            >
                                {button.label}
                                {button.tooltip && (
                                    <Icon.Info
                                        size="1rem"
                                        color={theme.palette.text.secondary}
                                    />
                                )}
                            </LoadingButton>
                        </span>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
};
