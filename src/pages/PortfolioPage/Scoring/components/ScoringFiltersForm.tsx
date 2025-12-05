import Grid from '@mui/material/Unstable_Grid2';
import { ScoreSwitcher } from '../../../../components/ScoreSwitcher/ScoreSwitcher';
import { Box, Divider, FormControl } from '@mui/material';
import { BenchmarkLevel, Score } from '../../../../types';
import { ComponentProps, FC, useEffect, useMemo, useState } from 'react';
import {
    ScoresResultSetOptions,
    ScoresResultSetOptionsPerilsEnum,
} from '../../../../api/openapi/auto-generated';
import { useSearchParams } from 'react-router-dom';
import { FormikProvider, useFormik } from 'formik';
import { BenchmarkLevelSelectFormControl } from '../../../../components/FormControls/BenchmarkLevelSelectFormControl';
import { FormikValuesChangeListener } from '../../../../components/Formik/FormikValuesChangeListener';

export interface ScoringFilterValues {
    peril?: Score | '';
    benchmarkLevel: BenchmarkLevel | '';
}

const initialFormValues: ScoringFilterValues = {
    peril: '',
    benchmarkLevel: '',
};

const SCORES = [
    Score.All,
    Score.Flood,
    Score.Wind,
    Score.Fire,
    Score.Heat,
    Score.Precipitation,
    Score.Cold,
    Score.Drought,
    Score.Hail,
];

interface ScoringFiltersFormProps extends ComponentProps<typeof FormControl> {
    resultSetOptions: ScoresResultSetOptions;
    onFiltersChange: (values: { [key: string]: string | number }) => void;
    urlFilterParams: ScoringFilterValues;
}

export const ScoringFiltersForm: FC<ScoringFiltersFormProps> = ({
    resultSetOptions,
    onFiltersChange,
    urlFilterParams,
}) => {
    const [searchParams] = useSearchParams();
    const [selectedScore, setSelectedScore] = useState<Score>(
        (searchParams.get('peril') as Score) || Score.All
    );

    const scoringFiltersForm = useFormik<ScoringFilterValues>({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = scoringFiltersForm;

    useEffect(() => {
        setFieldValue('peril', selectedScore);
    }, [setFieldValue, selectedScore]);

    useEffect(() => {
        const { peril, benchmarkLevel } = urlFilterParams;
        if (peril) {
            setFieldValue('peril', peril);
        }
        if (benchmarkLevel) {
            setFieldValue('benchmarkLevel', benchmarkLevel);
        }
    }, [urlFilterParams, setFieldValue]);

    const disabledScores = useMemo(() => {
        return SCORES.filter((score) => {
            return !resultSetOptions?.perils?.includes(
                score as ScoresResultSetOptionsPerilsEnum
            );
        });
    }, [resultSetOptions]);

    useEffect(() => {
        if (!disabledScores.includes(selectedScore)) {
            return;
        }

        const enabledScores = SCORES.filter(
            (score) => !disabledScores.includes(score)
        );
        setSelectedScore(enabledScores[0]);
    }, [disabledScores, selectedScore]);

    return (
        <FormikProvider value={scoringFiltersForm}>
            <Grid container>
                <Grid
                    xs={6}
                    px={4}
                    py={2}
                    data-testid="scoring-score-switcher"
                >
                    <ScoreSwitcher
                        fullWidth
                        scores={SCORES}
                        disabledScores={disabledScores}
                        selectedScore={selectedScore}
                        onSelectScore={setSelectedScore}
                    />
                </Grid>
                <Grid xs={0}>
                    <Divider orientation="vertical" />
                </Grid>
                <Grid
                    xs={6}
                    px={4}
                    py={2}
                >
                    <Box width="100%">
                        <Grid
                            container
                            justifyContent="end"
                        >
                            <Grid
                                xs={4}
                                data-testid="scoring-filter-score-type"
                            >
                                <BenchmarkLevelSelectFormControl
                                    resultSetOptions={resultSetOptions}
                                    initialValue={
                                        initialFormValues.benchmarkLevel
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <FormikValuesChangeListener
                values={scoringFiltersForm.values}
                onValuesChange={onFiltersChange}
            />
        </FormikProvider>
    );
};
