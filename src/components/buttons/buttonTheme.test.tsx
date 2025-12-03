import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Stack, Button, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles';
import { havocTheme } from "../../common/havocTheme.ts"


describe('MUI Button link variant', () => {
  it('renders a MUI Button with the link variant class', () => {
    render(
      <ThemeProvider theme={havocTheme}>
        <Button variant="link">
          Test Link Button
        </Button>
      </ThemeProvider>
    )

    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-link');

    const computed = window.getComputedStyle(button)
    expect(computed.height).toBe('40px')
  })
});

describe('MUI Box with multi-button-container class', () => {
  it('renders a MUI IconButton with the ToolButton class', () => {
    render(
      <ThemeProvider theme={havocTheme}>
        <Stack className="multi-button-container" data-testid="multi-button-container-test">
          <Button>Button A</Button>
          <Button>Button B</Button>
          <Button>Button C</Button>
        </Stack>
      </ThemeProvider>
    )

    const stack = screen.getByTestId('multi-button-container-test')
    expect(stack).toHaveClass('multi-button-container');

    const buttons = stack.querySelectorAll("button")
    buttons.forEach((button) => {
      const computed = window.getComputedStyle(button)
      expect(computed.minHeight).toBe('44px')
    })
  })
});

describe('MUI Icon button with ToolButton class', () => {
  it('renders a MUI IconButton with the ToolButton class', () => {
    render(
      <ThemeProvider theme={havocTheme}>
        <IconButton className="tool-button">
          Pretend this is a icon
        </IconButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button');
    expect(button).toHaveClass('tool-button');
    
    const computed = window.getComputedStyle(button)
    expect(computed.height).toBe('32px')
  })
});

describe('ToggleButtonGroup Tests', () => {
  it('works correctly with multiple buttons in a group', () => {
    const mockOnChange = vi.fn()

    render(
      <ToggleButtonGroup className="havoc-toggle-button-group" value='option2' onChange={mockOnChange}>
        <ToggleButton value='option1'>Option 1</ToggleButton>
        <ToggleButton value='option2'>Option 2</ToggleButton>
        <ToggleButton value='option3'>Option 3</ToggleButton>
      </ToggleButtonGroup>
    )

    // Verify only one button is selected
    const selectedButtons = screen.getAllByRole('button').filter((button) => button.classList.contains('Mui-selected'))
    expect(selectedButtons).toHaveLength(1)
    expect(selectedButtons[0]).toBeInstanceOf(HTMLElement)

    // Test clicking different button
    const option1 = screen.getByRole('button', { name: 'Option 1' })
    fireEvent.click(option1)

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('maintains consistent styling across all buttons in group', () => {
    render(
      <ThemeProvider theme={havocTheme}>
        <ToggleButtonGroup className="havoc-toggle-button-group" value='option1' onChange={() => { }}>
          <ToggleButton value='option1'>Option 1</ToggleButton>
          <ToggleButton value='option2'>Option 2</ToggleButton>
          <ToggleButton value='option3'>Option 3</ToggleButton>
        </ToggleButtonGroup>
      </ThemeProvider>
    )

    const buttons = screen.getAllByRole('button')

    // All buttons should have the same height and flex properties
    buttons.forEach((button) => {
      const computed = window.getComputedStyle(button)
      expect(computed.height).toBe('40px')
    })
  })
})
