import {
    ChangeEvent,
    ComponentProps,
    FC,
    InputHTMLAttributes,
    useCallback,
} from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Typography,
    useTheme,
} from '@mui/material';
import { SubSection } from '../../../SubSection';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { IPortfolio } from '../../../../../../types/portfolio';
import { BenchmarkLevel } from '../../../../../../../../types';
import { BENCHMARK_LEVEL_TITLES } from '../../../../../../../../const';

interface BenchmarkingSubSectionProps extends ComponentProps<typeof Box> {}

export const BenchmarkingSubSection: FC<BenchmarkingSubSectionProps> = ({
    ...props
}) => {
    const theme = useTheme();
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { custom } = formik.values;

    const { includeBenchmarks, benchmarkLevels } = custom.scores;

    const errors = formik.errors.custom?.scores;

    const handleIncludeBenchmarksChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.scores.includeBenchmarks',
                event.target.checked
            );
        },
        [setField]
    );

    const handleBenchmarkLevelChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            const levels = new Set(benchmarkLevels);
            if (checked) {
                levels.add(event.currentTarget.value as BenchmarkLevel);
            } else {
                levels.delete(event.currentTarget.value as BenchmarkLevel);
            }
            await setField('custom.scores.benchmarkLevels', [...levels]);
        },
        [benchmarkLevels, setField]
    );

    const handleSelectAllChange = useCallback(
        async (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (checked) {
                await setField('custom.scores.benchmarkLevels', [
                    BenchmarkLevel.Country,
                    BenchmarkLevel.Admin1,
                    BenchmarkLevel.Admin2,
                ]);
            } else {
                await setField('custom.scores.benchmarkLevels', []);
            }
        },
        [setField]
    );

    const isSelectAllChecked = benchmarkLevels.length > 0;
    const isIndeterminate =
        isSelectAllChecked &&
        benchmarkLevels.length != Object.values(BenchmarkLevel).length;

    return (
        <SubSection
            {...props}
            heading={
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            checked={includeBenchmarks}
                            onChange={handleIncludeBenchmarksChange}
                        />
                    }
                    label="Include Benchmarking"
                />
            }
        >
            {includeBenchmarks && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ marginBottom: 1 }}
                    >
                        Benchmarking Options
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="secondary"
                                checked={isSelectAllChecked}
                                indeterminate={isIndeterminate}
                                onChange={handleSelectAllChange}
                            />
                        }
                        label="Select All"
                    />
                    {Object.values(BenchmarkLevel).map((benchmarkLevel) => (
                        <FormControlLabel
                            key={benchmarkLevel}
                            control={
                                <Checkbox
                                    color="secondary"
                                    data-id={benchmarkLevel}
                                    value={benchmarkLevel}
                                    checked={benchmarkLevels.includes(
                                        benchmarkLevel
                                    )}
                                    onChange={handleBenchmarkLevelChange}
                                    inputProps={
                                        {
                                            'data-id': benchmarkLevel,
                                        } as InputHTMLAttributes<HTMLInputElement>
                                    }
                                />
                            }
                            label={BENCHMARK_LEVEL_TITLES[benchmarkLevel]}
                        />
                    ))}
                    {errors?.benchmarkLevels !== undefined && (
                        <FormHelperText
                            sx={{
                                color: theme.palette.error.light,
                            }}
                        >
                            {errors?.benchmarkLevels}
                        </FormHelperText>
                    )}
                </Box>
            )}
        </SubSection>
    );
};
