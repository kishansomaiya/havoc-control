import { forwardRef, useEffect } from "react"
import { useGetEntityQuery } from "../../store/havocAPI"

const Vehicles = forwardRef<maplibregl.Map | null>((_, ref) => {
  const map = ref as React.MutableRefObject<maplibregl.Map | null>
  const { data: vehicles } = useGetEntityQuery('boat')

  useEffect(() => {
    if (!vehicles) return

    //Convert the vehicles data into GeoJSON format
    const vehicleGeoJSON = {
      type: 'FeatureCollection',
      features: vehicles?.values.map((vehicle) => {
        const { longitude, latitude } = vehicle.status.position.location || {}
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {
            id: vehicle.meta.id,
            name: vehicle.meta.name,
            type: vehicle.type,
            heading: vehicle.status.position.heading || 0,
          },
        }
      }),
    }

    if (vehicleGeoJSON) {
      const vehicleSource = map.current?.getSource('vehicles') as maplibregl.GeoJSONSource
      if (vehicleSource) {
        vehicleSource.setData(vehicleGeoJSON)
      } else {
        map.current?.addSource('vehicles', {
          type: 'geojson',
          data: vehicleGeoJSON,
        })

        map.current?.addLayer({
          id: 'vehicles',
          type: 'symbol',
          source: 'vehicles',
          layout: {
            'icon-rotation-alignment': 'map',
            'icon-image': 'boat-icon-small',
            'icon-rotate': ['get', 'heading'],
            'icon-allow-overlap': true,
          },
        })
      }
    }
  }, [map, vehicles])

  return null
})

export default Vehicles
