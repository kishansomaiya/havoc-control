import { Box, Container, Divider, Grid } from '@mui/material';
import { ComponentProps, FC } from 'react';
import { UploadLocationsType } from './types/uploadLocationsTypeEnum';
import { UploadTypeSelection } from './components/UploadTypeSelection';
import { UploadCsvFileForm } from './components/UploadCsvFileForm';
import {
    EnteredLocation,
    EnterLatLongForm,
} from './components/EnterLatLongForm';
import {
    EnteredAddressLocation,
    EnterAddressForm,
} from './components/EnterAddressForm';
import { IFileValidationResponse } from '../../../../types/fileValidationTypes';
import { LocationGeocodeResponse } from '../../../../api/openapi/auto-generated';

interface ImportPortfolioDataProps extends ComponentProps<typeof Container> {
    onFileValidationChange: (
        validation: IFileValidationResponse | undefined,
        filename?: string | undefined
    ) => void;
    onUploadLocationsTypeChange: (type: UploadLocationsType) => void;
    onEnteredLocationsChange?: (locations: EnteredLocation[]) => void;
    onEnteredAddressChange: (locations: EnteredAddressLocation[]) => void;
    onLocationGeocodeChange: (locationGeocode: LocationGeocodeResponse) => void;
    locationGeocode?: LocationGeocodeResponse;
    isGeocodeAddressesVerified: boolean;
    uploadLocationsType: UploadLocationsType;
    errorLocationIds?: Array<number>;
    errorAddressLocationIds?: Array<number>;
    enteredAddressLocations: EnteredAddressLocation[];
    fileValidationResult: IFileValidationResponse | undefined;
}

export const ImportPortfolioData: FC<ImportPortfolioDataProps> = ({
    onFileValidationChange,
    onUploadLocationsTypeChange,
    onEnteredLocationsChange,
    onEnteredAddressChange,
    onLocationGeocodeChange,
    locationGeocode,
    isGeocodeAddressesVerified,
    uploadLocationsType,
    errorLocationIds = [],
    errorAddressLocationIds = [],
    enteredAddressLocations,
    fileValidationResult,
    ...props
}) => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflowY: 'auto',
            }}
            {...props}
        >
            <Box width="100%">
                <Box
                    minHeight="100%"
                    display="flex"
                    flexDirection="column"
                >
                    <Grid
                        container
                        spacing={3}
                        sx={{ justifyContent: 'space-between' }}
                    >
                        <Grid
                            item
                            xs={5.5}
                            sx={{ paddingTop: '80px !important' }}
                        >
                            <UploadTypeSelection
                                type={uploadLocationsType}
                                onTypeChange={onUploadLocationsTypeChange}
                                pb={3}
                            />
                        </Grid>
                        <Divider
                            orientation="vertical"
                            flexItem
                        />
                        <Grid
                            item
                            xs={5.5}
                            sx={{ paddingTop: '80px !important' }}
                        >
                            {uploadLocationsType ===
                                UploadLocationsType.ImportFile && (
                                <UploadCsvFileForm
                                    onFileValidationCompleted={
                                        onFileValidationChange
                                    }
                                />
                            )}
                            {uploadLocationsType ===
                                UploadLocationsType.EnterLatLong && (
                                <EnterLatLongForm
                                    onEnteredLocationsChange={
                                        onEnteredLocationsChange
                                    }
                                    fileValidationResult={fileValidationResult}
                                    errorLocationIds={errorLocationIds}
                                />
                            )}
                            {uploadLocationsType ===
                                UploadLocationsType.EnterAddress && (
                                <EnterAddressForm
                                    onEnteredAddressChange={
                                        onEnteredAddressChange
                                    }
                                    errorLocationIds={errorLocationIds}
                                    errorAddressLocationIds={
                                        errorAddressLocationIds
                                    }
                                    isGeocodeAddressesVerified={
                                        isGeocodeAddressesVerified
                                    }
                                    enteredAddressLocations={
                                        enteredAddressLocations
                                    }
                                    locationGeocode={locationGeocode}
                                    onLocationGeocodeChange={
                                        onLocationGeocodeChange
                                    }
                                    fileValidationResult={fileValidationResult}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};
