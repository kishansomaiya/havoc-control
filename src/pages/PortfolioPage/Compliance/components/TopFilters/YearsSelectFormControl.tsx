import {
    Box,
    Checkbox,
    Chip,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Tooltip,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import * as Icon from 'react-feather';

interface Props {
    years: number[];
    initialValue: number[];
    onYearsChange: (years: number[]) => void;
}

export const YearsSelectFormControl: FC<Props> = ({
    years,
    initialValue,
    onYearsChange,
}) => {
    const [selectedYears, setSelectedYears] = useState<number[]>([]);

    useEffect(() => {
        setSelectedYears(initialValue);
    }, [initialValue]);

    const handleChange = useCallback(
        (event: SelectChangeEvent<typeof selectedYears>) => {
            const {
                target: { value },
            } = event;

            if (typeof value === 'string') {
                return;
            }

            setSelectedYears(value);
        },
        []
    );

    const handleDelete = useCallback(
        (removedYear: number) => {
            if (selectedYears.length === 1) {
                return;
            }

            const updatedYears = selectedYears.filter(
                (year) => year !== removedYear
            );
            onYearsChange(updatedYears);
        },
        [selectedYears, onYearsChange]
    );

    const handleClose = useCallback(() => {
        onYearsChange(selectedYears);
    }, [selectedYears, onYearsChange]);

    return (
        <FormControl
            fullWidth
            data-testid="compliance-filters-year"
        >
            <InputLabel
                id="years-multiple-checkbox-label"
                data-testid="compliance-filters-year-label"
                >
                    Year
            </InputLabel>
            <Select
                labelId="years-multiple-checkbox-label"
                id="years-multiple-checkbox"
                data-testid="compliance-filters-year-multiselect"
                multiple
                value={selectedYears}
                onChange={handleChange}
                onClose={handleClose}
                input={
                    <OutlinedInput
                        label="Tag"
                        sx={{ paddingY: '0.35rem' }}
                    />
                }
                renderValue={(selected: number[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected
                            .sort((a, b) => (a > b ? 1 : -1))
                            .map((value) => (
                                <Chip
                                    data-testid="compliance-filters-year-chip"
                                    key={value}
                                    label={value}
                                    onDelete={() => handleDelete(value)}
                                    disabled={selectedYears.length === 1}
                                    deleteIcon={
                                        <Icon.X
                                            data-testid="compliance-filters-year-chip-x-icon"
                                            color="white"
                                            size="1rem"
                                            strokeWidth={1}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                        />
                                    }
                                />
                            ))}
                    </Box>
                )}
            >
                <MenuItem 
                    disabled
                    data-testid="compliance-filters-year-list-label"
                    >
                        Select up to 3
                </MenuItem>
                {years.map((year) => (
                    <MenuItem
                        data-testid="compliance-filters-year-list-option"
                        key={year}
                        value={year}
                        disabled={
                            (!selectedYears.includes(year) &&
                                selectedYears.length >= 3) ||
                            (selectedYears.includes(year) &&
                                selectedYears.length === 1)
                        }
                        sx={{ py: 0, px: 1 }}
                    >
                        <Checkbox
                            data-testid="compliance-filters-year-list-option-checkbox"
                            color="secondary"
                            checked={selectedYears.includes(year)}
                        />
                        <ListItemText
                            primary={year}
                            data-testid="compliance-filters-year-list-option-value"
                        />
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                <Box
                    data-testid="compliance-filters-year-helptext"
                    display="inline"
                    component="span"
                    pr={0.5}
                >
                    Regulations require 3 time-horizons
                </Box>
                <Tooltip
                    data-testid="compliance-filters-year-helptext-tooltip"
                    title="Regulations require reports to define 3 years; a short-term, medium-term, and long-term time-horizon."
                    arrow
                    placement="bottom-end"
                >
                    <Icon.Info
                        style={{ verticalAlign: 'middle' }}
                        size="0.75rem"
                        // color={
                        //     theme.palette.text
                        //         .secondary
                        // }
                    />
                </Tooltip>
            </FormHelperText>
        </FormControl>
    );
};
