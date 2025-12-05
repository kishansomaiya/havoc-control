import {
    GeocodeLocationMessageStatus,
    LocationGeocodeResponse,
} from '../api/openapi/auto-generated';

export const getGeocodeLocationAddressErrors = (
    geocodeResult: LocationGeocodeResponse
): Array<{ address: string; status: GeocodeLocationMessageStatus }> => {
    const { individualResults } = geocodeResult;
    if (!individualResults) {
        return [];
    }

    return individualResults.flatMap(({ address, status }) => ({
        address,
        status:
            status.validationStatus ??
            GeocodeLocationMessageStatus.unknownDefaultOpenApi,
    }));
};

export const getErrorLocationAddresses = (
    geocodeResult: LocationGeocodeResponse
) => {
    const locationAddressErrors =
        getGeocodeLocationAddressErrors(geocodeResult);
    if (!locationAddressErrors) {
        return [];
    }

    return locationAddressErrors
        .filter(({ status }) => status === GeocodeLocationMessageStatus.failed)
        .map(({ address }) => address);
};
