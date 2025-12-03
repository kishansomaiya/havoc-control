import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SwitchButton from './switchButton'

const title = "I Like Ships";

describe('Switch Button', () => {
  it('renders SwitchButton component with text, icon, and MUI Switch component', () => {
    render(
      <SwitchButton
        checked={false}
        onToggle={() => {}}
        icon={<span data-testid="boat_icon"></span>}
        title={title}
      />
    )
    expect(screen.getByTestId(`switch-button-${title.toLowerCase().replace(/\s/g, "_")}`)).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId(`boat_icon`)).toBeInTheDocument();
    expect(screen.getByTestId(`switch-button-switch`)).toHaveClass('MuiSwitch-switchBase');
  })
  
  it('Title displayed, but test id should be testidentifier if both are in', () => {
    render(
      <SwitchButton
        checked={false}
        onToggle={() => {}}
        title={title}
        testIdentifier="button-test"
      />
    )

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId('switch-button-button-test')).toBeInTheDocument();
  })

  it('Button is clickable', () => {
    const onClick = vi.fn()
    render(
      <SwitchButton
        checked={false}
        onToggle={onClick}
        icon={<></>}
        testIdentifier="button-test"
      />
    )

    fireEvent.click(screen.getByTestId('switch-button-button-test')!)
    expect(onClick).toHaveBeenCalled()
  })

    it('Disabled Button is not clickable', () => {
    const onClick = vi.fn()
    render(
      <SwitchButton
        checked={false}
        onToggle={onClick}
        icon={<></>}
        testIdentifier="button-test"
        disabled={true}
      />
    )

    fireEvent.click(screen.getByTestId('switch-button-button-test')!)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('Switch component state changes based on passed in boolean', () => {
    const { rerender } = render(
      <SwitchButton
        checked={false}
        onToggle={() => {}}
        title={title}
      />
    )

    const switchButton = screen.getByTestId(`switch-button-switch`);
    expect(switchButton).not.toHaveClass('Mui-checked')

    rerender(
      <SwitchButton
        checked={true}
        onToggle={() => {}}
        icon={<></>}
        title={title}
      />
    );

    expect(switchButton).toHaveClass('Mui-checked')
  })
})