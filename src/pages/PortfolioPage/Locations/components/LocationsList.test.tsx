import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LocationsList } from './LocationsList';
import { ComponentProps } from 'react';
import * as LocationItemModule from './LocationItem';
import { LocationResponse } from 'api/openapi/auto-generated';
import * as reactRouter from 'react-router';
import * as reactRouterDom from 'react-router-dom';

vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(vi.fn());
vi.spyOn(reactRouterDom, 'useSearchParams').mockReturnValue([
    new URLSearchParams(),
] as unknown as ReturnType<typeof reactRouterDom.useSearchParams>);

vi.spyOn(LocationItemModule, 'LocationItem').mockImplementation(
    (props: ComponentProps<typeof LocationItemModule.LocationItem>) => (
        <div
            data-testid="location-item"
            onClick={() => props.onLocationSelect(1)}
        />
    )
);

vi.mock('react-virtuoso', async () => {
    const actual =
        await vi.importActual<typeof import('react-virtuoso')>(
            'react-virtuoso'
        );
    return {
        ...actual,
        Virtuoso: (props: ComponentProps<typeof actual.Virtuoso>) => (
            <div data-testid="virtuoso">
                {props.itemContent?.(0, props.data?.[0], props)}
            </div>
        ),
    };
});

describe('LocationsList', () => {
    const locations = [
        {
            id: 1,
            geometry: { latitude: 1, longitude: 2 },
            extras: { locationName: 'A' },
        },
        {
            id: 2,
            geometry: { latitude: 3, longitude: 4 },
            extras: { locationName: 'B' },
        },
    ] as unknown as LocationResponse[];

    it('renders search and list; clear button works', async () => {
        const user = userEvent.setup();
        render(
            <LocationsList
                portfolioId="p1"
                locations={locations}
                isNavigationEnabled
                navigationAvailableTab={null}
            />
        );
        expect(
            screen.getByTestId('portfolio-locations-search')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-locations-result-list')
        ).toBeInTheDocument();
        await user.click(
            screen.getByTestId('portfolio-locations-search-clear-button')
        );
        expect(screen.getAllByTestId('location-item').length).toBeGreaterThan(
            0
        );
        const inputEl = screen.getByTestId('portfolio-locations-search');
        await user.type(inputEl, 'A');
        fireEvent.keyDown(inputEl, { key: 'Enter' });
    });
});
