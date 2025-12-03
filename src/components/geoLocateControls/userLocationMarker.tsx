import { useAppSelector } from '../../store/hooks'
import { styled } from '@mui/material/styles'
import { Marker } from 'react-map-gl'

const StyledMarker = styled(Marker)`
  .blue-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-user-location-background);
    box-shadow: 0 0 0 0 rgba(var(--rgb-user-location-shadow), 0.4);
    cursor: default;
  }
`

/**
 * @returns {JSX.Element} Map-GL marker component to pin an image onto the map
 */
const UserLocationMarker = () => {
  const { userLocation } = useAppSelector((state) => state.mapViewState)

  if (!userLocation) return null

  return (
    <StyledMarker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor='center'>
      <div className='blue-marker' />
    </StyledMarker>
  )
}

export default UserLocationMarker
