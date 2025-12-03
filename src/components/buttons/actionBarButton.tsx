import { Button, styled } from '@mui/material'

/**
 * ActionBarButton - A styled button component for action bars with flexible width control
 *
 * This component is a styled Material-UI Button designed specifically for use in action bars
 * and similar UI patterns. It features rounded borders, and
 * flexible width control through percentage-based sizing. The button automatically grows to
 * fill available space and supports custom width percentages for precise layout control.
 *
 * @component
 * @example
 * ```tsx
 * import { ActionBarButton } from './ActionBarButton'
 *
 * // Basic usage in action bar
 * <ActionBarButton onClick={handleSave} $width={30}>
 *   Save Changes
 * </ActionBarButton>
 *
 * // With custom styling
 * <ActionBarButton
 *   onClick={handleUpload}
 *   sx={{ background: 'var(--color-primary)' }}
 *   $width={50}
 * >
 *   Upload File
 * </ActionBarButton>
 * ```
 *
 * @param {Object} props - Component props (extends Material-UI Button props)
 * @param {number} props.$width - Width as a percentage (e.g., 30 for 30%).
 * @param {string} props.color - color for button background, defaults to primary button color
 *   Must be greater than 24 to take effect, otherwise uses auto width.
 *
 * @returns {JSX.Element} A styled Button component with action bar styling
 *
 * @see ActionBar - Common parent component that uses ActionBarButton
 * @see FileUploader - Component that uses ActionBarButton for file upload actions
 */
export const ActionBarButton = styled(Button, { shouldForwardProp: (prop) => prop !== '$width' && prop !== '$color' })<{
  $width?: number
  $color?: string
}>`
  border-radius: var(--border-radius);
  background: ${({ $color }) => $color || 'var(--color-button-primary)'};
  color: #fff;
  padding: 0 20px;
  height: var(--size-button-height);
  gap: 8px;
  flex-grow: 1;
  flex-basis: ${({ $width }) => ($width && $width > 24 ? `${$width}%` : 'auto')};
  font-weight: 700;

  & .MuiButton-startIcon {
    margin-right: 0;
  }

  &:hover {
    background: ${({ $color }) => `color-mix(in srgb, #fff 12%, ${$color || 'var(--color-button-primary)'})`};
  }

  &:disabled,
  &.disabled {
    background: var(--color-disabled);
  }
`
