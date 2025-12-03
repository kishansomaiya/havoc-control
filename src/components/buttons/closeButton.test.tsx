import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CloseButton } from './closeButton'

describe('CloseButton', () => {
  it('calls onClose when clicked', () => {
    const onClose = vi.fn()
    render(<CloseButton onClose={onClose} />)
    fireEvent.click(screen.getByTestId('close-button'))
    expect(onClose).toHaveBeenCalled()
  })

  it('applies dialogButton prop styling', () => {
    render(<CloseButton dialogButton />)
    const button = screen.getByTestId('close-button')
    const computedStyle = getComputedStyle(button)
    expect(computedStyle.height).toBe('32px')
    expect(computedStyle.width).toBe('32px')
  })
})
