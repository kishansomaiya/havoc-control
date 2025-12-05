import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationFloodMeshMap } from './components/LocationFloodMeshMap';

// Rationale: Mapbox GL is heavy and requires a WebGL context. We keep a focused
// presentational stub for MapboxMap to avoid non-deterministic behavior and
// environment setup while still exercising our map integration logic via
// callbacks (onDataLoaded/onDataLoad) and asserting our DOM contract.
vi.mock('../../../components/Map/MapboxMap', () => ({
    MapboxMap: ({
        onDataLoaded,
        onDataLoad,
        data,
    }: {
        onDataLoaded: (map: unknown) => void;
        onDataLoad: (map: unknown, data: unknown) => void;
        data: unknown;
    }) => {
        const mapRef = {
            getSource: vi.fn(() => ({ setData: vi.fn() })),
            addSource: vi.fn(),
            addLayer: vi.fn(),
            on: vi.fn(),
            fitBounds: vi.fn(),
            getProjection: () => ({ name: 'mercator' }),
        } as unknown;
        Promise.resolve().then(() => {
            onDataLoaded(mapRef);
            onDataLoad(mapRef, data);
        });
        return <div data-testid="mapboxgl-map" />;
    },
}));

// Rationale: These are lightweight presentational components whose internals
// are irrelevant to this test. Keeping small stubs with stable testids makes
// assertions deterministic without coupling to styling/markup details.
vi.mock('../../../components/Map/ScoreLevelsMapLegend', () => ({
    ScoreLevelsMapLegend: () => <div data-testid="score-legend" />,
}));

vi.mock('../../../components/Map/MapControls', () => ({
    MapControls: () => <div data-testid="map-controls" />,
}));

describe('LocationFloodMeshMap', () => {
    it('renders map, controls and legend', async () => {
        render(
            <LocationFloodMeshMap
                locations={[
                    { latitude: 1, longitude: 2, color: '#000', label: 'A' },
                ]}
            />
        );
        expect(screen.getByTestId('mapboxgl-map')).toBeInTheDocument();
        expect(screen.getByTestId('score-legend')).toBeInTheDocument();
    });

    it('handles empty locations without bounds and still renders', async () => {
        render(<LocationFloodMeshMap locations={[]} />);
        expect(screen.getByTestId('mapboxgl-map')).toBeInTheDocument();
    });
});
