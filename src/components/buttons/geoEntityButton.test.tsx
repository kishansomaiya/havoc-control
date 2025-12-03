import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GeoEntityButton from './geoEntityButton';
import '@testing-library/jest-dom'

const DummyIcon = () => <svg data-testid="dummy-icon" />;

describe('GeoEntityButton', () => {
  it('renders icon, title, and subtitle', () => {
    render(
      <GeoEntityButton
        icon={<DummyIcon />}
        title="Test Title"
        subtitle="Test Subtitle"
        onClick={() => {}}
      />
    );
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <GeoEntityButton
        icon={<DummyIcon />}
        title="Clickable"
        subtitle="Click me"
        onClick={handleClick}
      />
    );
    // Find the button by role (button) and click
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies selected styles when selected', () => {
    render(
      <GeoEntityButton
        icon={<DummyIcon />}
        title="Selected"
        subtitle="Selected subtitle"
        onClick={() => {}}
        selected={true}
      />
    );
    const button = screen.getByRole('button');
    // The style is applied via styled-components, so we check for the aria attribute
    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('renders subtitle as JSX element', () => {
    render(
      <GeoEntityButton
        icon={<DummyIcon />}
        title="JSX Subtitle"
        subtitle={<span data-testid="jsx-subtitle">JSX Subtitle Content</span>}
        onClick={() => {}}
      />
    );
    expect(screen.getByTestId('jsx-subtitle')).toBeInTheDocument();
    expect(screen.getByText('JSX Subtitle Content')).toBeInTheDocument();
  });
});
