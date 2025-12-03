import { Button, Stack, Switch, Typography, styled } from '@mui/material'
import React, { useMemo } from 'react'

const SwitchButtonContainer = styled(Button)(({theme}) => `
    width: 100%;
    background: var(--surface-dim-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacing(1.5)};
    border-radius: var(--border-radius, 8px);
    margin-top: ${theme.spacing(1)};
`)

interface SwitchButtonCommonProps {
    checked: boolean
    onToggle: () => void 
    disabled?: boolean
}

interface WithIconProp {
    icon: React.ReactNode
    title?: never
    testIdentifier: string
}

interface WithTitleProp {
    icon?: never
    title: string
    testIdentifier?: string
}

interface WithBothProps {
    icon: React.ReactNode
    title: string
    testIdentifier?: string
}

// Union of all the props to optionally allow users to pass in only the icon, only text, or both
type SwitchButtonProps = SwitchButtonCommonProps & (WithIconProp | WithTitleProp | WithBothProps);

/**
 * SwitchButton - A toggle component for entity layer visibility with automatic name formatting
 *
 * Provides a standardized toggle button for switching between 2 states
 * Can pass in icon, text, or both for labeling the switch
 * Uses Switch component for visual state indication.
 *
 * @example
 * ```tsx
 * // Basic usage with layer name and icon
 * <SwitchButton
 *   checked={checked}
 *   onClick={(e, changeTo) => setChecked(changeTo)}
 *   icon={<VehicleIcon />}
 *   title={"I Like Ships"}
 * />
 *
 * // Optoinally with disabled passed in
 * <SwitchButton
 *   checked={checked}
 *   onClick={(e, changeTo) => setChecked(changeTo)}
 *   disabled={iHateShipsBoolean}
 *   icon={<VehicleIcon />}
 *   title={"I Like Ships"}
 * />
 *
 * // Leave Icon out
 * <SwitchButton
 *   checked={checked}
 *   onClick={(e, changeTo) => setChecked(changeTo)}
 *   title={"I Like Ships"}
 * />
 * 
 * // Leave Title out
 * <SwitchButton
 *   checked={checked}
 *   onClick={(e, changeTo) => setChecked(changeTo)}
 *   icon={<VehicleIcon />}
 *   testIdentifier={"ship switcher"}
 * />
 * 
 * ```
 * @param {Object} props - The component's properties
 * @param {boolean} props.checked - State of the toggle
 * @param {Function} props.onToggle - Function to handle what clicking button does. Ideally to change the checked state, but you do you. 
 * @param {React.ReactNode} props.icon - Optional (If title is given) ReactNode to display button switch icon
 * @param {string} props.title - Optional (If icon is given) text to display
 * @param {boolean} props.disabled - Optional param to indicate switch is disabled
 * @param {string} props.testIdentifier - Semi Optional param that must be passed in if no title. Used for aria label and as a automation test identifier if title is left out. Use with title if unique Identifier for test cases is needed 
*
 * @returns JSX.Element - Toggle component with layer controls and state indication
 *
 * @see Switch - Toggle component used for state indication
 *
 */
const SwitchButton = ({ checked, onToggle, icon, title, disabled = false, testIdentifier }: SwitchButtonProps) => {
  const testingLabel = useMemo(() => {
    return testIdentifier ? testIdentifier?.toLowerCase().replace(/\s/g, "_") : title?.toLowerCase().replace(/\s/g, "_") 
  }, [title, testIdentifier])

  return (
    <SwitchButtonContainer disabled={disabled} onClick={onToggle} data-testid={`switch-button-${testingLabel}`}>
      <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
        {icon && icon}
        {title && <Typography data-testid={`switch-button-title`}>{title}</Typography>}
      </Stack>

      <Switch checked={checked} disabled={disabled} slotProps={{ input: {'aria-label': `Toggle ${title ?? testIdentifier}`} }} data-testid={`switch-button-switch`} />
    </SwitchButtonContainer>
  )
}

export default SwitchButton
