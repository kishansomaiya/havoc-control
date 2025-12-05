import { CSSProperties, FC, useCallback } from 'react';
import {
    Box,
    Radio,
    Typography,
    Tooltip,
    FormHelperText,
    useTheme,
} from '@mui/material';
import * as Icon from 'react-feather';

interface DownloadSLRSelectionProps {
    name: string;
    value: string;
    label: string;
    isSelected: boolean;
    onChange: (name: string, value: string) => void;
    disabled?: boolean;
    tooltip?: string;
    helperText?: string;
    styles?: CSSProperties;
}

export const DownloadSLRSelection: FC<DownloadSLRSelectionProps> = ({
    name,
    value,
    label,
    isSelected,
    onChange,
    disabled = false,
    tooltip,
    helperText,
    styles,
}) => {
    const theme = useTheme();

    const handleClick = useCallback(() => {
        if (disabled) {
            return;
        }
        onChange(name, value);
    }, [onChange, name, value, disabled]);

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            onClick={handleClick}
            sx={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...styles,
            }}
        >
            <Radio
                checked={isSelected}
                disabled={disabled}
                onChange={handleClick}
                value={value}
                name={name}
                color="secondary"
                inputProps={{ 'aria-label': value }}
                sx={{
                    padding: '0.5rem',
                }}
                size="small"
                data-testid="download-slr-modal-radio-button"
            />

            <Box
                display="flex"
                flexDirection="column"
            >
                <Typography
                    variant="body1"
                    sx={{
                        paddingTop: helperText ? '0.75rem' : 0,
                    }}
                    data-testid="download-slr-modal-radio-button-name"
                >
                    {label}
                </Typography>
                {helperText && (
                    <FormHelperText
                        data-testid="download-slr-modal-radio-button-helptext"
                        sx={{ margin: 0, color: theme.palette.grey['300'] }}
                    >
                        {helperText}
                    </FormHelperText>
                )}
            </Box>

            {disabled && tooltip && (
                <Tooltip
                    placement="top"
                    title={tooltip}
                >
                    <Icon.Info
                        size="1rem"
                        color={theme.palette.text.secondary}
                        data-testid="download-slr-modal-radio-button-tooltip"
                    />
                </Tooltip>
            )}
        </Box>
    );
};
