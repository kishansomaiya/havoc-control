import { IconButton, Tooltip, type IconButtonProps, type TooltipProps } from "@mui/material"
import type { JSX } from "react"

interface TooltipIconButtonCommonProps extends IconButtonProps {
  title: string
  imgAlt?: string
  tooltipProps?: Omit<TooltipProps, "title" | "children">;
}

interface WithImgProps extends TooltipIconButtonCommonProps {
  imgSrc: string
  children?: never
}

interface WithChildrenProp extends TooltipIconButtonCommonProps {
  imgSrc?: never
  children: React.ReactNode
}

// Union of all the props to optionally allow users to pass in only the icon, only text, or both
type TooltipIconButtonProps = WithImgProps | WithChildrenProp;


/**
 * @component
 * TooltipIconButton - Component for displaying an IconButton with a Tooltip on hover
 * 
 * Renders MUI IconButton with MUI Tooltip component wrapping it for Tooltip functionality.
 * Adds additional handling of a fallback for img alt to the tooltip title
 * 
 * @example
 * ```tsx
 * import TooltipIconButton from "./tooltipIconButton"
 * import SuperSecretIcon from "./kfc-spice-recipe.png.jpeg"
 * 
 * <TooltipIconButton
 *   title={`KFC Secret Spice Recipe`}
 *   imgSrc={SuperSecretIcon}
 *   imgAlt={`Super Secret`}
 *   onClick={() => alert("no")}
 * />
 *
 * ```
 * 
 * @param {Object} props - Props of the component, extends IconButton props and additional props beyond component specific ones will be passed to IconButton
 * @param {string} props.title - Text for the tooltip and also the fallback for img alt attribute if not supplied
 * @param {Omit<TooltipProps, "title">} props.tooltipProps - Props to pass to the tooltip component such as placement
 * @param {string} props.imgSrc - Url of the image to use for the IconButton
 * @param {string} props.imgAlt - Optional alt text for the image, title is used if left out
 * 
 * @returns {JSX.Element} An IconButton with a tooltip displayed on hover 
 */
const TooltipIconButton = ({ title, tooltipProps, imgAlt, ...props }: TooltipIconButtonProps): JSX.Element => (
  <Tooltip title={title} {...tooltipProps}>
    <IconButton
      data-testid={`tooltip-icon-btn-${title.toLowerCase().replace(/\s/g, "-")}${imgAlt ? `-${imgAlt.toLowerCase().replace(/\s/g, "-")}` : ""}`}
      {...props}
    >
      {props.imgSrc
        ? <img src={props.imgSrc} alt={imgAlt ?? title} />
        : props.children
      }
    </IconButton>
  </Tooltip>
)

export { TooltipIconButton as default, type TooltipIconButtonProps }