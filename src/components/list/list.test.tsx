import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { List } from './list'

describe('List', () => {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ]

  it('renders all items', () => {
    render(<List rows={items} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('renders empty state if no items', () => {
    render(<List rows={[]} />)
    expect(screen.getByText(/no items/i)).toBeInTheDocument()
  })
})
