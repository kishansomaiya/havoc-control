import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { LocationsList } from './components/LocationsList';
import { useLocationsQuery } from '../../../api/queries/locationsQuery';
import { PortfolioLocationsMap } from '../../../components/Map/PortfolioLocationsMap';
import { useCallback, useEffect, useMemo } from 'react';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { useSearchParams } from 'react-router-dom';
import {
    getFloodResultSet,
    getPerilsResultSet,
    getSelectedPortfolioLocationUrl,
} from '../../../utils';
import { IPortfolioItem } from '../../../types';
import { ROUTES } from '../../../const';
import { useDashboardResultSetIdContextUpdate } from '../../../context/DashboardFilterProvider';

export const PortfolioLocationsTab = () => {
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();
    const navigate = useNavigate();
    const { portfolioId } = useParams();
    const [searchParams] = useSearchParams();
    const { locations, isLocationsLoading } = useLocationsQuery({
        portfolioId,
    });
    const updateDashboardFilterResultSetId =
        useDashboardResultSetIdContextUpdate();

    const handleLocationSelection = useCallback(
        (locationId: number) => {
            if (!portfolioId) {
                return;
            }

            const selectedLocationUrl = getSelectedPortfolioLocationUrl(
                portfolioId,
                locationId
            );
            navigate(selectedLocationUrl, {
                replace: true,
            });
        },
        [portfolioId, navigate]
    );

    const mapCenter = useMemo(() => {
        const selectedLocationId = searchParams.get('locationId');
        if (!selectedLocationId) {
            return undefined;
        }

        const selectedLocation = locations.find(
            ({ id }) => id === Number(selectedLocationId)
        );

        if (!selectedLocation) {
            return undefined;
        }

        const { latitude, longitude } = selectedLocation.geometry;
        return { lng: longitude, lat: latitude };
    }, [searchParams, locations]);

    const hasPerilResultSet = useMemo(
        () => !!getPerilsResultSet(portfolioItem),
        [portfolioItem]
    );

    const hasFloodMeshResultSet = useMemo(
        () => !!getFloodResultSet(portfolioItem),
        [portfolioItem]
    );

    const isNavigationToLocationEnabled = useMemo(() => {
        if (hasPerilResultSet) {
            return true;
        }

        return hasFloodMeshResultSet;
    }, [hasPerilResultSet, hasFloodMeshResultSet]);

    useEffect(() => {
        updateDashboardFilterResultSetId(null);
    },[portfolioId]);

    return (
        <Box
            flexGrow="1"
            overflow="auto"
            position="relative"
            data-testid="portfolio-locations-body"
        >
            {isLocationsLoading && <TabLoadingIndicator />}

            {!isLocationsLoading && (
                <Grid
                    height="100%"
                    container
                    spacing={0}
                >
                    <Grid
                        xs={6}
                        height="100%"
                        overflow="hidden"
                        position="relative"
                        data-testid="portfolio-locations-map"
                    >
                        <PortfolioLocationsMap
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            mapSourceId={`portfolio-locations-map-${portfolioId}`}
                            locations={locations}
                            onLocationSelected={handleLocationSelection}
                            mapCenter={mapCenter}
                        />
                    </Grid>
                    <Grid
                        xs={6}
                        height="100%"
                        overflow="hidden"
                        position="relative"
                        data-testid="portfolio-locations-list-block"
                    >
                        {portfolioId && (
                            <LocationsList
                                portfolioId={portfolioId}
                                locations={locations}
                                isNavigationEnabled={
                                    isNavigationToLocationEnabled
                                }
                                navigationAvailableTab={
                                    hasPerilResultSet
                                        ? ROUTES.LOCATION_TABS.HAZARD
                                        : hasFloodMeshResultSet
                                          ? ROUTES.LOCATION_TABS.FLOOD_MESH
                                          : null
                                }
                            />
                        )}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};
