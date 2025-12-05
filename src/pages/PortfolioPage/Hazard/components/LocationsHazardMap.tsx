import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { SCORE_LEVEL_COLORS } from '../../../../const';

import {
    PortfolioLocation,
    PortfolioLocationsMap,
} from '../../../../components/Map/PortfolioLocationsMap';
import { LocationHazardData } from '../../../../api/queries/resultSetsQuery';
import { getSelectedPortfolioLocationUrl } from '../../../../utils';

export interface LocationsHazardMapProps extends ComponentProps<'div'> {
    portfolioId: string;
    portfolioHazardData: LocationHazardData[];
    yearTo: number;
}

export const LocationsHazardMap: FC<LocationsHazardMapProps> = ({
    portfolioId,
    portfolioHazardData,
    yearTo,
}) => {
    const navigate = useNavigate();
    const mapSourceId = useMemo(() => {
        return `portfolio-${portfolioId}-hazard-map`;
    }, [portfolioId]);

    const mapLocations = useMemo<PortfolioLocation[]>(() => {
        if (!yearTo) {
            return [];
        }

        if (!portfolioHazardData?.length) {
            return [];
        }

        return portfolioHazardData
            .filter(({ year }) => year.toString() === yearTo.toString())
            .map(({ locationId, locationName, tier, latitude, longitude }) => {
                return {
                    id: locationId,
                    name: locationName,
                    geometry: {
                        longitude,
                        latitude,
                    },
                    color: SCORE_LEVEL_COLORS[tier],
                };
            });
    }, [yearTo, portfolioHazardData]);

    const handleLocationSelection = useCallback(
        (locationId: number) => {
            const selectedLocationUrl = getSelectedPortfolioLocationUrl(
                portfolioId,
                locationId
            );
            navigate(selectedLocationUrl);
        },
        [portfolioId, navigate]
    );

    return (
        <PortfolioLocationsMap
            showLocationPopup
            mapSourceId={mapSourceId}
            onLocationSelected={handleLocationSelection}
            locations={mapLocations}
            data-testid="locations-hazard-map"
        />
    );
};
