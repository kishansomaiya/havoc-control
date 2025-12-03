import { IconButton, styled, type IconButtonProps } from '@mui/material'
import { Close } from '@carbon/icons-react'

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== '$dialogBtn',
})<{
  $dialogBtn?: boolean
}>`
  min-width: unset;
  height: ${({ $dialogBtn }) => ($dialogBtn ? '32px !important' : '44px !important')};
  width: ${({ $dialogBtn }) => ($dialogBtn ? '32px !important' : '44px !important')};
`

interface Props extends Omit<IconButtonProps, 'onClick'> {
  onClose?: () => void
  //TODO: Review if we still need this after standardizing dialog and drawer usage
  dialogButton?: boolean
}

/**
 * CloseButton - A styled close button for drawers and modals with entity management integration
 *
 * This component renders a styled IconButton with a close icon that handles both entity state
 * management and custom close actions. It's commonly used in drawers, modals, and detail views
 * to provide a consistent close interaction. The button automatically manages entity provider
 * state when setActive is provided, and can also trigger custom close logic.
 *
 * @component
 * @example
 * ```tsx
 * import CloseButton from './closeButton'
 *
 * // Basic usage with custom close handler
 * <CloseButton onClose={() => console.log('Closed')} />
 * ```
 *
 * @param {Object} props - Component props
 * @param {() => void} [props.onClose] - Custom close handler function. Called when the button is clicked,
 *   typically for additional cleanup or navigation logic.
 * @param {boolean} [props.dialogButton] - Whether the button is in a dialog. If true, the button will be styled differently.
 *
 * @returns {JSX.Element} A styled IconButton with close functionality
 *
 * @see EntityDrawer - Common parent component that uses CloseButton
 * @see PlayHeader - Component that uses CloseButton for play management
 * @see EntityProvider - Type for entity state management
 */

export const CloseButton = ({ onClose, dialogButton, ...props }: Props) => {
  return (
    <StyledIconButton
      onClick={onClose}
      $dialogBtn={dialogButton}
      data-testid='close-button'
      aria-label='close'
      {...props}
    >
      <Close size={24} />
    </StyledIconButton>
  )
}
