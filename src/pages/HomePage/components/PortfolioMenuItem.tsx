import { ComponentProps, FC, useCallback, useMemo, useState } from 'react';
import { MenuItem } from '@mui/material';


interface PortfolioMenuItemProps extends ComponentProps<typeof MenuItem> {
    title: string;
    disabled?: boolean;
    onClick: () => Promise<void>;
}

export const PortfolioMenuItem: FC<PortfolioMenuItemProps> = ({
    title,
    disabled = false,
    onClick,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = useCallback(async () => {
        setIsLoading(true);

        await onClick();

        setIsLoading(false);
    }, [onClick]);

    const isDisabled = useMemo(
        () => disabled || isLoading,
        [disabled, isLoading]
    );

    return (
        <MenuItem
            sx={{
                paddingLeft: '1.5rem',
            }}
            disabled={isDisabled}
            onClick={handleClick}
            data-testid="portfolio-details-menu-item"
        >
            {isLoading ? 'Downloading' : title}
        </MenuItem>
    );
};
