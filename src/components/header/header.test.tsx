import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from './header'

const mockOnBack = vi.fn()
const mockOnClose = vi.fn()

describe('Header', () => {
  it('renders the title', () => {
    const { container } = render(<Header title="Test Title" />);
    const titleContainer = container.querySelector('.title-container');
    expect(titleContainer).toHaveTextContent('Test Title');
  })

  it('renders the back button when onBack is provided', () => {
    const { container } = render(<Header title="Test Title" onBack={mockOnBack} />)
    const titleContainer = container.querySelector('.title-container');
    const headerBackButton = container.querySelector('.header__back-button');
    expect(headerBackButton).toBeInTheDocument()
    expect(titleContainer).toHaveTextContent('Test Title');
  })

  it('calls onBack when back button is clicked', () => {
    const { container } = render(<Header title="Test Title" onBack={mockOnBack} />)
    const headerBackButton = container.querySelector('.header__back-button');
    if (headerBackButton) {
      fireEvent.click(headerBackButton)
    }
    expect(mockOnBack).toHaveBeenCalled()
  })

  it('renders the close button when onClose is provided', () => {
    const { container } = render(<Header title="Test Title" onClose={mockOnClose} />)
    const closeButton = container.querySelector('[data-testid="close-button"]')
    expect(closeButton).not.toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    const { container } = render(<Header title="Test Title" onClose={mockOnClose} />)
    const closeButton = container.querySelector('[data-testid="close-button"]')
    if (closeButton) {
      fireEvent.click(closeButton)
    }
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders both back and close buttons when both props are provided', () => {
    const { container } = render(<Header title="Test Title" onBack={mockOnBack} onClose={mockOnClose}/>)
    const headerBackButton = container.querySelector('.header__back-button');
    const closeButton = container.querySelector('[data-testid="close-button"]')

    expect(headerBackButton).not.toBeNull()
    expect(closeButton).not.toBeNull()
  })
})
