import {
    Box,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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
import * as Icon from 'react-feather';
import validateCoordsInput from '../../../../../utils/coordinate.util';
import { PortfolioLocationsMap } from '../../../../../components/Map/PortfolioLocationsMap';
import { LngLatLike } from 'mapbox-gl';
import { MAX_LOCATIONS_COUNT } from '../constants';
import {
    useDownloadFileValidationLog,
    useValidatePortfolioFileMutation,
} from '../../../../../api/mutations/filesMutation';
import { FileValidationRequestStatus } from '../../../../../types/fileEnum';
import { IFileValidationResponse } from '../../../../../types/fileValidationTypes';
import { LoadingButton } from '@mui/lab';
import { useFormatMessage } from '../../../../../localization/useFormatMessage';

export interface EnteredLocation {
    id: number;
    latitude: number;
    longitude: number;
}

interface EnterLatLongFormProps extends ComponentProps<typeof Box> {
    onEnteredLocationsChange?: (locations: EnteredLocation[]) => void;
    fileValidationResult: IFileValidationResponse | undefined;
    errorLocationIds?: number[];
}

export const EnterLatLongForm: FC<EnterLatLongFormProps> = ({
    onEnteredLocationsChange,
    fileValidationResult,
    errorLocationIds = [],
}) => {
    const formatMessage = useFormatMessage();
    const [enteredLocations, setEnteredLocations] = useState<EnteredLocation[]>(
        []
    );
    const [locationInputValue, setLocationInputValue] = useState<string>('');
    const [locationInputValueInvalid, setLocationInputValueInvalid] =
        useState<boolean>(false);
    const [locationIdsMarkedWithError, setLocationIdsMarkedWithError] =
        useState<number[]>(errorLocationIds);

    const { fileValidationStatus, isFileValidating } =
        useValidatePortfolioFileMutation();
    const { downloadFileValidationLog, isFileValidationLogDownloading } =
        useDownloadFileValidationLog();

    const mapLocations = useMemo(() => {
        return enteredLocations
            .filter(({ id }) => !locationIdsMarkedWithError.includes(id))
            .map(({ id, latitude, longitude }) => {
                return {
                    id,
                    geometry: {
                        latitude,
                        longitude,
                    },
                };
            });
    }, [enteredLocations, locationIdsMarkedWithError]);

    const mapCenter = useMemo<LngLatLike | undefined>(() => {
        if (enteredLocations.length === 0) {
            return;
        }

        const lastEnteredLocation =
            enteredLocations[enteredLocations.length - 1];
        const { latitude, longitude } = lastEnteredLocation;
        return { lng: longitude, lat: latitude };
    }, [enteredLocations]);

    const locationsLimitReached = useMemo<boolean>(() => {
        return enteredLocations.length >= MAX_LOCATIONS_COUNT;
    }, [enteredLocations]);

    const inputHelperText = useMemo<string>(() => {
        if (locationsLimitReached) {
            return 'Location limit reached';
        }
        if (locationInputValueInvalid) {
            return 'Please enter valid location';
        }
        return '';
    }, [locationsLimitReached, locationInputValueInvalid]);

    useEffect(() => {
        if (!onEnteredLocationsChange) {
            return;
        }
        onEnteredLocationsChange(enteredLocations);
    }, [enteredLocations, onEnteredLocationsChange]);

    useEffect(() => {
        setLocationIdsMarkedWithError(errorLocationIds);
    }, [errorLocationIds]);

    const handleLocationAdd = useCallback(
        (coordinates: string) => {
            if (locationsLimitReached) {
                return;
            }

            const [latitude, longitude] = coordinates
                .split(',')
                .map((coordinate) => parseFloat(coordinate));
            const maxLocationId = enteredLocations.reduce((maxId, location) => {
                return location.id > maxId ? location.id : maxId;
            }, 0);
            const newlyEnteredLocation: EnteredLocation = {
                id: maxLocationId + 1,
                latitude,
                longitude,
            };
            const updatedLocations = [
                ...enteredLocations,
                newlyEnteredLocation,
            ];
            setEnteredLocations(updatedLocations);
        },
        [enteredLocations, locationsLimitReached]
    );

    const handleLocationDelete = useCallback(
        (locationId: number) => {
            const updatedLocations = enteredLocations.filter(
                ({ id }) => id !== locationId
            );
            setEnteredLocations(updatedLocations);

            const updatedErrorLocationIds = locationIdsMarkedWithError.filter(
                (id) => id !== locationId
            );
            setLocationIdsMarkedWithError(updatedErrorLocationIds);
        },
        [enteredLocations, locationIdsMarkedWithError]
    );

    const handleLocationInputReset = useCallback(() => {
        setLocationInputValueInvalid(false);
        setLocationInputValue('');
    }, []);

    const handleLocationInputSubmit = useCallback(() => {
        if (locationsLimitReached) {
            return;
        }
        const isLocationInputValueValid =
            validateCoordsInput(locationInputValue);
        setLocationInputValueInvalid(!isLocationInputValueValid);
        if (!isLocationInputValueValid) {
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
            const formattedValue = event.target.value.replace(
                /[^0-9.,-]+/g,
                ''
            );
            setLocationInputValue(formattedValue);
            setLocationInputValueInvalid(false);
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
                display="flex"
                justifyContent="space-between"
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="enter-lat-long-form-label"
                >
                    {formatMessage(
                        'create_portfolio.upload_type.enter_lat_long.title_text'
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
                spacing={3}
                flexGrow={1}
                minHeight="17rem"
            >
                <Grid
                    xs={12}
                    data-testid="enter-lat-long-form"
                >
                    <Box pb={0.5}>
                        <TextField
                            fullWidth
                            label={formatMessage(
                                'create_portfolio.upload_type.enter_lat_long.input_label_text'
                            )}
                            data-testid="enter-lat-long-input-field"
                            id="lat-long-input"
                            placeholder={formatMessage(
                                'create_portfolio.upload_type.enter_lat_long.input_placeholder_text'
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
                                            data-testid="enter-lat-long-input-enter-button"
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
                                            data-testid="enter-lat-long-input-x-button"
                                        >
                                            <Icon.X size="1rem" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        pb={3}
                        data-testid="enter-lat-long-help-text"
                    >
                        {formatMessage(
                            'create_portfolio.enter_lat_long.help_text'
                        )}
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={1}
                        flexWrap="wrap"
                        data-testid="enter-lat-long-form-locations-list"
                    >
                        {enteredLocations.map(({ id, latitude, longitude }) => (
                            <Chip
                                key={id}
                                label={`${latitude},${longitude}`}
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
                                        data-testid="enter-lat-long-form-locations-chip-x-icon"
                                    />
                                }
                                data-testid="enter-lat-long-form-location-chip"
                            />
                        ))}
                    </Box>
                </Grid>
                <Grid
                    xs={12}
                    minHeight="100%"
                    data-testid="create-new-portfolio-lat-long-map"
                    sx={{ height: '300px' }}
                >
                    <PortfolioLocationsMap
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        locations={mapLocations}
                        mapCenter={mapCenter}
                        mapSourceId="enter-lat-long-form-map"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
