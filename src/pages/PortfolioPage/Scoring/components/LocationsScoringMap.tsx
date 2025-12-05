import { Box } from '@mui/material';
import { PortfolioLocationsMap } from '../../../../components/Map/PortfolioLocationsMap';
import { ComponentProps, FC, useMemo } from 'react';
import { LocationScoringData } from '../../../../api/queries/resultSetsQuery';
import { getScoreLevelColor } from '../../../../utils';
import { LngLatLike } from 'mapbox-gl';

interface LocationsScoringMapProps extends ComponentProps<typeof Box> {
    portfolioId: string;
    portfolioScoringData: LocationScoringData[];
    selectedLocationId?: number;
    onLocationSelected?: (locationId: number | undefined) => void;
}

export const LocationsScoringMap: FC<LocationsScoringMapProps> = ({
    portfolioId,
    portfolioScoringData,
    selectedLocationId,
    onLocationSelected,
    ...props
}) => {
    const mapLocations = useMemo(() => {
        return portfolioScoringData.map(
            ({ locationId, latitude, longitude, overallScoreValue }) => ({
                id: locationId,
                geometry: {
                    longitude,
                    latitude,
                },
                color: getScoreLevelColor(overallScoreValue),
            })
        );
    }, [portfolioScoringData]);

    const mapCenter = useMemo<LngLatLike | undefined>(() => {
        if (!selectedLocationId) {
            return;
        }

        const locationScoringData = portfolioScoringData.find(
            ({ locationId }) =>
                locationId.toString() === selectedLocationId.toString()
        );

        if (!locationScoringData) {
            return;
        }

        const { latitude, longitude } = locationScoringData;
        return { lng: longitude, lat: latitude };
    }, [portfolioScoringData, selectedLocationId]);

    return (
        <Box
            width="100%"
            height="100%"
            {...props}
        >
            <PortfolioLocationsMap
                style={{
                    width: '100%',
                    height: '100%',
                }}
                mapSourceId={`portfolio-scoring-locations-map-${portfolioId}`}
                locations={mapLocations}
                mapCenter={mapCenter}
                onLocationSelected={onLocationSelected}
                zoomOutOnMapCenterReset={true}
            />
        </Box>
    );
};
