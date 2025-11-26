import { useRef, useEffect, useState, useMemo } from 'react';
import { useStreamEventsQuery, boatsSelectors } from '../store/havocAPI';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.scss';

const Map = () => {
  const { data: streamData } = useStreamEventsQuery();
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const lng = -83.30139196738446;
  const lat = 45.01442749176368;
  const zoom = 11;

  const vehicles = streamData?.boats ? boatsSelectors.selectAll(streamData.boats) : [];

  const vehicleGeoJSON = useMemo(() => {
    if (!vehicles || vehicles.length === 0) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      };
    }

    return {
      type: 'FeatureCollection' as const,
      features: vehicles.map((vehicle) => {
        const { longitude, latitude } = vehicle.status?.position?.location || {};
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [longitude, latitude],
          },
          properties: {
            id: vehicle.meta?.id,
            name: vehicle.meta?.name,
            type: vehicle.spec?.type,
            heading: vehicle.status?.heading || 0,
          },
        };
      }),
    };
  }, [vehicles]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const vehicleSource = map.current.getSource('vehicles') as maplibregl.GeoJSONSource;
    if (vehicleSource) {
      vehicleSource.setData(vehicleGeoJSON);
    } else {
      map.current.addSource('vehicles', {
        type: 'geojson',
        data: vehicleGeoJSON,
      });

      map.current.addLayer({
        id: 'vehicles',
        type: 'symbol',
        source: 'vehicles',
        layout: {
          'icon-rotation-alignment': 'map',
          'icon-image': 'boat-icon-small',
          'icon-rotate': ['get', 'heading'],
          'icon-allow-overlap': true,
        },
      });
    }
  }, [map, mapLoaded, vehicleGeoJSON]);

  const onMapLoaded = async () => {
    const isMapLoaded = new Promise((resolve) => resolve(map.current?.loaded()));
    const isStyleLoaded = new Promise((resolve) => resolve(map.current?.isStyleLoaded()));

    await Promise.all([isMapLoaded, isStyleLoaded]).then(async () => {
      try {
        const response = await map.current?.loadImage('images/boat-icon-small.png');
        if (response && map.current) {
          map.current.addImage('boat-icon-small', response.data);
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }

      setMapLoaded(true);
    });
  };

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current) return;

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
            },
          ],
        },
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.once('load', onMapLoaded);

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    };

    if (!map.current) {
      initializeMap();
    }
  }, []);

  return (
    <div className="map">
      <div ref={mapContainer} className="map__container" />
    </div>
  );
};

export default Map;
