import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapControls } from './MapControls';
import { describe, it, expect, vi } from 'vitest';
import { Map } from 'mapbox-gl';

const mockMap = {
    getZoom: vi.fn().mockReturnValue(5),
    getMaxZoom: vi.fn().mockReturnValue(10),
    getMinZoom: vi.fn().mockReturnValue(0),
    zoomTo: vi.fn(),
    setStyle: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getCanvas: vi.fn().mockReturnValue({ style: {} }),
} as unknown as Map;

describe('MapControls', () => {
    it('renders zoom in and zoom out buttons', () => {
        render(<MapControls map={mockMap} />);
        expect(screen.getByLabelText('zoom in')).toBeInTheDocument();
        expect(screen.getByLabelText('zoom out')).toBeInTheDocument();
    });

    it('zooms in when zoom in button is clicked', async () => {
        const user = userEvent.setup();
        render(<MapControls map={mockMap} />);
        const zoomInButton = screen.getByLabelText('zoom in');
        await user.click(zoomInButton);
        expect(mockMap.zoomTo).toHaveBeenCalled();
    });

    it('zooms out when zoom out button is clicked', async () => {
        const user = userEvent.setup();
        render(<MapControls map={mockMap} />);
        const zoomOutButton = screen.getByLabelText('zoom out');
        await user.click(zoomOutButton);
        expect(mockMap.zoomTo).toHaveBeenCalled();
    });

    it('opens layer selection popover when layer button is clicked', async () => {
        const user = userEvent.setup();
        render(<MapControls map={mockMap} />);
        const layerButton = screen.getByLabelText('select layer');
        await user.click(layerButton);
        expect(screen.getByTestId('map-layer-popover')).toBeInTheDocument();
    });

    it('changes map style when a layer is selected', async () => {
        const user = userEvent.setup();
        render(<MapControls map={mockMap} />);
        const layerButton = screen.getByLabelText('select layer');
        await user.click(layerButton);
        const layerItems = screen.getAllByTestId('map-layer-menu-item');
        await user.click(layerItems[1]);
        expect(mockMap.setStyle).toHaveBeenCalled();
    });
});
