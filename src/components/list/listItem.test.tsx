import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ListItem } from './listItem'
import type { RowInfo } from './listItem'

const mockClickFn = vi.fn()

describe('ListItem', () => {
  const baseInfo: RowInfo = {
    id: '1',
    name: 'Test Item',
    icon: <span data-testid="icon">Icon</span>,
    subLabel: 'SubLabel',
    selected: false,
    onClick: mockClickFn,
    additionalItem: <span data-testid="additional">Additional</span>
  }

  it('renders name and subLabel', () => {
    render(<ListItem info={baseInfo} />)
    expect(screen.getByTestId('list-item-text')).toHaveTextContent('Test Item')
    expect(screen.getByTestId('list-item-text')).toHaveTextContent('SubLabel')
  })

  it('renders icon and additionalItem', () => {
    render(<ListItem info={baseInfo} />)
    expect(screen.getByTestId('list-item-icon')).toBeInTheDocument()
    expect(screen.getByTestId('list-item-additional-info')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = mockClickFn
    render(<ListItem info={{ ...baseInfo, onClick }} />)
    fireEvent.click(screen.getByTestId('list-item-button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows ChevronRight if onClick exists', () => {
    const { container } = render(<ListItem info={baseInfo} />)
    expect(container.querySelector('.open-details-button')).toBeInTheDocument()
  })

  it('does not show ChevronRight if onClick is missing', () => {
    const { container } = render(<ListItem info={{ ...baseInfo, onClick: undefined }} />)
    expect(container.querySelector('.open-details-button')).not.toBeInTheDocument()
  })
})
