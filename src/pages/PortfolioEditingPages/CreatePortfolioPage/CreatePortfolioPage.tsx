import { Box, Tab, Tabs, Tooltip, useTheme } from '@mui/material';
import { PortfolioFormStep } from '../../../types';
import { PORTFOLIO_FORM_STEP_TITLES } from '../../../const/portfolioFormStepTitles';
import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../const';
import { ImportPortfolioData } from '../components/ImportData/ImportPortfolioData';
import { EditPortfolioSettings } from '../components/EditSettings/EditPortfolioSettings';
import {
    FileResponse,
    FileValidationStatus,
    GeocodeLocationMessageStatus,
    GeocodeValidationStatus,
    LocationGeocodeResponse,
} from '../../../api/openapi/auto-generated';
import { FormikProps } from 'formik';
import { UploadLocationsType } from '../components/ImportData/types/uploadLocationsTypeEnum';
import { LocationErrorsModal } from '../components/LocationErrorsModal/LocationErrorsModal';
import {
    convertAddressLocationsToCSVContent,
    convertLocationsToCSVContent,
    createCSVFile,
    getErrorLocationRowNumbers,
} from '../../../utils';
import * as Icon from 'react-feather';
import { EnteredLocation } from '../components/ImportData/components/EnterLatLongForm';
import { EnteredAddressLocation } from '../components/ImportData/components/EnterAddressForm';
import {
    useUploadPortfolioFileMutation,
    useValidatePortfolioFileMutation,
} from '../../../api/mutations/filesMutation';
import { LoadingButton } from '@mui/lab';
import { IPortfolio } from '../types/portfolio';
import { useCreatePortfolioWithResultSetsMutation } from '../../../api/mutations/portfoliosMutation';
import { PortfolioPageTemplate } from '../templates/PortfolioPageTemplate';
import { TabLabel } from '../components/TabLabel/TabLabel';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { useInitialFormValues } from '../hooks/useInitialFormValues';
import { defaultDataVersion } from '../hooks/usePortfolioDataVersion';
import { defaultEIVersion } from '../hooks/usePortfolioEIVersion';
import { preparePipeline } from '../util/resultSets/preparePipeline';
import oHeap from '../../../heap-analytics';
import { PORTFOLIO_CREATED } from '../../../const/heap';
import { IFileValidationResponse } from '../../../types/fileValidationTypes';
import { FileErrorsModal } from '../components/ImportData/components/FileErrorsModal';
import { getErrorLocationAddresses } from '../../../utils/geocode.util';
import { isNil } from 'lodash';
import { ECONOMIC_IMPACTS_WITH_NO_EIMODULES_TOOLTIP_TEXT } from '../const/portfolio';

const PortfolioFormSteps: { id: PortfolioFormStep; title: string }[] =
    Object.values(PortfolioFormStep).map((step) => {
        return {
            id: step,
            title: PORTFOLIO_FORM_STEP_TITLES[step],
        };
    });

export const CreatePortfolioPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState<PortfolioFormStep>(
        PortfolioFormStep.ImportData
    );
    const [showLocationErrors, setShowLocationErrors] =
        useState<boolean>(false);
    const [showFileErrors, setShowFileErrors] = useState<boolean>(false);
    const [filenameWithoutExtension, setFilenameWithoutExtension] = useState<
        string | undefined
    >();
    const [fileValidation, setFileValidation] = useState<
        IFileValidationResponse | undefined
    >();
    const [isEditSettingsFormValid, setIsEditSettingsFormValid] =
        useState(false);
    const [uploadLocationsType, setUploadLocationsType] =
        useState<UploadLocationsType>(UploadLocationsType.ImportFile);
    const [enteredLocations, setEnteredLocations] = useState<EnteredLocation[]>(
        []
    );
    const [locationGeocode, setLocationGeocode] = useState<
        LocationGeocodeResponse | undefined
    >();
    const [enteredAddressLocations, setEnteredAddressLocations] = useState<
        EnteredAddressLocation[]
    >([]);
    const [isAnyEIModuleIsPresent, setIsAnyEIModuleIsPresent] =
        useState<boolean>(true);
    const { uploadPortfolioFile, cancelUpload, isFileUploading } =
        useUploadPortfolioFileMutation();
    const {
        validatePortfolioFile,
        cancelValidation,
        isFileValidating,
        fileValidationStatus,
    } = useValidatePortfolioFileMutation();
    const { createPortfolio, cancelCreatePortfolio, isPortfolioCreating } =
        useCreatePortfolioWithResultSetsMutation();
    const formRef: MutableRefObject<FormikProps<IPortfolio> | null> =
        useRef(null);

    const { initialFormValues } = useInitialFormValues({
        name: filenameWithoutExtension ?? '',
        locationCount: fileValidation?.succeededCount,
        category: null,
        dataVersion: defaultDataVersion,
        eiVersion: defaultEIVersion,
        changeAnalysisType: true,
    });

    const isGeocodeAddressesVerified = useMemo<boolean>(() => {
        const geocodedAddresses =
            locationGeocode?.individualResults?.map(
                (result) => result.address
            ) ?? [];

        return (
            enteredAddressLocations.length > 0 &&
            enteredAddressLocations.filter(
                (addLocn) =>
                    !geocodedAddresses.includes(addLocn.streetAddress) ||
                    isNil(addLocn.latitude) ||
                    isNil(addLocn.longitude)
            ).length === 0
        );
    }, [locationGeocode, enteredAddressLocations]);

    const errorLocationIds = useMemo(() => {
        if (!fileValidation) {
            return [];
        }
        const errorRowNumbers = getErrorLocationRowNumbers(fileValidation);
        return enteredLocations
            .filter(({ id }) => {
                return errorRowNumbers.includes(id);
            })
            .map(({ id }) => id);
    }, [fileValidation, enteredLocations]);

    const errorAddressLocationIds = useMemo(() => {
        if (!locationGeocode) {
            return [];
        }
        const errorAddresses = getErrorLocationAddresses(locationGeocode);
        return enteredAddressLocations
            .filter(({ streetAddress }) => {
                return errorAddresses.includes(streetAddress);
            })
            .map(({ id }) => id);
    }, [locationGeocode, enteredAddressLocations]);

    useEffect(() => {
        // reset file validation when enteredLocations change
        setFileValidation(undefined);
    }, [/* effect dep */ enteredLocations]);

    useEffect(() => {
        cancelUpload();
        cancelValidation();
    }, [
        /* effect dep */ uploadLocationsType,
        /* effect dep */ enteredLocations,
        cancelUpload,
        cancelValidation,
    ]);

    useEffect(() => {
        return () => {
            cancelUpload();
            cancelValidation();
            cancelCreatePortfolio();
        };
    }, [cancelUpload, cancelValidation, cancelCreatePortfolio]);

    const validAddressLocations = useMemo(() => {
        const passedAddresses =
            locationGeocode?.individualResults?.reduce<string[]>(
                (acc, result) =>
                    result.status.validationStatus ===
                    GeocodeLocationMessageStatus.passed
                        ? [...acc, result.address]
                        : acc,
                []
            ) ?? [];
        return enteredAddressLocations
            .filter((addr) => passedAddresses.includes(addr.streetAddress))
            .map<EnteredAddressLocation>((addr, index) => ({
                ...addr,
                id: index + 1,
            }));
    }, [enteredAddressLocations, locationGeocode]);

    const canMoveToTheSettingsStep = useMemo<boolean>(() => {
        if (uploadLocationsType === UploadLocationsType.ImportFile) {
            if (!fileValidation) {
                return false;
            }
            if (
                fileValidation.status === FileValidationStatus.failed ||
                fileValidation.status === FileValidationStatus.pending
            ) {
                return false;
            }
        }

        if (uploadLocationsType === UploadLocationsType.EnterLatLong) {
            if (enteredLocations.length === 0) {
                return false;
            }
        }

        if (uploadLocationsType === UploadLocationsType.EnterAddress) {
            if (
                !isGeocodeAddressesVerified ||
                validAddressLocations.length === 0 ||
                !(
                    locationGeocode &&
                    (
                        [
                            GeocodeValidationStatus.partiallySucceeded,
                            GeocodeValidationStatus.succeeded,
                        ] as GeocodeValidationStatus[]
                    ).includes(locationGeocode.overallStatus)
                )
            ) {
                return false;
            }
        }

        return true;
    }, [
        fileValidation,
        uploadLocationsType,
        enteredLocations,
        validAddressLocations,
        isGeocodeAddressesVerified,
        locationGeocode,
    ]);

    const goToTheSettingsPage = useCallback(() => {
        setActiveStep(PortfolioFormStep.EditSettings);
    }, [setActiveStep]);

    const handleCancel = useCallback(() => {
        navigate(ROUTES.HOMEPAGE);
    }, [navigate]);

    const validateLocations = useCallback(
        async (fileContent: string, fileName: string) => {
            const file = createCSVFile(fileContent, fileName);
            const uploadedFile: FileResponse = await uploadPortfolioFile(file);
            const validationResult: IFileValidationResponse =
                await validatePortfolioFile(uploadedFile.id);
            setFileValidation(validationResult);
            return validationResult;
        },
        [uploadPortfolioFile, validatePortfolioFile]
    );

    const validateEnteredLocations = useCallback(() => {
        const modifiedLocations = enteredLocations.map((location, index) => ({
            ...location,
            id: index + 1,
        }));
        return validateLocations(
            convertLocationsToCSVContent(modifiedLocations),
            `Locations-${new Date().toDateString()}`
        );
    }, [enteredLocations, validateLocations]);

    const validateEnteredAddressLocations = useCallback(() => {
        return validateLocations(
            convertAddressLocationsToCSVContent(validAddressLocations),
            `Addresses-${new Date().toDateString()}`
        );
    }, [validAddressLocations, validateLocations]);

    const handleFileValidationChange = useCallback(
        (
            resFileValidation: IFileValidationResponse | undefined,
            filename?: string
        ) => {
            setFileValidation(resFileValidation);
            setFilenameWithoutExtension(filename);
        },
        []
    );

    const handleMoveToTheSettingsStep = useCallback(async () => {
        let validationResult = fileValidation;
        if (uploadLocationsType === UploadLocationsType.EnterLatLong) {
            validationResult = await validateEnteredLocations();
        }

        if (uploadLocationsType === UploadLocationsType.EnterAddress) {
            validationResult = await validateEnteredAddressLocations();
        }
        if (!validationResult) {
            return;
        }

        const { fileMessages, locationErrorMessages, rowErrorMessages } =
            validationResult;

        if (fileMessages?.length) {
            setShowFileErrors(true);
            return;
        }

        if (locationErrorMessages?.length || rowErrorMessages?.length) {
            setShowLocationErrors(true);
            return;
        }

        goToTheSettingsPage();
    }, [
        fileValidation,
        goToTheSettingsPage,
        uploadLocationsType,
        validateEnteredLocations,
        validateEnteredAddressLocations,
        setShowLocationErrors,
    ]);

    const handleHideLocationErrors = useCallback(() => {
        setShowLocationErrors(false);
    }, []);

    const handleHideFileErrors = useCallback(() => {
        setShowFileErrors(false);
    }, []);

    // const handleChangeUploadLocationsType = useCallback((type: UploadLocationsType) => {
    //     if(enteredLocations.length > 0) {

    //     }
    //     setUploadLocationsType(type);
    // }, []);

    const handleCreatePortfolio = useCallback(
        async (portfolio: IPortfolio) => {
            if (!fileValidation || !isEditSettingsFormValid) {
                return;
            }

            const { name, category } = portfolio;
            const pipeline = preparePipeline(portfolio);
            const newPortfolio = await createPortfolio({
                portfolio: {
                    name: name.trim(),
                    category: category?.id,
                    fileValidation: fileValidation.id,
                    file: fileValidation.file,
                },
                pipeline,
            });

            oHeap.trackCustomEvent(PORTFOLIO_CREATED, {
                portfolioName: newPortfolio.name,
                size: newPortfolio.locationCount,
            });

            navigate(ROUTES.HOMEPAGE);
        },
        [fileValidation, isEditSettingsFormValid, createPortfolio, navigate]
    );

    const handleClickCreatePortfolio = useCallback(() => {
        formRef.current?.submitForm();
    }, []);

    useEffect(() => {
        setEnteredAddressLocations([]);
        setLocationGeocode(undefined);
        setEnteredLocations([]);
        setFileValidation(undefined);
    }, [/* effect dep */ uploadLocationsType]);

    const rightToolbarButton = (
        <>
            {activeStep === PortfolioFormStep.ImportData && (
                <>
                    <LoadingButton
                        variant="contained"
                        color="secondary"
                        disabled={!canMoveToTheSettingsStep}
                        onClick={handleMoveToTheSettingsStep}
                        loadingPosition="end"
                        loading={isFileUploading || isFileValidating}
                        endIcon={<Icon.ChevronRight size="1rem" />}
                        data-testid="create-portfolio-next-button"
                    >
                        <span>
                            {isFileUploading || isFileValidating
                                ? 'Validating...'
                                : 'Next'}
                        </span>
                    </LoadingButton>
                    <LocationErrorsModal
                        fileValidationResult={fileValidation}
                        fileValidationRequestStatus={fileValidationStatus}
                        open={showLocationErrors}
                        onContinue={goToTheSettingsPage}
                        onGoBack={handleHideLocationErrors}
                        data-testid="location-error-modal"
                    />
                    <FileErrorsModal
                        open={showFileErrors}
                        fileValidationResult={fileValidation}
                        onModalClose={handleHideFileErrors}
                        data-testid="file-error-modal"
                    />
                </>
            )}
            {activeStep === PortfolioFormStep.EditSettings && (
                <Tooltip
                    title={
                        !isAnyEIModuleIsPresent
                            ? ECONOMIC_IMPACTS_WITH_NO_EIMODULES_TOOLTIP_TEXT
                            : ''
                    }
                    arrow
                    placement="bottom-start"
                >
                    <span>
                        <LoadingButton
                            variant="contained"
                            color="secondary"
                            disabled={
                                !isEditSettingsFormValid ||
                                !fileValidation ||
                                !isAnyEIModuleIsPresent
                            }
                            onClick={handleClickCreatePortfolio}
                            loadingPosition="end"
                            loading={isPortfolioCreating}
                            endIcon={<Icon.ChevronRight size="1rem" />}
                            data-testid="create-portfolio-create-button"
                        >
                            <span>
                                {isPortfolioCreating ? 'Creating...' : 'Create'}
                            </span>
                        </LoadingButton>
                    </span>
                </Tooltip>
            )}
        </>
    );

    const tabs = (
        <Tabs value={activeStep}>
            {PortfolioFormSteps.map(({ id, title }, index) => (
                <Tab
                    className={'MuiTab-sizeLarge'}
                    key={id}
                    value={id}
                    label={
                        <TabLabel>
                            {activeStep === PortfolioFormStep.EditSettings &&
                                id === PortfolioFormStep.ImportData && (
                                    <Box pr={1}>
                                        <Icon.Check
                                            size="1.5rem"
                                            color={theme.palette.success.main}
                                        />
                                    </Box>
                                )}
                            {index + 1}. {title}
                        </TabLabel>
                    }
                ></Tab>
            ))}
        </Tabs>
    );

    const tabContent = (
        <>
            {activeStep === PortfolioFormStep.ImportData && (
                <ImportPortfolioData
                    onFileValidationChange={handleFileValidationChange}
                    onUploadLocationsTypeChange={setUploadLocationsType}
                    uploadLocationsType={uploadLocationsType}
                    onEnteredLocationsChange={setEnteredLocations}
                    onEnteredAddressChange={setEnteredAddressLocations}
                    locationGeocode={locationGeocode}
                    onLocationGeocodeChange={setLocationGeocode}
                    isGeocodeAddressesVerified={isGeocodeAddressesVerified}
                    enteredAddressLocations={enteredAddressLocations}
                    errorLocationIds={errorLocationIds}
                    errorAddressLocationIds={errorAddressLocationIds}
                    fileValidationResult={fileValidation}
                />
            )}
            {activeStep === PortfolioFormStep.EditSettings &&
                (!initialFormValues ? (
                    <TabLoadingIndicator />
                ) : (
                    <EditPortfolioSettings
                        initialFormValues={initialFormValues}
                        onFormValidationChange={setIsEditSettingsFormValid}
                        onFormSubmit={handleCreatePortfolio}
                        onEiConfigurationChange={setIsAnyEIModuleIsPresent}
                        formRef={formRef}
                        showChangeTypeOption={false}
                        isNewPortfolio
                    />
                ))}
        </>
    );

    return (
        <PortfolioPageTemplate
            title="Create New Portfolio"
            rightToolBarButton={rightToolbarButton}
            onCancel={handleCancel}
            tabs={tabs}
            tabContent={tabContent}
        />
    );
};
