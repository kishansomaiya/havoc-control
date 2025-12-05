import { ComponentProps, FC, useEffect, useRef, useState } from 'react';
import * as mapboxgl from 'mapbox-gl';
import { mapboxAccessToken } from '../../config';
import Pointer from './pointer.svg';
import PointerHover from './pointer-hover.svg';
import { MAP_MAX_ZOOM, MAP_MIN_ZOOM } from '../../const';

export enum MapStyleName {
    Standard = 'standard',
    Terrain = 'terrain',
    Satellite = 'satellite',
}

export const DEFAULT_MAP_STYLE_NAME = MapStyleName.Terrain;

export const mapStyles = {
    [MapStyleName.Standard]: 'mapbox://styles/mapbox/standard',
    [MapStyleName.Terrain]:
        'mapbox://styles/tylerlan/clucwc1nb027o01nw6do73r1p',
    [MapStyleName.Satellite]:
        'mapbox://styles/tylerlan/clucwad2a027m01nw3qxk6mn8',
};

export const MAP_STYLE_NAME_STORAGE_KEY = 'mapStyleName';

export interface MapboxMapProps extends ComponentProps<'div'> {
    data?: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    onDataLoad?: (
        mapRef: mapboxgl.Map,
        data: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
        withRecenter?: boolean
    ) => void;
    onDataLoaded?: (mapRef: mapboxgl.Map) => void;
}

const defaultCenter = mapboxgl.LngLat.convert([
    5.462930415982479, 51.42728006687647,
]);
const defaultZoom = 0;

const CUSTOM_IMAGES_MAP = {
    'custom-marker': Pointer,
    'custom-hover-marker': PointerHover,
};

export const MapboxMap: FC<MapboxMapProps> = ({
    children,
    data,
    onDataLoad,
    onDataLoaded,
    ...props
}) => {
    const [isInitalized, setIsInitalized] = useState(false);
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const isFirsLoad = useRef<boolean>(false);

    useEffect(() => {
        if (!isInitalized || !mapRef.current || !data) {
            return;
        }

        const handleDataLoad = () => {
            if (onDataLoad) {
                onDataLoad(mapRef.current!, data, !isFirsLoad.current);
            }
        };

        handleDataLoad();
        mapRef.current.on('style.load', handleDataLoad);

        isFirsLoad.current = true;

        return () => {
            if (mapRef.current) {
                mapRef.current.off('style.load', handleDataLoad);
            }
        };
    }, [onDataLoad, data, isInitalized]);

    useEffect(() => {
        if (mapRef.current !== null) {
            return;
        }
        if (mapContainer.current === null) {
            return;
        }

        const mapStyleName =
            (localStorage.getItem(MAP_STYLE_NAME_STORAGE_KEY) as
                | MapStyleName
                | undefined) || DEFAULT_MAP_STYLE_NAME;

        const map = new mapboxgl.Map({
            accessToken: mapboxAccessToken,
            container: mapContainer.current,
            center: defaultCenter,
            zoom: defaultZoom,
            maxZoom: MAP_MAX_ZOOM,
            minZoom: MAP_MIN_ZOOM,
            style: mapStyles[mapStyleName],
            renderWorldCopies: false,
        });

        const handleMapLoaded = () => {
            map.setProjection('mercator');
            map.setFog({});

            Object.entries(CUSTOM_IMAGES_MAP).forEach(([key, image]) => {
                fetch(image)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const dataUrl = URL.createObjectURL(blob);
                        const customIcon = new Image(15, 18);
                        customIcon.onload = () => {
                            if (!map.hasImage(key)) {
                                map.addImage(key, customIcon);
                            }
                            URL.revokeObjectURL(dataUrl); // Release the object URL
                        };
                        customIcon.src = dataUrl;
                    });
            });

            map.on('mouseenter', `clusters`, (e) => {
                if (e.features?.[0]?.properties) {
                    map.getCanvas().style.cursor = 'pointer';
                }
            });

            map.on('mouseleave', `clusters`, () => {
                map.getCanvas().style.cursor = '';
            });

            map.on('mouseenter', `unclustered-point`, (e) => {
                if (e.features?.[0]?.properties) {
                    map.getCanvas().style.cursor = 'pointer';
                }
            });

            map.on('mouseleave', `unclustered-point`, () => {
                map.getCanvas().style.cursor = '';
            });

            onDataLoaded && onDataLoaded(map);
        };

        mapRef.current = map;

        const handleDataLoaded = () => {
            if (onDataLoaded) {
                onDataLoaded(map);
            }
            handleMapLoaded();
        };

        map.once('load', handleMapLoaded);
        map.on('style.load', handleDataLoaded);

        setIsInitalized(true);

        return () => {
            map.off('load', handleMapLoaded);
            map.off('style.load', handleDataLoaded);
            map.remove();
            mapRef.current = null;
        };
    }, [onDataLoaded]);

    return (
        <div
            {...props}
            ref={mapContainer}
            data-testid="mapboxgl-map"
        >
            {children}
        </div>
    );
};
