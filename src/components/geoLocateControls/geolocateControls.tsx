import { setGoToPoints, setUserLocation } from '../../store/features/mapViewStateSlice'
import TooltipIconButton from "../buttons/tooltipIconButton"
import type { SxProps, Theme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import { useAppDispatch } from '../../store/hooks'
import { MyLocation } from '@mui/icons-material'
import Toast from '../toast/Toast'
import { useState, type JSX } from 'react'

interface GeolocateControlsProps {
  dataTestId?: string
  sx?: SxProps<Theme>
}

const ICON_SIZE = 16; 
const ZOOM_DELAY = 50; // Time in ms to delay to allow zoom animation

/**
 * Note for potential refactor
 *
 * Move state logic into a hook and return the click function and loading states
 * Good to do if we expand this function to various other buttons or for access to 3rd party devs
 */

/**
 * @component
 * GeolocateControls - Extended TooltipIconButton that takes user to their location on the map
 *
 * This component renders a TooltipIconButton with functionality for setting the global state of 
 * user's current location and passing in specialized data to the TooltipButton (icon, click function).
 * Also uses the Toast component and handles error when user location cannot be retrieved.
 * 
 * @param {Object} props - The component's properties
 * @param {string} props.dataTestId - test id to pass in if we end up having multiple buttons
 * @param {SxProps<Theme>} props.sx - MUI styling param
 * 
 * @returns {JSX.Element} TooltipIconButton that takes user to their current location on the map
 */
const GeolocateControls = ({dataTestId = "geolocate-controls", sx = {}}: GeolocateControlsProps): JSX.Element => {
  const dispatch = useAppDispatch()

  const [showToast, setShowToast] = useState(false)
  const [awaitingZoom, setAwaitingZoom] = useState(false)
  
  // Attempts to retrieve the user's location and zoom the map to that location
  const handleClick = async () => {
    // Start the process and set the UI state to "awaiting zoom"
    setAwaitingZoom(true)

    // Add a small delay before performing the zoom
    // This allows the button's loading state to render first
    await new Promise(resolve => setTimeout(resolve, ZOOM_DELAY));

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      // If not, show a toast and bail out
      setShowToast(true)
      return
    }

    // Attempt to get the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // On success, extract latitude and longitude
        const { latitude, longitude } = position.coords

        if (!longitude || !latitude) {
          // Clear the loading state since the attempt failed
          setAwaitingZoom(false)
          return
        }

        // If the map is available, fly to the user's location
        dispatch(setGoToPoints({ points: [[longitude, latitude]] }))

        // Store the user's location in state to display the marker
        dispatch(setUserLocation({ latitude, longitude }))

        // Since we've successfully zoomed, clear the loading state
        setAwaitingZoom(false)
      },
      () => {
        // On error (user denies or another error), show toast
        setShowToast(true)
        // Clear the loading state since the attempt failed
        setAwaitingZoom(false)
      }
    )
  }
  return (
    <>
      <TooltipIconButton
        className="tool-button"
        title='Go to my location'
        tooltipProps={{ placement: 'top' }}
        onClick={handleClick}
        disabled={awaitingZoom}
        sx={{ position: 'relative', '@media (max-height: 566px)': { display: 'none' }, ...sx }}
        data-testid={dataTestId}
      >
        {awaitingZoom ? (
          <CircularProgress sx={{ position: 'absolute', height: `${ICON_SIZE}px !important`, width: `${ICON_SIZE}px !important` }} />
        ) : (
          <MyLocation sx={{ width: ICON_SIZE, height: ICON_SIZE }} />
        )}
      </TooltipIconButton>
      {showToast && (
        <Toast
          message='Location access is required to use this feature'
          onClose={() => setShowToast(false)}
          duration={5000}
        />
      )}
    </>
  )
}

export default GeolocateControls
