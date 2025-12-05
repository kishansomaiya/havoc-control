import { ComponentProps, FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { IPortfolioItem } from '../../../types';
import { PortfolioLocationsMap } from '../../../components/Map/PortfolioLocationsMap';
import { useLocationsQuery } from '../../../api/queries/locationsQuery';

interface PortfolioMapProps extends ComponentProps<typeof Box> {
    portfolio: IPortfolioItem;
}
export const PortfolioMap: FC<PortfolioMapProps> = ({ portfolio }) => {
    const { locations, isLocationsLoading } = useLocationsQuery({
        portfolioId: portfolio.id,
    });

    return (
        <Box
            flex={1}
            sx={{
                width: '100%',
                position: 'relative',
            }}
            data-testid="portfolio-item-map"
        >
            {isLocationsLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        background: (theme) =>
                            `${theme.palette.background.default}BF`,
                        zIndex: 1,
                    }}
                >
                    <CircularProgress 
                        color="inherit"
                        data-testid="portfolio-item-map-progress-icon"
                    />
                </Box>
            )}

            <PortfolioLocationsMap
                locations={locations}
                zoomOutOnMapCenterReset={true}
            />
        </Box>
    );
};
