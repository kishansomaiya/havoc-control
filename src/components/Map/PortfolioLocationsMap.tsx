import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Box } from '@mui/material';
import { MapboxMap } from './MapboxMap';
import mapboxgl, {
    GeoJSONSource,
    LngLatLike,
    MapMouseEvent,
    Point,
} from 'mapbox-gl';
import { MapControls } from './MapControls';
import {
    LOCATION_VIEW_MAP_DEFAULT_ZOOM,
    MAP_BOUNDS_MAX_ZOOM,
} from '../../const';

export interface PortfolioLocation {
    id: number;
    name?: string | null;
    geometry: {
        longitude: number;
        latitude: number;
    };
    color?: string;
}

interface PortfolioLocationsMapProps extends ComponentProps<typeof Box> {
    locations: PortfolioLocation[];
    mapSourceId?: string;
    onLocationSelected?: (locationId: number) => void;
    mapCenter?: LngLatLike;
    zoomOutOnMapCenterReset?: boolean;
    showLocationPopup?: boolean;
}

const MAP_BOUND_OFFSET = [0, 0];
const MAP_BOUND_PADDING = {
    top: 5,
    bottom: 5,
    left: 25,
    right: 25,
};

export const PortfolioLocationsMap: FC<PortfolioLocationsMapProps> = ({
    locations,
    mapSourceId = 'portfolio-locations',
    onLocationSelected,
    mapCenter,
    zoomOutOnMapCenterReset = false,
    showLocationPopup = false,
}) => {
    const [map, setMap] = useState<mapboxgl.Map | undefined>();

    const data: GeoJSON.FeatureCollection<GeoJSON.Geometry> = useMemo(
        () =>
            locations.length
                ? {
                      type: 'FeatureCollection',
                      features: locations.map(
                          ({ geometry, id, name, color }) => {
                              return {
                                  type: 'Feature',
                                  geometry: {
                                      type: 'Point',
                                      coordinates: [
                                          geometry.longitude,
                                          geometry.latitude,
                                      ],
                                  },
                                  id: id,
                                  properties: {
                                      id: id,
                                      name: name,
                                      color: color || '#2EAEE2',
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
            data: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
            withRecenter: boolean = true
        ) => {
            (mapRef.getSource(mapSourceId) as GeoJSONSource)?.setData(data);
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
                    maxZoom: MAP_BOUNDS_MAX_ZOOM,
                });
            }
            setMap(mapRef);
        },
        [mapSourceId]
    );

    const onLocationsLoaded = useCallback(
        (mapRef: mapboxgl.Map) => {
            if (!mapRef.getSource(mapSourceId)) {
                mapRef.addSource(mapSourceId, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] },
                    cluster: true,
                    clusterRadius: 10,
                });

                mapRef.addLayer({
                    id: `clusters`,
                    type: 'symbol',
                    source: mapSourceId,
                    filter: ['has', 'point_count'],
                    layout: {
                        'icon-image': 'custom-marker',
                        'icon-anchor': 'bottom',
                        'icon-offset': [0, 10],
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                    },
                });

                mapRef.addLayer({
                    id: `unclustered-point`,
                    type: 'circle',
                    source: mapSourceId,
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': ['get', 'color'],
                        'circle-radius': 5,
                        'circle-stroke-width': 0,
                        'circle-stroke-color': '#000000',
                    },
                });

                mapRef.on('click', `clusters`, (e) => {
                    if (
                        e.features?.[0]?.properties &&
                        (e.features?.[0]?.geometry as Point)?.coordinates
                    ) {
                        const clusterId = e.features[0].properties.cluster_id;
                        const coordinates = (e.features?.[0]?.geometry as Point)
                            .coordinates as LngLatLike;

                        (
                            mapRef.getSource(mapSourceId) as GeoJSONSource
                        ).getClusterExpansionZoom(clusterId, (err, zoom) => {
                            if (err) return;

                            mapRef.easeTo({
                                center: coordinates,
                                zoom: zoom!,
                            });
                        });
                    }
                });

                mapRef.on('click', `unclustered-point`, (e) => {
                    if (e.features?.[0]?.properties) {
                        onLocationSelected?.(e.features?.[0].properties.id);
                    }
                });

                const clusterPopup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                });
                let clusterPopupId: undefined | string;

                const onClusterHover = (event: MapMouseEvent) => {
                    if (!event) {
                        return;
                    }

                    if (!event.features) {
                        return;
                    }

                    const cluster = event.features[0];

                    if (!cluster) {
                        return;
                    }

                    const clusterId = cluster.properties.cluster_id;
                    if (clusterId === clusterPopupId) {
                        return;
                    }

                    clusterPopupId = clusterId;
                    const coordinates = cluster.geometry.coordinates.slice();
                    if (
                        ['mercator', 'equirectangular'].includes(
                            mapRef.getProjection().name
                        )
                    ) {
                        while (
                            Math.abs(event.lngLat.lng - coordinates[0]) > 180
                        ) {
                            coordinates[0] +=
                                event.lngLat.lng > coordinates[0] ? 360 : -360;
                        }
                    }

                    clusterPopup
                        .setLngLat(coordinates)
                        .setHTML(`${cluster.properties.point_count} locations`)
                        .addTo(mapRef);
                };

                mapRef.on('mouseenter', 'clusters', onClusterHover);

                mapRef.on('mousemove', 'clusters', onClusterHover);

                mapRef.on('mouseleave', 'clusters', () => {
                    clusterPopup.remove();
                    clusterPopupId = undefined;
                });

                if (showLocationPopup) {
                    const pointPopup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                    });
                    let pointPopupId: undefined | string;

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

                        const pointId = point.properties.id;
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
                            while (
                                Math.abs(event.lngLat.lng - coordinates[0]) >
                                180
                            ) {
                                coordinates[0] +=
                                    event.lngLat.lng > coordinates[0]
                                        ? 360
                                        : -360;
                            }
                        }

                        const popupHTML = point.properties.name
                            ? `Location ID: ${point.properties.id} <br/> Location Name: ${point.properties.name}`
                            : `Location ID: ${point.properties.id}`;

                        pointPopup
                            .setLngLat(coordinates)
                            .setHTML(popupHTML)
                            .addTo(mapRef);
                    };

                    mapRef.on('mouseenter', 'unclustered-point', onPointHover);

                    mapRef.on('mousemove', 'unclustered-point', onPointHover);

                    mapRef.on('mouseleave', 'unclustered-point', () => {
                        pointPopup.remove();
                        pointPopupId = undefined;
                    });
                }
            }
            setMap(mapRef);
        },
        [mapSourceId, onLocationSelected, showLocationPopup]
    );

    const zoomOutToShowAllLocations = useCallback(() => {
        if (!zoomOutOnMapCenterReset) {
            return;
        }
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
            maxZoom: MAP_BOUNDS_MAX_ZOOM,
        });
    }, [data, map, zoomOutOnMapCenterReset]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (!mapCenter) {
            zoomOutToShowAllLocations();
            return;
        }

        const minZoom = map.getMinZoom();
        const mapZoom = map.getZoom();

        const zoomLevel =
            mapZoom === minZoom
                ? LOCATION_VIEW_MAP_DEFAULT_ZOOM
                : Math.max(mapZoom, LOCATION_VIEW_MAP_DEFAULT_ZOOM);
        map.flyTo({
            center: mapCenter,
            zoom: zoomLevel,
            screenSpeed: 3,
        });
    }, [mapCenter, map, zoomOutToShowAllLocations]);

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
                {map && <MapControls map={map} />}
            </Box>
        </Box>
    );
};
