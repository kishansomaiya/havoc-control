import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import * as Icon from 'react-feather';
import {
    ChangeEvent,
    ComponentProps,
    FC,
    KeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    PortfolioLocation,
    PortfolioLocationsMap,
} from '../../../../../components/Map/PortfolioLocationsMap';
import { MAX_LOCATIONS_COUNT } from '../constants';
import { LngLatLike } from 'mapbox-gl';
import { useCreatePortfolioGeocodeMutation } from '../../../../../api/mutations/portfoliosMutation';
import { LoadingButton } from '@mui/lab';
import { isNil } from 'lodash';
import {
    GeocodeValidationStatus,
    LocationGeocodeResponse,
} from '../../../../../api/openapi/auto-generated';
import { IFileValidationResponse } from '../../../../../types/fileValidationTypes';
import {
    useDownloadFileValidationLog,
    useValidatePortfolioFileMutation,
} from '../../../../../api/mutations/filesMutation';
import { FileValidationRequestStatus } from '../../../../../types/fileEnum';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';

export interface EnteredAddressLocation {
    id: number;
    latitude?: number;
    longitude?: number;
    streetAddress: string;
}

export interface EnterAddressFormProps extends ComponentProps<typeof Box> {
    onEnteredAddressChange: (
        enteredAddressLocations: EnteredAddressLocation[]
    ) => void;
    locationGeocode?: LocationGeocodeResponse;
    onLocationGeocodeChange: (locationGeocode: LocationGeocodeResponse) => void;
    errorLocationIds?: number[];
    errorAddressLocationIds?: number[];
    isGeocodeAddressesVerified: boolean;
    enteredAddressLocations: EnteredAddressLocation[];
    fileValidationResult: IFileValidationResponse | undefined;
}

export const EnterAddressForm: FC<EnterAddressFormProps> = ({
    onEnteredAddressChange,
    onLocationGeocodeChange,
    errorLocationIds = [], // this will be useful while validating and showing error on the location chips
    errorAddressLocationIds = [],
    isGeocodeAddressesVerified,
    enteredAddressLocations,
    locationGeocode,
    fileValidationResult,
}) => {
    const formatMessage = useFormatMessage();
    const [locationInputValue, setLocationInputValue] = useState<string>('');
    const [locationInputValueInvalid, setLocationInputValueInvalid] =
        useState<boolean>(false);
    const [locationIdsMarkedWithError, setLocationIdsMarkedWithError] =
        useState<number[]>(errorLocationIds);

    const {
        isPortfolioGeocodeCreating,
        createPortfolioGeocode,
        cancelGeocodeValidation,
    } = useCreatePortfolioGeocodeMutation();

    const { fileValidationStatus, isFileValidating } =
        useValidatePortfolioFileMutation();
    const { downloadFileValidationLog, isFileValidationLogDownloading } =
        useDownloadFileValidationLog();

    const mapLocations = useMemo(() => {
        return enteredAddressLocations.reduce<PortfolioLocation[]>(
            (acc, { id, latitude, longitude }) => {
                return !isNil(latitude) &&
                    !isNil(longitude) &&
                    !locationIdsMarkedWithError.includes(id)
                    ? [...acc, { id, geometry: { latitude, longitude } }]
                    : acc;
            },
            []
        );
    }, [enteredAddressLocations, locationIdsMarkedWithError]);

    const mapCenter = useMemo<LngLatLike | undefined>(() => {
        if (mapLocations.length === 0) {
            return;
        }

        const lastEnteredLocation = mapLocations[mapLocations.length - 1];
        const { latitude, longitude } = lastEnteredLocation.geometry;
        return { lng: longitude, lat: latitude };
    }, [mapLocations]);

    const locationsLimitReached = useMemo<boolean>(() => {
        return enteredAddressLocations.length >= MAX_LOCATIONS_COUNT;
    }, [enteredAddressLocations]);

    const inputHelperText = useMemo<string>(() => {
        if (locationsLimitReached) {
            return 'Location limit reached';
        }
        if (locationInputValueInvalid) {
            return 'Please enter valid location';
        }
        return '';
    }, [locationsLimitReached, locationInputValueInvalid]);

    const handleGeocodeLocationsValidations = useCallback(async () => {
        let maxLocationId = 1;
        const geocodeAddresses = enteredAddressLocations.map(
            (address) => address.streetAddress
        );

        const newLocationGeocode = await createPortfolioGeocode({
            enteredAddressLocations: {
                locations: geocodeAddresses,
            },
        });

        const formattedAddressLocations =
            newLocationGeocode.individualResults?.map<EnteredAddressLocation>(
                (location) => ({
                    id: maxLocationId++,
                    latitude: location.coords[0] || 0,
                    longitude: location.coords[1] || 0,
                    streetAddress: location.address,
                })
            ) ?? [];

        onLocationGeocodeChange(newLocationGeocode);
        onEnteredAddressChange(formattedAddressLocations);
    }, [
        enteredAddressLocations,
        createPortfolioGeocode,
        onLocationGeocodeChange,
        onEnteredAddressChange,
    ]);

    const handleLocationDelete = useCallback(
        (locationId: number) => {
            const updatedLocations = enteredAddressLocations.filter(
                ({ id }) => id !== locationId
            );
            onEnteredAddressChange(updatedLocations);

            const updatedErrorLocationIds = locationIdsMarkedWithError.filter(
                (id) => id !== locationId
            );
            setLocationIdsMarkedWithError(updatedErrorLocationIds);
        },
        [
            enteredAddressLocations,
            locationIdsMarkedWithError,
            onEnteredAddressChange,
        ]
    );

    const handleLocationAdd = useCallback(
        async (streetAddress: string) => {
            if (locationsLimitReached) {
                return;
            }
            const maxLocationId = enteredAddressLocations.reduce(
                (maxId, location) => {
                    return location.id > maxId ? location.id : maxId;
                },
                0
            );
            const newlyEnteredLocation: EnteredAddressLocation = {
                id: maxLocationId + 1,
                streetAddress: streetAddress,
            };
            const updatedLocations = [
                ...enteredAddressLocations,
                newlyEnteredLocation,
            ];
            onEnteredAddressChange(updatedLocations);
            onLocationGeocodeChange({
                ...locationGeocode,
                overallStatus: GeocodeValidationStatus.unknownDefaultOpenApi,
            } as LocationGeocodeResponse);
        },
        [
            enteredAddressLocations,
            locationGeocode,
            locationsLimitReached,
            onEnteredAddressChange,
            onLocationGeocodeChange,
        ]
    );

    const handleLocationInputReset = useCallback(() => {
        setLocationInputValueInvalid(false);
        setLocationInputValue('');
    }, []);

    const handleLocationInputSubmit = useCallback(() => {
        if (locationsLimitReached) {
            return;
        }
        if (locationInputValue.trim() === '') {
            setLocationInputValueInvalid(true);
            return;
        }
        handleLocationAdd(locationInputValue);
        handleLocationInputReset();
    }, [
        locationsLimitReached,
        locationInputValue,
        handleLocationAdd,
        handleLocationInputReset,
    ]);

    const handleLocationInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setLocationInputValue(event.target.value);
        },
        []
    );

    const handleDownloadValidationLog = useCallback(async () => {
        if (!fileValidationResult?.id) {
            return;
        }
        await downloadFileValidationLog(fileValidationResult.id);
    }, [downloadFileValidationLog, fileValidationResult]);

    const handleLocationInputKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
                handleLocationInputSubmit();
            }
        },
        [handleLocationInputSubmit]
    );

    useEffect(() => {
        const uniqueErrorLocationIds = [
            ...new Set([...errorLocationIds, ...errorAddressLocationIds]),
        ];
        setLocationIdsMarkedWithError(uniqueErrorLocationIds);
    }, [errorLocationIds, errorAddressLocationIds]);

    useEffect(() => {
        return () => {
            // on component unmount
            cancelGeocodeValidation();
        };
    }, [cancelGeocodeValidation]);

    return (
        <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
        >
            <Box
                pb={2}
                minHeight="3.25rem"
                alignItems="center"
                justifyContent="space-between"
                display="flex"
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="enter-address-form-label"
                >
                    {formatMessage(
                        'create_portfolio.upload_type.enter_address.title_text'
                    )}
                </Typography>

                <Tooltip
                    title={
                        fileValidationStatus ===
                        FileValidationRequestStatus.Completed
                            ? formatMessage(
                                  'create_portfolio.validation_log.no_validation_errors'
                              )
                            : ''
                    }
                    arrow
                    placement="bottom-start"
                    disableHoverListener={
                        isFileValidating ||
                        !fileValidationResult ||
                        isFileValidationLogDownloading
                    }
                >
                    <span>
                        <LoadingButton
                            variant="outlined"
                            endIcon={<Icon.Download size="1rem" />}
                            onClick={handleDownloadValidationLog}
                            data-testid="download-validation-log-button"
                            disabled={
                                isFileValidating ||
                                !fileValidationResult ||
                                isFileValidationLogDownloading ||
                                fileValidationStatus ===
                                    FileValidationRequestStatus.Completed
                            }
                            loadingPosition="end"
                            loading={isFileValidationLogDownloading}
                        >
                            {isFileValidationLogDownloading
                                ? formatMessage(
                                      'create_portfolio.validation_log.downloading'
                                  )
                                : formatMessage(
                                      'create_portfolio.validation_log.download_validation_log'
                                  )}
                        </LoadingButton>
                    </span>
                </Tooltip>
            </Box>
            <Grid
                container
                flexGrow={1}
                minHeight="27rem"
            >
                <Grid
                    item
                    xs={12}
                    data-testid="enter-address-form"
                >
                    <Box pb={0.5}>
                        <TextField
                            fullWidth
                            label={formatMessage(
                                'create_portfolio.upload_type.enter_address.input_label_text'
                            )}
                            data-testid="enter-address-input-field"
                            id="address-input"
                            placeholder={formatMessage(
                                'create_portfolio.upload_type.enter_address.input_placeholder_text'
                            )}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleLocationInputChange}
                            onKeyDown={handleLocationInputKeyDown}
                            value={locationInputValue}
                            error={
                                locationInputValueInvalid ||
                                locationsLimitReached
                            }
                            size="small"
                            helperText={inputHelperText}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{ height: '100%' }}
                                    >
                                        <IconButton
                                            size="small"
                                            disabled={locationsLimitReached}
                                            onClick={handleLocationInputSubmit}
                                            data-testid="enter-address-input-enter-button"
                                        >
                                            <Icon.CornerDownLeft size="1rem" />
                                        </IconButton>
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                            sx={{ marginX: '0.5rem' }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleLocationInputReset}
                                            data-testid="enter-address-input-x-button"
                                        >
                                            <Icon.X size="1rem" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box
                        py={1.5}
                        display="flex"
                        justifyContent="space-between"
                        gap={1.5}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            data-testid="enter-address-help-text"
                        >
                            {formatMessage(
                                'create_portfolio.enter_address.help_text'
                            )}
                        </Typography>
                        <Box>
                            {!isGeocodeAddressesVerified ? (
                                <LoadingButton
                                    variant="contained"
                                    color="secondary"
                                    disabled={
                                        enteredAddressLocations.length === 0
                                    }
                                    onClick={handleGeocodeLocationsValidations}
                                    loading={isPortfolioGeocodeCreating}
                                    endIcon={<Icon.ChevronRight size="1rem" />}
                                    loadingPosition="end"
                                    data-testid="enter-address-form-validate-button"
                                >
                                    <span>
                                        {isPortfolioGeocodeCreating
                                            ? formatMessage(
                                                  'create_portfolio.upload_type.enter_address.validating'
                                              )
                                            : formatMessage(
                                                  'create_portfolio.upload_type.enter_address.validate_button_text'
                                              )}
                                    </span>
                                </LoadingButton>
                            ) : (
                                <Button
                                    variant="outlined"
                                    disabled
                                >
                                    <span>
                                        {formatMessage(
                                            'create_portfolio.upload_type.enter_address.validated_text'
                                        )}
                                    </span>
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={1}
                        flexWrap="wrap"
                        data-testid="enter-address-form-locations-list"
                        pb={3}
                    >
                        {enteredAddressLocations.map(
                            ({ id, streetAddress }) => (
                                <Chip
                                    key={id}
                                    label={`${streetAddress}`}
                                    color={
                                        locationIdsMarkedWithError.includes(id)
                                            ? 'error'
                                            : undefined
                                    }
                                    onDelete={() => {
                                        handleLocationDelete(id);
                                    }}
                                    deleteIcon={
                                        <Icon.X
                                            size="1rem"
                                            data-testid="enter-address-form-locations-chip-x-icon"
                                        />
                                    }
                                    data-testid="enter-address-form-location-chip"
                                />
                            )
                        )}
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    minHeight="100%"
                    data-testid="create-new-portfolio-address-map"
                    sx={{ height: '300px' }}
                >
                    <PortfolioLocationsMap
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        locations={mapLocations}
                        mapCenter={mapCenter}
                        mapSourceId="enter-address-form-map"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EnterAddressForm;
