import { ComponentProps, FC, useCallback } from 'react';
import { Typography, Box, useTheme, IconButton } from '@mui/material';
import * as Icon from 'react-feather';
import { StyledCard } from '../../../../components/StyledCard/StyledCard';
import { LocationResponse } from '../../../../api/openapi/auto-generated';
import { highlightsMatches } from '../../../../utils';
import { DataNotAvailableTooltip } from '../../../../components/DataNotAvailableTooltip/DataNotAvailableTooltip';

interface LocationItemProps extends ComponentProps<'div'> {
    location: LocationResponse;
    onLocationSelect: (locationId: number) => void;
    searchText?: string;
    isSelected: boolean;
    isDisabled: boolean;
}

export const LocationItem: FC<LocationItemProps> = ({
    location,
    onLocationSelect,
    searchText,
    isSelected,
    isDisabled,
}) => {
    const theme = useTheme();

    const handleClick = useCallback(() => {
        if (isDisabled) {
            return;
        }

        onLocationSelect(location.id);
    }, [location, onLocationSelect, isDisabled]);

    // const locationIdHTML = useMemo(
    //     () =>
    //         'Location ID: ' +
    //         highlightsMatches(
    //             location.id.toString(),
    //             searchText,
    //             theme.palette.secondary.main
    //         ),
    //     [location, searchText, theme]
    // );
    // const locationNameHTML = useMemo(() => {
    //     const extras = (location.extras || {}) as { locationName?: string };

    //     if (!extras.locationName) {
    //         return 'Name: Not Available';
    //     }

    //     return (
    //         'Name: ' +
    //         highlightsMatches(
    //             extras.locationName,
    //             searchText,
    //             theme.palette.secondary.main
    //         )
    //     );
    // }, [location, searchText, theme]);

    return (
        <StyledCard
            handleClick={handleClick}
            style={{
                paddingTop: '1rem',
                paddingBottom: '1rem',
                minHeight: '5.8125rem',
            }}
            withHover
            isSelected={isSelected}
            tooltip={isDisabled && <DataNotAvailableTooltip />}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap={1}
                alignSelf="stretch"
                flex={1}
                data-testid="portfolio-locations-item"
            >
                <Typography
                    variant="h4"
                    color="common.white"
                    data-testid="portfolio-locations-item-id"
                >
                    Location ID:{' '}
                    {highlightsMatches(
                        location.id.toString(),
                        searchText,
                        theme.palette.secondary.main
                    )}
                </Typography>

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    alignSelf="stretch"
                    data-testid="portfolio-locations-item-data"
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid="portfolio-locations-item-name"
                    >
                        Name:{' '}
                        {highlightsMatches(
                            (location.extras as { locationName?: string })?.locationName || 'Not Available',
                            searchText,
                            theme.palette.secondary.main
                        )}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid="portfolio-locations-item-coordinates"
                    >
                        Lat, Long:&nbsp;
                        {location.geometry.latitude},&nbsp;
                        {location.geometry.longitude}
                    </Typography>
                </Box>
            </Box>

            <IconButton
                size="small"
                onClick={handleClick}
                sx={{
                    padding: 0,
                    borderRadius: 0,
                    '&:hover': {
                        background: 'transparent',
                    },
                }}
                data-testid="portfolio-locations-item-arrow-button"
            >
                <Icon.ChevronRight
                    color={theme.palette.text.secondary}
                    data-testid="portfolio-locations-item-arrow-icon"
                />
            </IconButton>
        </StyledCard>
    );
};
