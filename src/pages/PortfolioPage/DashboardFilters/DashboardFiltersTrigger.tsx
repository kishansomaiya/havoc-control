import { CircularProgress, IconButton, useTheme } from '@mui/material';
import { FC, useCallback, useEffect } from 'react';
import { Filter } from 'react-feather';
import { useDashboardFilterContext } from '../../../context/DashboardFilterProvider';

interface DashboardFiltersTriggerProps {
    open: boolean;
    onClick: (open?: boolean) => void;
}

export const DashboardFiltersTrigger: FC<DashboardFiltersTriggerProps> = ({
    open,
    onClick,
}: DashboardFiltersTriggerProps) => {
    const theme = useTheme();
    const { isResultSetLoading, isFiltersDisabled } =
        useDashboardFilterContext();

    const handleClick = useCallback(() => {
        onClick();
    }, [isFiltersDisabled]);

    useEffect(() => {
        if (isFiltersDisabled) {
            onClick(false);
        }
    }, [isFiltersDisabled]);

    return (
        <IconButton
            disabled={isResultSetLoading || isFiltersDisabled}
            onClick={handleClick}
        >
            {isResultSetLoading && !isFiltersDisabled ? (
                <CircularProgress
                    size="1.5rem"
                    sx={{
                        color: open
                            ? theme.palette.secondary.main
                            : theme.palette.text.primary,
                    }}
                />
            ) : (
                <Filter
                    size="1.5rem"
                    data-testid="filter-icon"
                    color={
                        open
                            ? theme.palette.secondary.main
                            : isFiltersDisabled
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary
                    }
                />
            )}
        </IconButton>
    );
};
