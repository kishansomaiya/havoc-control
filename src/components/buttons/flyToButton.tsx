import { type IconButtonProps } from "@mui/material"
import TooltipIconButton from "./tooltipIconButton"
import FLY_TO_ICON from "../../assets/icons/fly-to-icon.svg"

interface FlyToButtonProps extends Omit<IconButtonProps, 'children'> {
  flyToLocation: string
  onHandleFlyToClick: () => void
}

/**
 * @component
 * FlyToButton - Wrapper component for TooltipIconButton to pass in specialized props for "Fly to" functionality
 * 
 * Renders the TooltipIconButton with FlyTo icon and sends specialized title/img alt text with the location param in it
 * 
 * @param {Object} props - Props of the component, extends IconButton props and additional props beyond component specific ones will be passed down to TooltipIconButton
 * @param {string} props.flyToLocation - String of the place this will "fly" to
 * @param {Function} props.onHandleFlyToClick - What clicking on this fly button will do
 * 
 * @returns {JSX.Element} An IconButton with a tooltip displayed on hover 
 * 
 * @see PlayDetails - Component that uses FlyToButton
 * @see TeamHeaderButtons - Component that uses FlyToButton
 * 
 * @note
 *  For the Components listed below, there is a slight distinction in that
 *  some of them use "Go to {location}" for both the title and img alt text.
 *  If this is so important that we can't just go with one title over the other
 *  we can add a param to change it up (but really lets just choose consistent text for the title).
 *  Also, if the functionally of "Fly to" is consistent between all the components that use it,
 *  it would be worth it to see if we can implement that functionality here and accept an argument
 *  for what to fly to
 *  
 * @see MarkerHeaderButtons - Component that SHOULD've used this (but didn't in old codebase)
 * @see TerminalHeaderButtons - Component that SHOULD've used this (but didn't in old codebase)
 * @see TrackHeaderButtons - Component that SHOULD've used this (but didn't in old codebase)
 * @see VehicleHeaderButtons - Component that SHOULD've used this (but didn't in old codebase)
 * @see ZonesHeaderButtons - Component that SHOULD've used this (but didn't in old codebase)
 * @see DriftDetails - Component that SHOULD've used this (but didn't in old codebase)
 * @see PatrolDetails - Component that SHOULD've used this (but didn't in old codebase)
 * @see RouteDetails - Component that SHOULD've used this (but didn't in old codebase)
 * @see SearchDetails - Component that SHOULD've used this (but didn't in old codebase)
 * @see EntitySelectorList - Component that SHOULD've used this (but didn't in old codebase)
 * 
 * @see CheckoutDetails - Component that might be able to use this, but the structure of the tooltip is different
 * @see EscortDetails - Component that might be able to use this, but the structure of the tooltip is different
 * @see FormationDetails - Component that might be able to use this, but the structure of the tooltip is different
*/
export const FlyToButton = ({ flyToLocation, onHandleFlyToClick, sx = {}, ...props }: FlyToButtonProps) => (
  <TooltipIconButton
    title={`Fly to ${flyToLocation}`}
    imgSrc={FLY_TO_ICON}
    imgAlt={`Go to ${flyToLocation}`}
    onClick={onHandleFlyToClick}
    sx={{
      width: '44px',
      height: '44px',
      padding: '6px',
      marginLeft: '8px',
      ...sx
    }}
    {...props}
  />
)