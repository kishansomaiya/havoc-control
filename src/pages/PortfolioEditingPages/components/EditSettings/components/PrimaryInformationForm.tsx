import {
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useMemo,
} from 'react';
import {
    Autocomplete,
    AutocompleteChangeReason,
    AutocompleteValue,
    Box,
    createFilterOptions,
    FilterOptionsState,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { useFormikContextHelpers } from '../../../../../hooks/useFormikContextHelpers';
import { DataVersion, getEIToDataVersionMap } from '../../../../../types';
import { useCategoriesQuery } from '../../../../../api/queries/categoriesQuery';
import { useCreateCategoryMutation } from '../../../../../api/mutations/categoriesMutation';
import {
    defaultCustomAnalysisData,
    IPortfolio,
} from '../../../types/portfolio';
import { MAX_LIST_API_LIMIT } from '../../../../../const';
import { useAuth0 } from '@auth0/auth0-react';
import {
    checkIsUserCanAccessEI_3_1_1,
    isDisclosureAllowedDataVersion,
} from '../../../../../utils';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';
import { useFeatureFlags } from '../../../../../featureFlags/useFeatureFlags';
import { FeatureFlags } from '../../../../../featureFlags/featureFlags';

interface IOption {
    id?: string;
    label: string;
    inputValue?: string;
}

interface PrimaryInformationFormProps extends ComponentProps<typeof Box> {
    isDataVersionEnabled?: boolean;
    isRunDisclosureEnabled?: boolean;
    isRunAdaptationOpportunitiesAnalysisEnabled?: boolean;
    isMockPortfolio?: boolean;
}

const filter = createFilterOptions<IOption>();

export const PrimaryInformationForm: FC<PrimaryInformationFormProps> = ({
    isDataVersionEnabled = true,
    isRunDisclosureEnabled = true,
    isRunAdaptationOpportunitiesAnalysisEnabled = true,
    isMockPortfolio = false,
    ...props
}) => {
    const { user } = useAuth0();

    const formik = useFormikContextHelpers<IPortfolio>();
    const { data330Enabled } = useFeatureFlags<FeatureFlags>([
        'data330Enabled',
    ]);
    const { setFields, handleChange } = formik;
    const formatMessage = useFormatMessage();

    const { categories, reFetchCategories, isCategoriesLoading } =
        useCategoriesQuery({
            limit: MAX_LIST_API_LIMIT,
        });
    const { createCategory, isCategoryCreating } = useCreateCategoryMutation();

    const categoriesOptions = useMemo<IOption[]>(
        () =>
            categories.map(({ id, name }) => ({
                id,
                label: name,
            })),
        [categories]
    );

    const eiVersionsByDataVersion = useMemo(
        () => getEIToDataVersionMap(checkIsUserCanAccessEI_3_1_1(user)),
        [user]
    );

    const filterOptions = useCallback(
        (
            options: Array<string | IOption>,
            params: FilterOptionsState<string | IOption>
        ) => {
            const filtered = filter(options as IOption[], params);

            const { inputValue } = params;
            const categoryName = inputValue.trim();
            const isExisting = (options as IOption[]).some(
                (option) => categoryName === option.label
            );
            if (categoryName !== '' && !isExisting) {
                filtered.push({
                    label: `Add "${categoryName}"`,
                    inputValue: categoryName,
                });
            }

            return filtered;
        },
        []
    );

    const getOptionKey = useCallback((option: string | IOption) => {
        if (typeof option === 'string') {
            return option;
        }

        if (option.id) {
            return option.id;
        }

        return option.label;
    }, []);

    const handleCategoryChange = useCallback(
        async (
            event: SyntheticEvent,
            newValue: AutocompleteValue<IOption, false, false, true>,
            reason: AutocompleteChangeReason
        ) => {
            if (typeof newValue === 'string') {
                if (reason === 'createOption') {
                    const result = await createCategory(newValue);
                    await reFetchCategories();
                    handleChange({
                        ...event,
                        target: {
                            ...event.target,
                            name: 'category',
                            value: {
                                id: result.id,
                                label: result.name,
                            },
                        },
                    });
                }

                return;
            }

            if (newValue && newValue.inputValue) {
                const result = await createCategory(newValue.inputValue);
                await reFetchCategories();
                handleChange({
                    ...event,
                    target: {
                        ...event.target,
                        name: 'category',
                        value: {
                            id: result.id,
                            label: result.name,
                        },
                    },
                });

                return;
            }

            handleChange({
                ...event,
                target: {
                    ...event.target,
                    name: 'category',
                    value: newValue,
                },
            });
        },
        [createCategory, reFetchCategories, handleChange]
    );

    const handleDataVersionChange = useCallback(
        async (event: SelectChangeEvent<DataVersion>) => {
            const dataVersion = event.target.value as DataVersion;
            const eiVersion = eiVersionsByDataVersion[dataVersion][0];
            const custom = defaultCustomAnalysisData(dataVersion);
            await setFields({
                dataVersion,
                eiVersion,
                custom,
            });
        },
        [setFields, eiVersionsByDataVersion]
    );

    return (
        <Box
            {...props}
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
            }}
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="edit-settings-portfolio-information-label"
            >
                {formatMessage(
                    'create_portfolio.edit_settings.primary_information'
                )}
            </Typography>
            <TextField
                id="name"
                label="Portfolio Name"
                placeholder="Enter Portfolio Name"
                fullWidth
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                    formik.touched.name && Boolean(formik.errors.name)
                        ? formik.errors.name
                        : ''
                }
                disabled={isMockPortfolio}
                data-testid="edit-settings-portfolio-name"
            />
            <Autocomplete
                value={formik.values.category}
                onChange={handleCategoryChange}
                onBlur={formik.handleBlur}
                filterOptions={filterOptions}
                getOptionKey={getOptionKey}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="category"
                options={categoriesOptions}
                freeSolo
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Category"
                        placeholder="i.e. Scores, Economic Impact"
                        fullWidth
                        error={
                            formik.touched.category &&
                            Boolean(formik.errors.category)
                        }
                        helperText={
                            formik.touched.category &&
                            'Assign a keyword to this portfolio and search by it later'
                        }
                    />
                )}
                fullWidth
                disabled={isCategoryCreating || isCategoriesLoading}
                loading={isCategoryCreating || isCategoriesLoading}
            />

            <FormControl fullWidth>
                <InputLabel>Data Version</InputLabel>
                <Select
                    id="dataVersion"
                    name="dataVersion"
                    label="Data Version"
                    value={formik.values.dataVersion}
                    onChange={handleDataVersionChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.dataVersion &&
                        Boolean(formik.errors.dataVersion)
                    }
                    fullWidth
                    disabled={!isDataVersionEnabled}
                    data-testid="edit-settings-data-version"
                >
                    {Object.values(DataVersion).map(
                        (dataVersion) =>
                            dataVersion !== DataVersion.v2_6_2 &&
                            (dataVersion !== DataVersion.v3_0_0 ||
                                !data330Enabled) &&
                            (dataVersion !== DataVersion.v3_3_0 ||
                                data330Enabled) && (
                                <MenuItem
                                    key={dataVersion}
                                    value={dataVersion}
                                    disabled={
                                        formik.values.runDisclosureAnalysis &&
                                        !isDisclosureAllowedDataVersion(
                                            dataVersion
                                        )
                                    }
                                >
                                    {dataVersion}
                                </MenuItem>
                            )
                    )}
                </Select>
            </FormControl>
        </Box>
    );
};
