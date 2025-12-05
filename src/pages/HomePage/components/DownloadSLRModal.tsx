import {
    ChangeEvent,
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
    IPortfolioItem,
    Scenario,
} from '../../../types';
import { useFormik } from 'formik';
import { DownloadOption } from '../types/downloadOptionEnum';
import { DownloadSLRSelection } from './DownloadSLRSelection';
import {
    getDisclosureResultSet,
    getEconomicImpactsResultSet,
    getEIResultSetWithFinancialMetrics,
    getPerilsResultSet,
    getScoresResultSet,
} from '../../../utils';
import {
    CreateSingleLocationReportInput,
    DamagesResultSetOptions,
    JupiterTemplateColorCoding,
    JupiterTemplateScenario,
    JupiterTemplateType,
    PerilsResultSetOptions,
    SingleLocationReportType,
} from '../../../api/openapi/auto-generated';
import { useUserContext } from '../../../context/UserContextProvider';
import { TemplateType } from '../types/templateTypeEnum';
import { TemplateFormat } from '../types/templateFormatEnum';
import {
    ALL_LOCATION_LOCATION_COUNT_LIMIT,
    DEFAULT_MODAL_STYLES,
} from '../../../const';

type ExcludedProps = 'open' | 'children';

interface DownloadSLRModalProps
    extends Omit<ComponentProps<typeof Modal>, ExcludedProps> {
    portfolio: IPortfolioItem;
    locationId?: string;
    onConfirm: (data: CreateSingleLocationReportInput) => void;
    onCancel: () => void;
    isLoading: boolean;
}

interface IDownloadForm {
    option: DownloadOption;
    locationId: string;
    scenario: Scenario;
    type: TemplateType;
    format: TemplateFormat;
}

export const DownloadSLRModal: FC<DownloadSLRModalProps> = ({
    portfolio,
    locationId: predefinedLocationId,
    onConfirm,
    onCancel,
    isLoading,
    ...props
}) => {
    const { canAccessDisclosureResultSet } = useUserContext();

    const economicImpactsResultSet = useMemo(
        () => getEconomicImpactsResultSet(portfolio),
        [portfolio]
    );

    const perilsResultSet = useMemo(
        () => getPerilsResultSet(portfolio),
        [portfolio]
    );

    const scoresResultSet = useMemo(
        () => getScoresResultSet(portfolio),
        [portfolio]
    );

    const disclosureResultSet = useMemo(
        () => getDisclosureResultSet(portfolio),
        [portfolio]
    );

    const eiResultSetWithFinancialMetrics = useMemo(
        () => getEIResultSetWithFinancialMetrics(portfolio),
        [portfolio]
    );

    const onSubmit = useCallback(
        (values: IDownloadForm) =>
            onConfirm({
                type: SingleLocationReportType.singleLocation,
                locationIds:
                    values.option === DownloadOption.Specify &&
                    values.locationId
                        ? [+values.locationId]
                        : undefined,
                ...(values.type === TemplateType.CSRD
                    ? {
                          jupiterTemplate: {
                              type: TemplateType.CSRD,
                          },
                          disclosureResultSetId: disclosureResultSet?.id,
                      }
                    : {
                          jupiterTemplate: {
                              scenario:
                                  values.scenario === Scenario.SSP585
                                      ? JupiterTemplateScenario.ssp5
                                      : JupiterTemplateScenario.ssp2,
                              colorCoding:
                                  values.type === TemplateType.Change
                                      ? JupiterTemplateColorCoding.change
                                      : JupiterTemplateColorCoding.exposure,
                              type:
                                  values.type === TemplateType.Fidelity
                                      ? JupiterTemplateType.fidelity
                                      : values.format,
                          },
                          impactsResultSetId: economicImpactsResultSet?.id,
                          scoresResultSetId: scoresResultSet?.id,
                          perilsResultSetId: perilsResultSet?.id,
                      }),
            }),
        [onConfirm, economicImpactsResultSet, scoresResultSet, perilsResultSet]
    );

    const initialFormValues = useMemo(
        () => ({
            option: DownloadOption.Specify,
            locationId: predefinedLocationId ? predefinedLocationId : '',
            scenario: Scenario.SSP585,
            type: TemplateType.Change,
            format: TemplateFormat.Basic,
        }),
        [predefinedLocationId]
    );

    const formik = useFormik<IDownloadForm>({
        initialValues: initialFormValues,
        onSubmit,
        enableReinitialize: true,
    });

    const {
        setFieldValue,
        handleSubmit,
        values: { option, locationId, scenario, type },
    } = formik;

    const isTemplateTypeIsCSRDReport = useMemo(
        () => type === TemplateType.CSRD,
        [type]
    );

    const opacityStyle = useMemo(
        () => ({
            opacity: isTemplateTypeIsCSRDReport ? 0.25 : 1,
        }),
        [isTemplateTypeIsCSRDReport]
    );

    const isAllLocationsOptionDisabled = useMemo(
        () =>
            !!portfolio.locationCount &&
            portfolio.locationCount > ALL_LOCATION_LOCATION_COUNT_LIMIT,
        [portfolio]
    );

    useEffect(() => {
        if (isAllLocationsOptionDisabled) {
            setFieldValue('option', DownloadOption.Specify);
        }
    }, [isAllLocationsOptionDisabled, setFieldValue]);

    useEffect(() => {
        if (option === DownloadOption.All) {
            setFieldValue('locationId', '');
        }
    }, [option, setFieldValue]);

    const handleLocationIdInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const formattedValue = event.target.value.replace(/[^0-9]+/g, '');
            setFieldValue('locationId', formattedValue);
        },
        [setFieldValue]
    );

    const availableScenarios = useMemo(() => {
        if (!perilsResultSet) {
            return [];
        }

        const options =
            (perilsResultSet.options as DamagesResultSetOptions)
                .perilsOptions ||
            (perilsResultSet.options as PerilsResultSetOptions);

        return options.scenarios || [];
    }, [perilsResultSet]);

    useEffect(() => {
        if (!availableScenarios.includes(Scenario.SSP585)) {
            setFieldValue('scenario', Scenario.SSP245);
        }
    }, [availableScenarios, setFieldValue]);

    useEffect(() => {
        if (scenario === Scenario.SSP245 && type === TemplateType.Fidelity) {
            setFieldValue('type', TemplateType.Change);
        }
    }, [scenario, type, setFieldValue]);

    useEffect(() => {
        if (isTemplateTypeIsCSRDReport) {
            setFieldValue('scenario', '');
            setFieldValue('format', '');
        } else {
            setFieldValue('scenario', Scenario.SSP585);
            setFieldValue('format', TemplateFormat.Basic);
        }
    }, [isTemplateTypeIsCSRDReport, setFieldValue]);

    const isValid = useMemo(
        () => option === DownloadOption.All || !!locationId,
        [option, locationId]
    );

    const handleClick = useCallback(() => {
        handleSubmit();
    }, [handleSubmit]);

    return (
        <Modal
            open
            onClose={onCancel}
            {...props}
            data-testid="download-slr-modal-layer"
        >
            <Box
                sx={{
                    ...DEFAULT_MODAL_STYLES,
                    background: (theme) => theme.palette.grey['600'],
                }}
                data-testid="download-slr-modal-box"
            >
                <Box
                    py={2}
                    px={3}
                    sx={{
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.primary.contrastText}`,
                    }}
                >
                    <Typography
                        variant="h3"
                        color="text.accent"
                        data-testid="download-slr-modal-title"
                    >
                        {predefinedLocationId ? '' : 'Bulk'} Download
                        Single-Location Reports
                    </Typography>
                </Box>
                {!predefinedLocationId && (
                    <Box
                        py={2}
                        px={3}
                        gap={2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            borderBottom: (theme) =>
                                `1px solid ${theme.palette.primary.contrastText}`,
                        }}
                    >
                        <Typography
                            variant="overline"
                            data-testid="download-slr-modal-include"
                        >
                            Include in Download
                        </Typography>

                        <Box
                            display="flex"
                            flexDirection="column"
                            data-testid="download-slr-modal-download-type"
                        >
                            <DownloadSLRSelection
                                name="option"
                                value={DownloadOption.All}
                                label="All Locations"
                                isSelected={
                                    formik.values.option === DownloadOption.All
                                }
                                onChange={setFieldValue}
                                disabled={isAllLocationsOptionDisabled}
                                tooltip="This option is only enabled for portfolios with 25 or fewer locations"
                            />

                            <DownloadSLRSelection
                                name="option"
                                value={DownloadOption.Specify}
                                label="Specify Location ID"
                                isSelected={
                                    formik.values.option ===
                                    DownloadOption.Specify
                                }
                                onChange={setFieldValue}
                            />
                        </Box>

                        <Box pl={5.5}>
                            <TextField
                                id="locationId"
                                label="Location ID"
                                placeholder="Enter Location ID"
                                name="locationId"
                                value={formik.values.locationId}
                                onChange={handleLocationIdInputChange}
                                onBlur={formik.handleBlur}
                                disabled={
                                    formik.values.option === DownloadOption.All
                                }
                                data-testid="download-slr-modal-location-id-input"
                            />
                        </Box>
                    </Box>
                )}
                <Box
                    py={2}
                    px={3}
                    gap={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.primary.contrastText}`,
                    }}
                    data-testid="download-slr-modal-template-type"
                >
                    <Typography
                        variant="overline"
                        data-testid="download-slr-modal-template-type-title"
                    >
                        Template Type
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        data-testid="download-slr-modal-template-type-buttons"
                    >
                        <DownloadSLRSelection
                            name="type"
                            value={TemplateType.Change}
                            label="Change Report"
                            isSelected={
                                formik.values.type === TemplateType.Change
                            }
                            onChange={setFieldValue}
                            helperText="Shows metrics by percent change"
                        />
                        <DownloadSLRSelection
                            name="type"
                            value={TemplateType.Exposure}
                            label="Exposure Report"
                            isSelected={
                                formik.values.type === TemplateType.Exposure
                            }
                            onChange={setFieldValue}
                            helperText="Shows metrics by exposure band"
                        />
                        {canAccessDisclosureResultSet && (
                            <DownloadSLRSelection
                                name="type"
                                disabled={!disclosureResultSet}
                                value={TemplateType.CSRD}
                                label="CSRD Report"
                                isSelected={
                                    formik.values.type === TemplateType.CSRD
                                }
                                onChange={setFieldValue}
                                helperText="Shows metrics by exposure band for disclosure hazards"
                            />
                        )}
                    </Box>
                </Box>
                <Box
                    py={2}
                    px={3}
                    gap={5}
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        borderBottom: (theme) =>
                            `1px solid ${theme.palette.primary.contrastText}`,
                    }}
                >
                    <Box
                        gap={2}
                        sx={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                        data-testid="download-slr-modal-scenario"
                    >
                        <Typography
                            variant="overline"
                            data-testid="download-slr-modal-scenario-title"
                        >
                            Scenario
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            data-testid="download-slr-modal-scenario-buttons"
                        >
                            <DownloadSLRSelection
                                name="scenario"
                                value={Scenario.SSP245}
                                label="SSP2-4.5"
                                isSelected={
                                    formik.values.scenario === Scenario.SSP245
                                }
                                disabled={
                                    isTemplateTypeIsCSRDReport ||
                                    !availableScenarios.includes(
                                        Scenario.SSP245
                                    )
                                }
                                onChange={setFieldValue}
                                helperText="Middle GHG Emissions"
                                styles={opacityStyle}
                            />
                            <DownloadSLRSelection
                                name="scenario"
                                value={Scenario.SSP585}
                                label="SSP5-8.5"
                                isSelected={
                                    formik.values.scenario === Scenario.SSP585
                                }
                                disabled={
                                    isTemplateTypeIsCSRDReport ||
                                    !availableScenarios.includes(
                                        Scenario.SSP585
                                    )
                                }
                                onChange={setFieldValue}
                                helperText="High GHG Emissions"
                                styles={opacityStyle}
                            />
                        </Box>
                    </Box>
                    <Box
                        gap={2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            flex: 1,
                        }}
                        data-testid="download-slr-modal-template-format"
                    >
                        <Typography
                            variant="overline"
                            data-testid="download-slr-modal-template-format-title"
                        >
                            Template Format
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            data-testid="download-slr-modal-template-format-buttons"
                        >
                            <DownloadSLRSelection
                                name="format"
                                value={TemplateFormat.Basic}
                                label="Basic"
                                isSelected={
                                    formik.values.format ===
                                    TemplateFormat.Basic
                                }
                                disabled={isTemplateTypeIsCSRDReport}
                                onChange={setFieldValue}
                                helperText="Peril metrics only"
                                styles={opacityStyle}
                            />
                            <DownloadSLRSelection
                                name="format"
                                value={TemplateFormat.Standard}
                                label="Standard"
                                isSelected={
                                    formik.values.format ===
                                    TemplateFormat.Standard
                                }
                                disabled={isTemplateTypeIsCSRDReport}
                                onChange={setFieldValue}
                                helperText="Peril metrics and scores"
                                styles={opacityStyle}
                            />
                            <DownloadSLRSelection
                                name="format"
                                disabled={
                                    isTemplateTypeIsCSRDReport ||
                                    !eiResultSetWithFinancialMetrics
                                }
                                value={TemplateFormat.Advanced}
                                label="Advanced"
                                isSelected={
                                    formik.values.format ===
                                    TemplateFormat.Advanced
                                }
                                onChange={setFieldValue}
                                helperText="Peril metrics, scores and economic impact"
                                styles={opacityStyle}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    py={2}
                    px={3}
                    gap={2}
                    display="flex"
                    justifyContent="flex-end"
                >
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        data-testid="download-slr-modal-button-cancel"
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        variant="contained"
                        onClick={handleClick}
                        color="secondary"
                        loading={isLoading}
                        disabled={!isValid}
                        data-testid="download-slr-modal-button-confirm"
                    >
                        Download
                    </LoadingButton>
                </Box>
            </Box>
        </Modal>
    );
};
