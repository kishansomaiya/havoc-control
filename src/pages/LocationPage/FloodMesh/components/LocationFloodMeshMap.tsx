import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Box } from '@mui/material';
import mapboxgl, { GeoJSONSource, MapMouseEvent, Point } from 'mapbox-gl';
import { MapboxMap } from '../../../../components/Map/MapboxMap';
import { MapControls } from '../../../../components/Map/MapControls';
import { ScoreLevelsMapLegend } from '../../../../components/Map/ScoreLevelsMapLegend';
import { MAP_MAX_ZOOM } from '../../../../const';
import { FeatureCollection, Geometry } from 'geojson';

interface LocationFloodMeshMapProps extends ComponentProps<typeof Box> {
    locations: {
        latitude: number;
        longitude: number;
        color: string;
        label: string;
    }[];
}

const MAP_BOUND_OFFSET = [0, 0];
const MAP_BOUND_PADDING = {
    top: 20,
    bottom: 110,
    left: 50,
    right: 50,
};

const MAP_SOURCE_ID = 'flood-mesh-locations';
export const LocationFloodMeshMap: FC<LocationFloodMeshMapProps> = ({
    locations,
}) => {
    const [map, setMap] = useState<mapboxgl.Map | undefined>();

    const data: FeatureCollection<Geometry> = useMemo(
        () =>
            locations.length
                ? {
                      type: 'FeatureCollection',
                      features: locations.map(
                          ({ latitude, longitude, label, color }, index) => {
                              return {
                                  type: 'Feature',
                                  geometry: {
                                      type: 'Point',
                                      coordinates: [longitude, latitude],
                                  },
                                  id: index,
                                  properties: {
                                      id: index,
                                      color,
                                      label,
                                      longitude,
                                      latitude,
                                  },
                              };
                          }
                      ),
                  }
                : {
                      type: 'FeatureCollection',
                      features: [],
                  },
        [locations]
    );

    const onLocationsLoad = useCallback(
        (
            mapRef: mapboxgl.Map,
            data: FeatureCollection<Geometry>,
            withRecenter: boolean = true
        ) => {
            (mapRef.getSource(MAP_SOURCE_ID) as GeoJSONSource)?.setData(data);
            if (withRecenter) {
                const bounds = new mapboxgl.LngLatBounds();
                data.features.forEach(function (feature) {
                    bounds.extend((feature.geometry as Point).coordinates);
                });
                if (!data.features.length) {
                    return;
                }
                mapRef.fitBounds(bounds, {
                    offset: MAP_BOUND_OFFSET,
                    padding: MAP_BOUND_PADDING,
                    maxZoom: MAP_MAX_ZOOM,
                });
            }
            setMap(mapRef);
        },
        []
    );

    const onLocationsLoaded = useCallback((mapRef: mapboxgl.Map) => {
        if (!mapRef.getSource(MAP_SOURCE_ID)) {
            mapRef.addSource(MAP_SOURCE_ID, {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] },
            });

            mapRef.addLayer({
                id: 'flood-point',
                type: 'circle',
                source: MAP_SOURCE_ID,
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': ['get', 'color'],
                    'circle-radius': 14,
                    'circle-stroke-width': 0,
                    'circle-stroke-color': '#000000',
                },
            });

            mapRef.addLayer({
                id: 'flood-point-text',
                type: 'symbol',
                source: MAP_SOURCE_ID,
                filter: ['!', ['has', 'point_count']],
                layout: {
                    'text-field': ['format', ['get', 'label']],
                    'text-size': 11,
                },
            });

            const pointPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });
            let pointPopupId: undefined | number;

            const onPointHover = (event: MapMouseEvent) => {
                if (!event) {
                    return;
                }

                if (!event.features) {
                    return;
                }

                const point = event.features[0];

                if (!point) {
                    return;
                }

                const pointId = point.id;
                if (pointId === pointPopupId) {
                    return;
                }
                pointPopupId = pointId;
                const coordinates = point.geometry.coordinates.slice();
                if (
                    ['mercator', 'equirectangular'].includes(
                        mapRef.getProjection().name
                    )
                ) {
                    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] +=
                            event.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                }

                pointPopup
                    .setLngLat(coordinates)
                    .setHTML(
                        `Latitude: ${point.properties.latitude.toFixed(6)}<br/>Longitude: ${point.properties.longitude.toFixed(6)}`
                    )
                    .addTo(mapRef);
            };

            mapRef.on('mouseenter', 'flood-point', onPointHover);

            mapRef.on('mousemove', 'flood-point', onPointHover);

            mapRef.on('mouseleave', 'flood-point', () => {
                pointPopup.remove();
                pointPopupId = undefined;
            });
        }
        setMap(mapRef);
    }, []);

    const zoomOutToShowAllLocations = useCallback(() => {
        if (!map) {
            return;
        }
        if (!data || !data.features || !data.features.length) {
            return;
        }
        const bounds = new mapboxgl.LngLatBounds();
        data.features.forEach(function (feature) {
            bounds.extend((feature.geometry as Point).coordinates);
        });
        if (!data.features.length) {
            return;
        }

        map.fitBounds(bounds, {
            offset: MAP_BOUND_OFFSET,
            padding: MAP_BOUND_PADDING,
            maxZoom: MAP_MAX_ZOOM,
        });
    }, [data, map]);

    useEffect(() => {
        if (!map) {
            return;
        }

        zoomOutToShowAllLocations();
    }, [map, zoomOutToShowAllLocations]);

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapboxMap
                style={{
                    width: '100%',
                    height: '100%',
                }}
                data={data}
                onDataLoad={onLocationsLoad}
                onDataLoaded={onLocationsLoaded}
                data-testid="mapboxgl-map"
            />
            <Box
                sx={{
                    position: 'absolute',
                    left: '1.5rem',
                    bottom: '1.5rem',
                    bgcolor: 'background.default',
                    borderRadius: '0.25rem',
                }}
                data-testid="map-controls"
            >
                {map && (
                    <MapControls
                        map={map}
                        zoomFraction={20}
                    />
                )}
            </Box>

            <Box
                position="absolute"
                bottom="1.5rem"
                right="1.5rem"
            >
                <ScoreLevelsMapLegend title="Flood Exposure" />
            </Box>
        </Box>
    );
};
