import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import * as Icon from 'react-feather';
import { useScoringLocationId } from '../../PrortfolioScoringContext';
import { getLocationCountLabel } from '../../../../../utils';

interface ScatterTooltipProps {
    locationIds: number[];
    hazardScoreValue: number;
    changeScoreValue: number;
    onCloseButtonClick: () => void;
    onLocationSelected?: (locationId: number | undefined) => void;
}

export const ScatterTooltip: FC<ScatterTooltipProps> = ({
    locationIds,
    hazardScoreValue,
    changeScoreValue,
    onCloseButtonClick,
    onLocationSelected,
}) => {
    const selectedLocationId = useScoringLocationId();
    const defaultLocationId = useMemo(() => {
        return selectedLocationId && locationIds.includes(selectedLocationId)
            ? selectedLocationId
            : locationIds[0];
    }, [selectedLocationId, locationIds]);
    const [activeLocationId, setActiveLocationId] =
        useState<number>(defaultLocationId);

    useEffect(() => {
        onLocationSelected?.(activeLocationId);
    }, [activeLocationId, onLocationSelected]);

    const activeLocationIndex = useMemo(() => {
        return locationIds.findIndex((id) => id === activeLocationId);
    }, [locationIds, activeLocationId]);

    const locationsCount = useMemo(
        () => locationIds.length,
        [locationIds.length]
    );

    const setPreviousLocationId = useCallback(() => {
        setActiveLocationId(locationIds[activeLocationIndex - 1]);
    }, [activeLocationIndex, locationIds]);

    const setNextLocationId = useCallback(() => {
        setActiveLocationId(locationIds[activeLocationIndex + 1]);
    }, [activeLocationIndex, locationIds]);

    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
            }}
            minWidth="10rem"
            px={1}
        >
            <Box
                display="flex"
                alignItems="start"
                justifyContent="space-between"
                pb={1}
                data-testid="scatter-chart-tooltip"
            >
                <Box pr={2}>
                    {locationsCount > 1 && (
                        <Typography
                            variant="h4"
                            pt={1}
                            pb={1}
                        >
                            {getLocationCountLabel(locationsCount)}
                        </Typography>
                    )}

                    <Box
                        display="flex"
                        flexDirection="column"
                        pt={1}
                    >
                        <Typography
                            variant="body2"
                            data-testid="scatter-chart-tooltip-text"
                        >
                            Location ID: {activeLocationId}
                            <br />
                            Present Score: {hazardScoreValue}
                            <br />
                            Change Score: {changeScoreValue}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    size="small"
                    onClick={onCloseButtonClick}
                    data-testid="scatter-chart-tooltip-x-button"
                >
                    <Icon.X size="1.5rem" />
                </IconButton>
            </Box>

            {locationsCount > 1 && (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <IconButton
                        size="small"
                        onClick={setPreviousLocationId}
                        disabled={activeLocationIndex === 0}
                    >
                        <Icon.ChevronLeft
                            size="1.5rem"
                            data-testid="scatter-chart-tooltip-left-button"
                        />
                    </IconButton>
                    <Typography
                        variant="caption"
                        data-testid="scatter-chart-tooltip-caption"
                    >
                        {activeLocationIndex + 1} of {locationsCount}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={setNextLocationId}
                        disabled={activeLocationIndex === locationsCount - 1}
                    >
                        <Icon.ChevronRight
                            size="1.5rem"
                            data-testid="scatter-chart-tooltip-right-button"
                        />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};
