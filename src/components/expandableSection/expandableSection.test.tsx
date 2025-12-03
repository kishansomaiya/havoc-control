import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExpandableSection } from './expandableSection'

describe('ExpandableSection', () => {
  const title = 'Test Section'
  const content = <div>Section Content</div>

  it('renders the title', () => {
    render(
      <ExpandableSection title={title} isExpanded={false} onToggle={() => {}}>
        {content}
      </ExpandableSection>
    )
    expect(screen.getByTestId('expandable-section-title')).toHaveTextContent(title)
  })

  it('shows content when expanded', () => {
    render(
      <ExpandableSection title={title} isExpanded={true} onToggle={() => {}}>
        {content}
      </ExpandableSection>
    )
    expect(screen.getByTestId('expandable-section-content')).toBeVisible()
    expect(screen.getByText('Section Content')).toBeInTheDocument()
  })

  it('hides content when collapsed', () => {
    render(
      <ExpandableSection title={title} isExpanded={false} onToggle={() => {}}>
        {content}
      </ExpandableSection>
    )
    // Collapse content is rendered but not visible
    expect(screen.getByTestId('expandable-section-content')).not.toBeVisible()
  })

  it('calls onToggle when header is clicked', () => {
    const onToggle = vi.fn()
    render(
      <ExpandableSection title={title} isExpanded={false} onToggle={onToggle}>
        {content}
      </ExpandableSection>
    )
    fireEvent.click(screen.getByTestId('expandable-section-title').parentElement!)
    expect(onToggle).toHaveBeenCalled()
  })

  it('renders count when provided', () => {
    render(
      <ExpandableSection title={title} isExpanded={false} onToggle={() => {}} subTitle={3}>
        {content}
      </ExpandableSection>
    )
    expect(screen.getByTestId('expandable-section-title')).toHaveTextContent('Test Section (3)')
  })

  it('removes padding when noPadding is true', () => {
    render(
      <ExpandableSection title={title} isExpanded={true} onToggle={() => {}} noPadding>
        {content}
      </ExpandableSection>
    )
    const contentBox = screen.getByTestId('expandable-section-content').querySelector('.MuiBox-root')
    expect(contentBox).toHaveStyle('padding: 0px 0px 16px;')
  })
})
