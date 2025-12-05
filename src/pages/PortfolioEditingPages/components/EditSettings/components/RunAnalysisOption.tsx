import { FC, useCallback } from 'react';
import { Box, Checkbox, Tooltip, Typography } from '@mui/material';

export interface RunAnalysisOptionProps {
    isSelected: boolean;
    onChange: (bool: boolean) => void;
    title: string;
    description: string;
    disabled?: boolean;
    testId?: string;
    disabledTooltip?: string;
}

export const RunAnalysisOption: FC<RunAnalysisOptionProps> = ({
    isSelected,
    onChange,
    title,
    description,
    testId,
    disabled = false,
    disabledTooltip,
}) => {
    const handleChange = useCallback(() => {
        if (disabled) {
            return;
        }
        onChange(!isSelected);
    }, [disabled, isSelected, onChange]);

    return (
        <Tooltip
            title={disabled ? disabledTooltip : undefined}
            placement="top-start"
            arrow
            disableHoverListener={!disabled}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                    cursor: 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    marginTop: '-0.5rem',
                }}
                onClick={handleChange}
                data-testid={testId ? `${testId}` : 'run-analysis-option'}
            >
                <Checkbox
                    checked={isSelected}
                    onChange={handleChange}
                    name="checkbox"
                    color="secondary"
                    inputProps={{ 'aria-label': title }}
                    sx={{
                        padding: '0.5rem',
                    }}
                    size="small"
                    data-testid={
                        testId
                            ? `${testId}-checkbox`
                            : 'run-analysis-option-checkbox'
                    }
                />

                <Box
                    pt={1}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        alignItems: 'flex-start',
                    }}
                >
                    <Typography
                        variant="h3"
                        color="common.white"
                        data-testid={
                            testId
                                ? `${testId}-title`
                                : 'run-analysis-option-title'
                        }
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid={
                            testId
                                ? `${testId}-description`
                                : 'run-analysis-option-description'
                        }
                    >
                        {description}
                    </Typography>
                </Box>
            </Box>
        </Tooltip>
    );
};
