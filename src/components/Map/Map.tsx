import { useRef, useEffect } from 'react'
import { setMapLoaded } from '../../store/features/mapSlice'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import Vehicles from '../vehicles/vehicles'
import type { RootState } from '../../store'
import './map.scss'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import Test from './test'

const mapInitialState = {
  lng: -83.30139196738446,
  lat: 45.01442749176368,
  zoom: 11,
}

const Map = () => {
  const dispatch = useAppDispatch()

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const { mapLoaded } = useAppSelector((state: RootState) => state.map)
  const { left, right } = useAppSelector((state: RootState) => state.app.appOpenDrawers)

  useEffect(() => {

    const onMapLoaded = async () => {
      const isMapLoaded = new Promise(resolve => resolve(map.current?.loaded()));
      const isStyleLoaded = new Promise(resolve => resolve(map.current?.isStyleLoaded()));

      await Promise.all([isMapLoaded, isStyleLoaded]).then(async () => {
        await map.current?.loadImage('images/boat-icon-small.png')
          .then((response) => {
            map.current?.addImage('boat-icon-small', response.data)
          })
          .catch((error) => {
            console.error('Error loading image:', error);
          });

        dispatch(setMapLoaded(true));
      });
    }

    const initializeMap = () => {
      if (!mapContainer.current) return;

      const { lng, lat, zoom } = mapInitialState

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
      })

      map.current.on('moveend', () => {

      })

      map.current.once('load', onMapLoaded);

      return () => {
        map.current?.remove();
      };
    }

    if (!map.current) initializeMap()

  }, [dispatch])

  useEffect(() => {
    map.current?.easeTo({
      padding: {
        left: left ? 380 : 0,
        right: right ? 300 : 0,
      },
      duration: 300,
    });
  }, [left, right]);

  return (
    <div className="map">
      <div ref={mapContainer} className="map__container" />
      {mapLoaded &&
        <>
          <Vehicles ref={map} />
          {/* <Test /> */}
        </>
      }
    </div>
  )
}

export default Map
