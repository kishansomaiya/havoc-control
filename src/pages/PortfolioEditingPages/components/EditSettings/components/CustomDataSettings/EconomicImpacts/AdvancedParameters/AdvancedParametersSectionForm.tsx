import {
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useMemo,
} from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import {
    ECONOMIC_IMPACT_DISABLED_OPTIONS,
    FINANCIAL_BASE_YEARS,
} from '../../../../../../../../const';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { Section } from '../../../Section';
import { GridField } from '../../../GridField';
import { GridFieldSet } from '../../../GridFieldSet';
import { WorkerProductivityAndCoolingSubSectionForm } from './WorkerProductivityAndCoolingSubSectionForm';
import { WildfireLossSubSectionForm } from './WildfireLossSubSectionForm';
import { UtilitiesSubSectionForm } from './UtilitiesSubSectionForm';
import { IPortfolio } from '../../../../../../types/portfolio';
import { FormNumberTextField } from '../../../../../../../../components/Inputs/FormNumberTextField';

interface FinancialBaseYearOption {
    year: number;
}

const financialBaseYearOptions: FinancialBaseYearOption[] =
    FINANCIAL_BASE_YEARS.map((year) => ({ year }));

interface AdvancedParametersSectionFormProps
    extends ComponentProps<typeof Box> {}

export const AdvancedParametersSectionForm: FC<
    AdvancedParametersSectionFormProps
> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const { remoteWorkRatio, financialBaseYear } =
        custom.economicImpacts.advancedParameters;

    const touched = formik.touched.custom?.economicImpacts?.advancedParameters;
    const errors = formik.errors.custom?.economicImpacts?.advancedParameters;
    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];

    const remoteWorkRatioError = errors?.remoteWorkRatio;
    const isRemoteWorkRatioError =
        touched?.remoteWorkRatio && remoteWorkRatioError !== undefined;

    const {
        selectedFinancialBaseYearOption,
        handleSelectedFinancialBaseYearChange,
        handleGetFinancialBaseYearTitle,
    } = useFinancialBaseYear(financialBaseYear);

    return (
        <Section
            {...props}
            title="Advanced Parameters"
        >
            <GridFieldSet>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.advancedParameters.remoteWorkRatio"
                        label="Remote Work Ratio"
                        placeholder="Enter Value"
                        value={remoteWorkRatio}
                        setField={setField}
                        fullWidth
                        error={isRemoteWorkRatioError}
                        helperText={
                            isRemoteWorkRatioError
                                ? remoteWorkRatioError
                                : 'Set to 0 if all work must be performed at the asset, 1 if all work can be performed remotely, or somewhere in between. Leave blank to have a ratio assigned'
                        }
                        disabled={disabled.remoteWorkRatio}
                    />
                </GridField>
                <GridField>
                    <Autocomplete
                        options={financialBaseYearOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedFinancialBaseYearOption}
                        onChange={handleSelectedFinancialBaseYearChange}
                        getOptionKey={handleGetFinancialBaseYearTitle}
                        getOptionLabel={handleGetFinancialBaseYearTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Financial Base Year"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                                helperText="The calendar year used as the starting reference point for the financial module projections"
                            />
                        )}
                        fullWidth
                        disabled={disabled.financialBaseYear}
                    />
                </GridField>
            </GridFieldSet>
            <WorkerProductivityAndCoolingSubSectionForm />
            <WildfireLossSubSectionForm />
            <UtilitiesSubSectionForm />
        </Section>
    );
};

function useFinancialBaseYear(financialBaseYear?: number) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    const selectedFinancialBaseYearOption = useMemo(
        () =>
            financialBaseYearOptions.find(
                (option) => option.year === financialBaseYear
            ) ?? financialBaseYearOptions[0],
        [financialBaseYear]
    );

    const handleSelectedFinancialBaseYearChange = useCallback(
        async (
            _event: SyntheticEvent,
            newValue: FinancialBaseYearOption | null
        ) => {
            const year = newValue?.year;
            if (year) {
                await setField(
                    'custom.economicImpacts.advancedParameters.financialBaseYear',
                    year
                );
            }
        },
        [setField]
    );

    const handleGetFinancialBaseYearTitle = useCallback(
        (option: FinancialBaseYearOption) => {
            return String(option.year);
        },
        []
    );

    return {
        selectedFinancialBaseYearOption,
        handleSelectedFinancialBaseYearChange,
        handleGetFinancialBaseYearTitle,
    };
}
