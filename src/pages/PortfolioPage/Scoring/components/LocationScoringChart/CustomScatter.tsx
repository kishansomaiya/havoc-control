import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Tooltip } from '@mui/material';
import { ScatterTooltip } from './ScatterTooltip';
import { ScatterShortTooltip } from './ScatterShortTooltip';
import { useScoringLocationId } from '../../PrortfolioScoringContext';

interface CustomScatterProps {
    xPos: number;
    yPos: number;
    color: string;
    showLocationId: boolean;
    locations: {
        locationId: number;
        locationName: string | null;
    }[];
    hazardScoreValue: number;
    changeScoreValue: number;
    onLocationSelected?: (locationId: number | undefined) => void;
}

export const CustomScatter: FC<CustomScatterProps> = ({
    xPos,
    yPos,
    color,
    showLocationId,
    locations,
    hazardScoreValue,
    changeScoreValue,
    onLocationSelected,
}) => {
    const [isShort, setIsShort] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const selectedLocationId = useScoringLocationId();

    const locationIds = useMemo(
        () => locations.map(({ locationId }) => locationId),
        [locations]
    );

    useEffect(() => {
        if (!selectedLocationId) {
            setOpen(false);
            return;
        }

        if (!locationIds.includes(selectedLocationId)) {
            setOpen(false);
            return;
        }
        setOpen(true);
    }, [selectedLocationId, locationIds]);

    const handleLocationSelection = useCallback(
        (locationId: number | undefined) => {
            onLocationSelected?.(locationId);
        },
        [onLocationSelected]
    );

    const handleTooltipClose = useCallback(() => {
        if (!open) {
            return;
        }
        onLocationSelected?.(undefined);
    }, [open, onLocationSelected]);

    const handleCloseButtonClick = useCallback(() => {
        handleTooltipClose();
    }, [handleTooltipClose]);

    const handleTooltipOpen = useCallback(() => {
        setIsShort(false);
        setOpen(true);
    }, []);

    const handleShortTooltipOpen = useCallback(() => {
        if (!open) {
            setIsShort(true);
            setOpen(true);
        }
    }, [open]);

    const handleShortTooltipClose = useCallback(() => {
        if (isShort) {
            setOpen(false);
        }
    }, [isShort]);

    const title = useMemo(() => {
        const firstLocationId = locationIds[0].toString();
        if (locationIds.length === 1) {
            return firstLocationId;
        }

        const lastLocationId = locationIds[locationIds.length - 1].toString();
        return `${firstLocationId}-${lastLocationId}`;
    }, [locationIds]);

    return (
        <Tooltip
            title={
                isShort ? (
                    <ScatterShortTooltip locations={locations} />
                ) : (
                    <ScatterTooltip
                        locationIds={locationIds}
                        hazardScoreValue={hazardScoreValue}
                        changeScoreValue={changeScoreValue}
                        onCloseButtonClick={handleCloseButtonClick}
                        onLocationSelected={handleLocationSelection}
                    />
                )
            }
            data-testid="scatter-chart-item"
            arrow
            placement="top"
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
        >
            <g
                transform={`translate(${xPos}, ${yPos})`}
                onClick={handleTooltipOpen}
                onMouseEnter={handleShortTooltipOpen}
                onMouseLeave={handleShortTooltipClose}
            >
                <circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill={color}
                    opacity="1"
                    cursor="pointer"
                    className="customPointer"
                    data-testid="scatter-chart-item-circle"
                ></circle>

                {showLocationId && (
                    <text
                        x="0"
                        y="20"
                        textAnchor="middle"
                        fill="#EEEFF0"
                        fontSize="0.75rem"
                        data-testid="scatter-chart-item-location-id"
                    >
                        <tspan
                            x="0"
                            dy="0"
                        >
                            {title}
                        </tspan>
                    </text>
                )}
            </g>
        </Tooltip>
    );
};
