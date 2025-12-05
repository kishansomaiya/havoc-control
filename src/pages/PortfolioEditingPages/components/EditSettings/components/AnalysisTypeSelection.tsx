import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { AnalysisTypeItem } from './AnalysisTypeItem';
import { AnalysisType } from '../../../types/analysisTypeEnum';
import { ANALYSIS_TYPE_ITEMS } from '../../../const/analysisType';
import { useFormikContextHelpers } from '../../../../../hooks/useFormikContextHelpers';
import { IPortfolio } from '../../../types/portfolio';

interface AnalysisTypeSelectionProps extends ComponentProps<typeof Box> {
    type: AnalysisType;
    onTypeChange: (type: AnalysisType) => void;
    showChangeTypeOption: boolean;
    changeType: boolean;
    onChangeTypeChange: (changeType: boolean) => void;
}

export const AnalysisTypeSelection: FC<AnalysisTypeSelectionProps> = ({
    type,
    onTypeChange,
    showChangeTypeOption,
    changeType,
    onChangeTypeChange,
    ...props
}) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const handleChangeTypeChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChangeTypeChange(event.target.checked);
        },
        [onChangeTypeChange]
    );

    const isEnabled = !showChangeTypeOption || changeType;
    const disableCustomAnalysis =
        formik.values.runDisclosureAnalysis ||
        formik.values.runAdaptationOpportunitiesAnalysis;

    const changeAnalysisTypeCheckBox = showChangeTypeOption ? (
        <FormControlLabel
            control={
                <Checkbox
                    color="secondary"
                    checked={changeType}
                    onChange={handleChangeTypeChange}
                />
            }
            label="Change Analysis Type"
            data-testid="change-analysis-type-checkbox"
        />
    ) : null;

    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
            }}
            {...props}
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="analysis-type-label"
            >
                Analysis type
            </Typography>

            {changeAnalysisTypeCheckBox}

            {ANALYSIS_TYPE_ITEMS.map((item) => (
                <AnalysisTypeItem
                    {...item}
                    key={item.type}
                    isSelected={isEnabled && type === item.type}
                    handleSelect={onTypeChange}
                    disabled={
                        !isEnabled ||
                        (item.type === AnalysisType.Custom &&
                            disableCustomAnalysis)
                    }
                />
            ))}
        </Box>
    );
};
