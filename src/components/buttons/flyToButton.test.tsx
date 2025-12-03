import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlyToButton } from './flyToButton.tsx';

// Mock the icon import
vi.mock('../../assets/icons/fly-to-icon.svg', () => ({ default: 'mock-fly-to-icon.svg' }));

describe('FlyToButton', () => {
  const flyToLocation = "Test Location";
  const testingId = `tooltip-icon-btn-fly-to-${flyToLocation.toLowerCase().replace(/\s/g, "-")}-go-to-${flyToLocation.toLowerCase().replace(/\s/g, "-")}`
  it('renders with correct title and image', () => {
    render(
      <FlyToButton
        flyToLocation="Test Location"
        onHandleFlyToClick={() => {}}
        disabled={false}
      />
    );
    const button = screen.getByTestId(testingId);
    expect(button).toHaveAttribute('aria-label', 'Fly to Test Location');
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'mock-fly-to-icon.svg');
    expect(img).toHaveAttribute('alt', 'Go to Test Location');
  });

  it('calls onHandleFlyToClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <FlyToButton
        flyToLocation="Test Location"
        onHandleFlyToClick={handleClick}
        disabled={false}
      />
    );
    const button = screen.getByTestId(testingId);
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <FlyToButton
        flyToLocation="Test Location"
        onHandleFlyToClick={() => {}}
        disabled={true}
      />
    );
    const button = screen.getByTestId(testingId);
    expect(button).toBeDisabled();
  });


  it('Hover Tooltip button displays correct tooltip', async () => {
    render(<FlyToButton
      flyToLocation="Test Location"
      onHandleFlyToClick={() => {}}
      disabled={true}
    />);

    const iconBtn = screen.getByTestId(testingId);

    // Rest of Tooltip Functionality tested by tooltipIconButton.test
    // This is to only ensure tooltip text is correct
    fireEvent.mouseEnter(iconBtn)
    await waitFor(() => screen.findByText(`Fly to ${flyToLocation}`))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument() // Tooltip found
  })
});
