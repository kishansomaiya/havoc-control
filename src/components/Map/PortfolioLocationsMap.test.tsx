import { render, screen, act } from '@testing-library/react';
import {
    PortfolioLocationsMap,
    PortfolioLocation,
} from './PortfolioLocationsMap';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mapboxgl, { type Map, type ProjectionSpecification } from 'mapbox-gl';

// Capture MapboxMap callbacks
let onDataLoadedCallback: ((map: Map) => void) | undefined;
let onDataLoadCallback:
    | ((
          map: Map,
          data: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
          withRecenter?: boolean
      ) => void)
    | undefined;

// Helper accessors with typed global to avoid any
type GlobalWithMap = typeof globalThis & {
    __mapHandlers: Record<string, (event?: unknown) => void>;
    __mapInstance: Map;
    __mapSources: Record<string, unknown>;
};
const getG = () => globalThis as unknown as GlobalWithMap;
const getHandlers = () => getG().__mapHandlers;
const getMap = () => getG().__mapInstance;

vi.mock('mapbox-gl', () => {
    const handlers: Record<string, (event?: unknown) => void> = {};

    const Popup = vi.fn(() => ({
        setLngLat: vi.fn().mockReturnThis(),
        setHTML: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        remove: vi.fn(),
    }));

    const LngLatBounds = vi.fn(() => ({ extend: vi.fn() }));

    // Source registry so getSource is undefined until addSource
    const sources: Record<
        string,
        {
            setData: ReturnType<typeof vi.fn>;
            getClusterExpansionZoom: ReturnType<typeof vi.fn>;
        }
    > = {};

    const rawMap = {
        on: vi.fn((event: string, layerOrCb: unknown, maybeCb?: unknown) => {
            const isCbOnly = typeof layerOrCb === 'function';
            const layerId =
                typeof layerOrCb === 'string'
                    ? (layerOrCb as string)
                    : undefined;
            const cb = (isCbOnly ? layerOrCb : maybeCb) as (
                e?: unknown
            ) => void;
            const key = layerId ? `${event}-${layerId}` : event;
            handlers[key] = cb;
        }),
        off: vi.fn((event: string, layerOrCb: unknown) => {
            const layerId =
                typeof layerOrCb === 'string'
                    ? (layerOrCb as string)
                    : undefined;
            const key = layerId ? `${event}-${layerId}` : event;
            delete handlers[key];
        }),
        getCanvas: vi.fn(() => document.createElement('canvas')),
        addSource: vi.fn((id: string) => {
            sources[id] = {
                setData: vi.fn(),
                getClusterExpansionZoom: vi.fn(
                    (_: unknown, cb: (err: unknown, zoom?: number) => void) =>
                        cb(null, 12)
                ),
            };
        }),
        getSource: vi.fn((sourceId: string) => sources[sourceId]),
        addLayer: vi.fn(),
        fitBounds: vi.fn(),
        flyTo: vi.fn(),
        easeTo: vi.fn(),
        getZoom: vi.fn(() => 10),
        getMinZoom: vi.fn(() => 0),
        getMaxZoom: vi.fn(() => 20),
        getProjection: vi.fn(
            () => ({ name: 'mercator' }) as ProjectionSpecification
        ),
        remove: vi.fn(),
        setStyle: vi.fn(),
        setFog: vi.fn(),
        setProjection: vi.fn(),
    };

    // Expose to global for tests (avoid calling helpers here due to hoist)
    (globalThis as unknown as GlobalWithMap).__mapHandlers = handlers;
    (globalThis as unknown as GlobalWithMap).__mapInstance =
        rawMap as unknown as Map;
    (globalThis as unknown as GlobalWithMap).__mapSources = sources;

    const MapCtor = vi.fn(() => rawMap as unknown as Map);

    return {
        __esModule: true,
        default: { Map: MapCtor, Popup, LngLatBounds },
        Map: MapCtor,
        Popup,
        LngLatBounds,
        LngLat: { convert: vi.fn(() => ({ lng: 0, lat: 0 })) },
    };
});

// Mock the child MapboxMap to capture callbacks and render a simple div
vi.mock('./MapboxMap', () => ({
    MapboxMap: vi.fn(
        (props: {
            onDataLoad?: (
                map: Map,
                data: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
                withRecenter?: boolean
            ) => void;
            onDataLoaded?: (map: Map) => void;
        }) => {
            onDataLoadCallback = props.onDataLoad;
            onDataLoadedCallback = props.onDataLoaded;
            return <div data-testid="mapboxgl-map" />;
        }
    ),
}));

// Mock MapControls since it's tested separately
vi.mock('./MapControls', () => ({
    MapControls: vi.fn(() => <div data-testid="map-controls" />),
}));

// Stable fixtures
const mockLocations: PortfolioLocation[] = [
    {
        id: 1,
        name: 'Location 1',
        geometry: { longitude: 10, latitude: 20 },
        color: '#ff0000',
    },
    { id: 2, name: 'Location 2', geometry: { longitude: 30, latitude: 40 } },
];

beforeEach(() => {
    vi.clearAllMocks();
    onDataLoadCallback = undefined;
    onDataLoadedCallback = undefined;
    const handlers = getHandlers();
    if (handlers) Object.keys(handlers).forEach((k) => delete handlers[k]);
    const sources = getG().__mapSources;
    if (sources) Object.keys(sources).forEach((k) => delete sources[k]);
});

// Strict type for Popup mock results to satisfy linter
type PopupMockInstance = {
    setLngLat: ReturnType<typeof vi.fn>;
    setHTML: ReturnType<typeof vi.fn>;
    addTo: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
};

describe('PortfolioLocationsMap', () => {
    it('renders base map and controls', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        expect(screen.getByTestId('mapboxgl-map')).toBeInTheDocument();
    });

    it('registers sources and layers on map load', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        const map = getMap() as unknown as {
            addSource: { mock: { calls: unknown[][] } };
            addLayer: { mock: { calls: unknown[][] } };
        };
        expect(map.addSource.mock.calls.length).toBeGreaterThan(0);
        expect(map.addLayer.mock.calls.length).toBeGreaterThan(0);
    });

    it('invokes onLocationSelected on unclustered point click', () => {
        const onLocationSelected = vi.fn();
        render(
            <PortfolioLocationsMap
                locations={mockLocations}
                onLocationSelected={onLocationSelected}
            />
        );
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        act(() => {
            getHandlers()['click-unclustered-point']?.({
                features: [{ properties: { id: 1 } }],
            });
        });
        expect(onLocationSelected).toHaveBeenCalledWith(1);
    });

    it('zooms to cluster center on cluster click', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        act(() => {
            getHandlers()['click-clusters']?.({
                features: [
                    {
                        properties: { cluster_id: 123 },
                        geometry: { type: 'Point', coordinates: [15, 25] },
                    },
                ],
            });
        });
        const map = getMap() as unknown as {
            easeTo: { mock: { calls: unknown[][] } };
        };
        expect(map.easeTo.mock.calls[0][0]).toMatchObject({
            center: [15, 25],
            zoom: 12,
        });
    });

    it('onDataLoad with recenter=true calls fitBounds when features present', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        const map = getMap() as unknown as {
            fitBounds: { mock: { calls: unknown[][] } };
        };
        act(() => {
            onDataLoadCallback!(
                getMap(),
                {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [1, 2] },
                            properties: {},
                        } as GeoJSON.Feature,
                    ],
                },
                true
            );
        });
        expect(map.fitBounds.mock.calls.length).toBeGreaterThan(0);
    });

    it('does not re-register layers if source already exists', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        const map = getMap() as unknown as {
            addSource: { mock: { calls: unknown[][] } };
            addLayer: { mock: { calls: unknown[][] } };
        };
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        const addSourceCalls = map.addSource.mock.calls.length;
        const addLayerCalls = map.addLayer.mock.calls.length;
        // Call again - should not add more
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        expect(map.addSource.mock.calls.length).toBe(addSourceCalls);
        expect(map.addLayer.mock.calls.length).toBe(addLayerCalls);
    });

    it('cluster mousemove with same id does not update popup again', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        const popupCtor = mapboxgl.Popup as unknown as {
            mock: { results: Array<{ value: PopupMockInstance }> };
        };
        act(() => {
            getHandlers()['mouseenter-clusters']?.({
                features: [
                    {
                        properties: { cluster_id: 'c1', point_count: 3 },
                        geometry: { coordinates: [10, 20] },
                    },
                ],
                lngLat: { lng: 10, lat: 20 },
            });
        });
        const initialPopup = popupCtor.mock.results.slice(-1)[0].value;
        const setHTMLCalls = (initialPopup.setHTML as ReturnType<typeof vi.fn>)
            .mock.calls.length;
        // Mousemove with same id should not call setHTML again
        act(() => {
            getHandlers()['mousemove-clusters']?.({
                features: [
                    {
                        properties: { cluster_id: 'c1', point_count: 4 },
                        geometry: { coordinates: [10, 20] },
                    },
                ],
                lngLat: { lng: 10, lat: 20 },
            });
        });
        expect(
            (initialPopup.setHTML as ReturnType<typeof vi.fn>).mock.calls.length
        ).toBe(setHTMLCalls);
    });

    it('shows and hides cluster hover popup', () => {
        render(<PortfolioLocationsMap locations={mockLocations} />);
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        act(() => {
            getHandlers()['mouseenter-clusters']?.({
                features: [
                    {
                        properties: { cluster_id: 'c1', point_count: 5 },
                        geometry: { coordinates: [10, 20] },
                    },
                ],
                lngLat: { lng: 10, lat: 20 },
            });
        });
        const popupCtor = mapboxgl.Popup as unknown as {
            mock: { results: Array<{ value: PopupMockInstance }> };
        };
        const popup = popupCtor.mock.results[0]?.value;
        expect(popup.setLngLat).toHaveBeenCalled();
        expect(popup.setHTML).toHaveBeenCalledWith('5 locations');
        act(() => {
            getHandlers()['mouseleave-clusters']?.();
        });
        expect(popup.remove).toHaveBeenCalled();
    });

    it('shows point hover popup when showLocationPopup is true (with and without name)', () => {
        render(
            <PortfolioLocationsMap
                locations={mockLocations}
                showLocationPopup
            />
        );
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        // With name
        act(() => {
            getHandlers()['mouseenter-unclustered-point']?.({
                features: [
                    {
                        properties: { id: 7, name: 'A' },
                        geometry: { coordinates: [1, 2] },
                    },
                ],
                lngLat: { lng: 1, lat: 2 },
            });
        });
        let popupCtor = mapboxgl.Popup as unknown as {
            mock: { results: Array<{ value: PopupMockInstance }> };
        };
        let popup = popupCtor.mock.results.slice(-1)[0].value;
        expect(popup.setHTML).toHaveBeenCalledWith(
            'Location ID: 7 <br/> Location Name: A'
        );
        // Without name
        act(() => {
            getHandlers()['mouseenter-unclustered-point']?.({
                features: [
                    {
                        properties: { id: 8 },
                        geometry: { coordinates: [3, 4] },
                    },
                ],
                lngLat: { lng: 3, lat: 4 },
            });
        });
        popupCtor = mapboxgl.Popup as unknown as {
            mock: { results: Array<{ value: PopupMockInstance }> };
        };
        popup = popupCtor.mock.results.slice(-1)[0].value;
        expect(popup.setHTML).toHaveBeenCalledWith('Location ID: 8');
        act(() => {
            getHandlers()['mouseleave-unclustered-point']?.();
        });
        expect(popup.remove).toHaveBeenCalled();
    });

    it('calls fitBounds when mapCenter is removed and zoomOutOnMapCenterReset is true', () => {
        const { rerender } = render(
            <PortfolioLocationsMap
                locations={mockLocations}
                mapCenter={[10, 20]}
                zoomOutOnMapCenterReset
            />
        );
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        // initial effect may call flyTo once; ensure we only care that fitBounds also called later
        rerender(
            <PortfolioLocationsMap
                locations={mockLocations}
                mapCenter={undefined}
                zoomOutOnMapCenterReset
            />
        );
        const map = getMap() as unknown as {
            fitBounds: { mock: { calls: unknown[][] } };
            flyTo: { mock: { calls: unknown[][] } };
        };
        expect(map.fitBounds.mock.calls.length).toBeGreaterThan(0);
    });

    it('does not call fitBounds when withRecenter=false or no features', () => {
        render(
            <PortfolioLocationsMap
                locations={[]}
                zoomOutOnMapCenterReset
            />
        );
        act(() => {
            onDataLoadedCallback!(getMap());
        });
        let map = getMap() as unknown as {
            fitBounds: { mock: { calls: unknown[][] } };
        };
        expect(map.fitBounds.mock.calls.length).toBe(0);
        // Explicit onDataLoad with withRecenter=false
        const empty: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
            type: 'FeatureCollection',
            features: [],
        };
        act(() => {
            onDataLoadCallback!(getMap(), empty, false);
        });
        map = getMap() as unknown as {
            fitBounds: { mock: { calls: unknown[][] } };
        };
        expect(map.fitBounds.mock.calls.length).toBe(0);
    });
});
