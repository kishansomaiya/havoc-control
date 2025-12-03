import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, within, screen, fireEvent, waitFor } from '@testing-library/react'
import TooltipIconButton from './tooltipIconButton'


describe('Tooltip Button', () => {
  const title = "KFC Secret Spice Recipe"
  const imgSrc = "An image"
  const imgAlt = "Super Secret"
  const testingId = `tooltip-icon-btn-${title.toLowerCase().replace(/\s/g, "-")}-${imgAlt.toLowerCase().replace(/\s/g, "-")}`

  it('Render TooltipButton with all the expected components', () => {
    render(<TooltipIconButton
      title={title}
      imgSrc={imgSrc}
      imgAlt={imgAlt}
      onClick={() => {}}
    />);

    const iconBtn = screen.getByTestId(testingId);
    expect(iconBtn).toBeInTheDocument(); // Component exists
    expect(iconBtn).toHaveClass("MuiIconButton-root"); // Component is of the MuiIconButton-root class

    const imgComponent = within(iconBtn).getByAltText(imgAlt);
    expect(imgComponent).toBeInTheDocument(); // Img is in IconBtn
    expect(imgComponent).toHaveAttribute('src', imgSrc); // Img has the correct src
  })

  it('Icon instead of img', () => {
    const onClick = vi.fn();
    render(<TooltipIconButton
      title={title}
      imgAlt={imgAlt}
      onClick={onClick}
    >
      <div data-testid="the-icon">Real Icon</div>
    </TooltipIconButton>);

    expect(screen.getByTestId("the-icon")).toBeInTheDocument(); // Component exists
  })

  it('Clicking Tooltip button works', () => {
    const onClick = vi.fn();
    render(<TooltipIconButton
      title={title}
      imgSrc={imgSrc}
      imgAlt={imgAlt}
      onClick={onClick}
    />);

    fireEvent.click(screen.getByTestId(testingId))
    expect(onClick).toHaveBeenCalled()
  })

  it('Hover Tooltip button displays tooltip', async () => {
    render(<TooltipIconButton
      title={title}
      imgSrc={imgSrc}
      imgAlt={imgAlt}
      onClick={() => {}}
    />);

    const iconBtn = screen.getByTestId(testingId);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument() // No tooltip found
    fireEvent.mouseEnter(iconBtn)
    await waitFor(() => screen.findByText(title))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument() // Tooltip found
    fireEvent.mouseLeave(iconBtn)
    await new Promise((r) => setTimeout(r, 250)); // Wait to make sure tooltip will dissappear
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument() // No tooltip found
  })
})