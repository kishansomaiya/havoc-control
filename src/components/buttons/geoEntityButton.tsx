import { Stack, Button, Typography, styled } from '@mui/material'
import { type JSX, type ReactNode } from 'react'

/**
 * Props for the GeoEntityButton component
 */
interface GeoEntityButtonProps {
  /** Icon element to display at the start of the button */
  icon: JSX.Element | ReactNode
  /** Main title text displayed in the button */
  title: string
  /** Subtitle text displayed below the title */
  subtitle: string | JSX.Element
  /** Callback function triggered when the button is clicked */
  onClick: () => void
  selected?: boolean
}

/**
 * Styled Button component for HUD buttons
 * Provides consistent styling for button with hover effects
 */
const StyledButton = styled(Button, { shouldForwardProp: (prop) => prop !== '$isSelected' })<{
  $isSelected: boolean
}>`
  background-color: ${({ $isSelected }) =>
    $isSelected ? 'var(--color-button-primary)' : 'var(--surface-container-high)'};
  height: 50px;
  justify-content: flex-start;
  padding-left: 12px;

  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected
        ? 'var(--color-button-primary-hover)'
        : 'color-mix(in srgb, var(--surface-container-high), var(--color-primary) 20%)'};
  }
`

/**
 * Styled Typography component for button text
 * Provides consistent styling for title and subtitle text within HUD buttons
 */
const StyledButtonText = styled(Typography)`
  width: 100%;
  text-align: left;
  padding-left: 8px;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-color-on-surface);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
/**
 * GeoEntityButton component - A specialized button for HUD (Heads-Up Display) interfaces
 *
 * This component renders a button with an icon, title, and subtitle text.
 * It's designed for use in HUD interfaces where buttons need to display
 * both primary and secondary information in a compact format.
 *
 * @param props - The component props
 * @param props.icon - Icon element to display at the start of the button
 * @param props.title - Main title text displayed in the button
 * @param props.subtitle - Subtitle text displayed below the title
 * @param props.onClick - Callback function triggered when the button is clicked
 *
 * @returns JSX element representing the HUD button
 *
 * @example
 * ```tsx
 * <GeoEntityButton
 *   icon={<SomeIcon />}
 *   title="Action Title"
 *   subtitle="Action description"
 *   onClick={() => console.log('Button clicked')}
 * />
 * ```
 */
const GeoEntityButton = ({ icon, title, subtitle, onClick, selected = false }: GeoEntityButtonProps) => {
  return (
    <Stack direction="row" sx={{ px: 1.5, py: '6px' }}>
      <StyledButton startIcon={icon} onClick={onClick} fullWidth $isSelected={selected} aria-selected={selected} data-testid={`geo-entity-button-${title.toLowerCase().replace(/\s/g, "-")}`}>
        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <StyledButtonText>{title}</StyledButtonText>
          {/* h5 prevents error message from being displayed w/child h6*/}
          <StyledButtonText variant='h5'>{subtitle}</StyledButtonText>
        </Stack>
      </StyledButton>
    </Stack>
  )
}

export default GeoEntityButton
