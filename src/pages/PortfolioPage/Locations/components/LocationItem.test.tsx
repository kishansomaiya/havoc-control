import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LocationItem } from './LocationItem';
import { ComponentProps } from 'react';
import { StyledCard } from '../../../../components/StyledCard/StyledCard';
import * as StyledCardModule from '../../../../components/StyledCard/StyledCard';
import { LocationResponse } from 'api/openapi/auto-generated';
import * as DataNotAvailableTooltipModule from '../../../../components/DataNotAvailableTooltip/DataNotAvailableTooltip';

vi.spyOn(StyledCardModule, 'StyledCard').mockImplementation(
    (props: ComponentProps<typeof StyledCard>) => (
        <div
            data-testid="styled-card"
            onClick={props.handleClick}
        >
            {props.children}
        </div>
    )
);

vi.spyOn(
    DataNotAvailableTooltipModule,
    'DataNotAvailableTooltip'
).mockImplementation(() => <div data-testid="tooltip" />);

describe('LocationItem', () => {
    const baseLocation = {
        id: 1,
        geometry: { latitude: 10, longitude: 20 },
        extras: { locationName: 'Loc' },
    } as unknown as LocationResponse;

    it('renders id, name, coordinates and triggers click when enabled', async () => {
        const onSelect = vi.fn();
        const user = userEvent.setup();
        render(
            <LocationItem
                location={baseLocation}
                onLocationSelect={onSelect}
                searchText="1"
                isSelected={false}
                isDisabled={false}
            />
        );
        expect(
            screen.getByTestId('portfolio-locations-item-id')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-locations-item-name')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-locations-item-coordinates')
        ).toHaveTextContent('10');
        await user.click(
            screen.getByTestId('portfolio-locations-item-arrow-button')
        );
        expect(onSelect).toHaveBeenCalledWith(1);
    });

    it('does not trigger click when disabled', async () => {
        const onSelect = vi.fn();
        const user = userEvent.setup();
        render(
            <LocationItem
                location={baseLocation}
                onLocationSelect={onSelect}
                isSelected={false}
                isDisabled
            />
        );
        await user.click(
            screen.getByTestId('portfolio-locations-item-arrow-button')
        );
        expect(onSelect).not.toHaveBeenCalled();
    });
});
