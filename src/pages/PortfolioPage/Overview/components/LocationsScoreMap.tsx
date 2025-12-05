import { ComponentProps, FC, useMemo, useCallback } from 'react';
import { NO_AVAILABLE_SCORE, SCORE_OVERALL_FIELDS } from '../../../../const';
import {
    getScoreLevelColor,
    getSelectedPortfolioLocationUrl,
} from '../../../../utils';
import { Score } from '../../../../types';
import { PortfolioLocationsMap } from '../../../../components/Map/PortfolioLocationsMap';
import { LocationWithScores } from '../PortfolioOverviewTab';
import { useNavigate } from 'react-router';

export interface LocationsScoreMapProps extends ComponentProps<'div'> {
    portfolioId: string;
    locationWithScores: LocationWithScores[];
    selectedScore: Score;
}

export const LocationsScoreMap: FC<LocationsScoreMapProps> = ({
    portfolioId,
    locationWithScores,
    selectedScore,
}) => {
    const navigate = useNavigate();
    const mapSourceId = useMemo(
        () => `portfolio-${portfolioId}-locations`,
        [portfolioId]
    );

    const portfolioLocations = useMemo(() => {
        return locationWithScores.map((location) => {
            const score =
                location?.[SCORE_OVERALL_FIELDS[selectedScore]] ||
                location[SCORE_OVERALL_FIELDS[selectedScore]] === 0
                    ? location?.[SCORE_OVERALL_FIELDS[selectedScore]]
                    : NO_AVAILABLE_SCORE;
            return {
                id: location.locationId,
                name: location.locationName,
                geometry: {
                    longitude: location.longitude,
                    latitude: location.latitude,
                },
                color: getScoreLevelColor(score),
            };
        });
    }, [locationWithScores, selectedScore]);

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
            locations={portfolioLocations}
            data-testid="locations-score-map"
        />
    );
};
