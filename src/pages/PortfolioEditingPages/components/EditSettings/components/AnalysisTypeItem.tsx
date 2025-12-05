import { ComponentProps, FC, useCallback } from 'react';
import { Box, Radio, Typography } from '@mui/material';
import { AnalysisType } from '../../../types/analysisTypeEnum';

interface AnalysisTypeItemProps extends ComponentProps<typeof Box> {
    type: AnalysisType;
    isSelected: boolean;
    handleSelect: (type: AnalysisType) => void;
    title: string;
    description: string;
    disabled?: boolean;
}

export const AnalysisTypeItem: FC<AnalysisTypeItemProps> = ({
    type,
    isSelected,
    handleSelect,
    title,
    description,
    disabled = false,
}) => {
    const handleChange = useCallback(() => {
        if (disabled) {
            return;
        }
        handleSelect(type);
    }, [disabled, handleSelect, type]);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
                alignSelf: 'stretch',
                cursor: 'pointer',
                opacity: disabled ? 0.5 : 1,
            }}
            onClick={handleChange}
            data-testid="analysis-type"
        >
            <Radio
                checked={isSelected}
                onChange={handleChange}
                name="radio-buttons"
                color="secondary"
                inputProps={{ 'aria-label': title }}
                sx={{
                    padding: '0.5rem',
                }}
                size="small"
                data-testid="analysis-type-radio-buttons"
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
                    data-testid="analysis-type-radio-button-title"
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    data-testid="analysis-type-radio-button-description"
                >
                    {description}
                </Typography>
            </Box>
        </Box>
    );
};
