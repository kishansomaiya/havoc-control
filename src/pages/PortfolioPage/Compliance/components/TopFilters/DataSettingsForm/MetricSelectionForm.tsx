import {
    FC,
    InputHTMLAttributes,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { EUHazardMetadataWithId } from '../../../../../../hooks/useClimateRelatedHazardCategories';

interface Props {
    euMetrics: EUHazardMetadataWithId[];
    disabled?: boolean;
    onMetricSelectionChange: (metricIds: string[]) => void;
    selectedEUMetrics: string[];
}
export const MetricSelectionForm: FC<Props> = ({
    euMetrics,
    disabled = false,
    onMetricSelectionChange,
    selectedEUMetrics,
}) => {
    const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>([]);
    const notExcludedMetrics = useMemo(() => {
        return euMetrics.filter(({ show }) => show);
    }, [euMetrics]);
    const allMetricIds = useMemo(
        () => notExcludedMetrics.map(({ id }) => id),
        [notExcludedMetrics]
    );

    useEffect(() => {
        const metricIds = selectedEUMetrics.filter((id) =>
            allMetricIds.includes(id)
        );
        setSelectedMetricIds(metricIds);
    }, [selectedEUMetrics, allMetricIds]);

    const isSelectAllChecked = selectedMetricIds.length > 0;
    const isIndeterminate =
        isSelectAllChecked && selectedMetricIds.length != allMetricIds.length;

    const handleMetricSelectionChange = useCallback(
        (metric: EUHazardMetadataWithId, selected: boolean) => {
            const updatedMetricIds = selected
                ? [...selectedMetricIds, metric.id]
                : selectedMetricIds.filter((id) => id !== metric.id);
            setSelectedMetricIds(updatedMetricIds);
            onMetricSelectionChange(updatedMetricIds);
        },
        [selectedMetricIds, onMetricSelectionChange]
    );

    const handleSelectAllChange = useCallback(() => {
        const updatedMetricIds =
            selectedMetricIds.length === allMetricIds.length
                ? []
                : allMetricIds;
        setSelectedMetricIds(updatedMetricIds);
        onMetricSelectionChange(updatedMetricIds);
    }, [selectedMetricIds, allMetricIds, onMetricSelectionChange]);

    return (
        <Box>
            <Box>
                <FormControlLabel
                    data-testid="data-settings-modal-checkbox-select-all"
                    control={
                        <Checkbox
                            data-testid="data-settings-modal-checkbox-select-all-button"
                            color="secondary"
                            disabled={disabled}
                            checked={isSelectAllChecked}
                            indeterminate={isIndeterminate}
                            onChange={handleSelectAllChange}
                        />
                    }
                    label="Select all"
                />
            </Box>
            {notExcludedMetrics.map((metric) => (
                <Box
                    data-testid="data-settings-modal-checkbox"
                    key={metric.id}
                >
                    <FormControlLabel
                        data-testid="data-settings-modal-checkbox-label"
                        key={metric.id}
                        control={
                            <Checkbox
                                data-testid="data-settings-modal-checkbox-button"
                                color="secondary"
                                data-id={metric.id}
                                value={metric.id}
                                disabled={disabled}
                                checked={selectedMetricIds.includes(metric.id)}
                                onChange={(_, checked) =>
                                    handleMetricSelectionChange(metric, checked)
                                }
                                inputProps={
                                    {
                                        'data-id': metric.id,
                                    } as InputHTMLAttributes<HTMLInputElement>
                                }
                            />
                        }
                        label={metric.title}
                    />
                </Box>
            ))}
        </Box>
    );
};
