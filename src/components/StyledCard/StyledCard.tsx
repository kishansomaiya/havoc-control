import { ComponentProps, FC, ReactNode, useCallback } from 'react';
import { Card, Tooltip } from '@mui/material';

interface StyledCardProps extends ComponentProps<'div'> {
    handleClick?: () => void;
    isSelected?: boolean;
    isDisabled?: boolean;
    withHover?: boolean;
    tooltip?: string | ReactNode;
}

export const StyledCard: FC<StyledCardProps> = ({
    handleClick,
    isSelected = false,
    isDisabled = false,
    withHover = false,
    tooltip = '',
    style,
    children,
}) => {
    const onClick = useCallback(() => {
        if (!isDisabled && handleClick) {
            handleClick();
        }
    }, [isDisabled, handleClick]);

    return (
        <Tooltip title={tooltip}>
            <Card
                onClick={onClick}
                sx={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    gap: '2rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    ...(isSelected
                        ? {
                              paddingLeft: '1.1875rem',
                              background: (theme) =>
                                  theme.palette.primary.contrastText,
                              borderColor: (theme) =>
                                  theme.palette.primary.contrastText,
                              borderLeft: (theme) =>
                                  `0.375rem solid ${theme.palette.secondary.main}`,
                          }
                        : {}),
                    ...(isDisabled
                        ? {
                              background: (theme) => theme.palette.error.dark,
                              borderColor: (theme) => theme.palette.error.main,
                              cursor: 'not-allowed',
                          }
                        : {}),
                    ...(withHover
                        ? {
                              '&:hover': {
                                  paddingLeft: '1.1875rem',
                                  background: (theme) =>
                                      theme.palette.primary.contrastText,
                                  borderColor: (theme) =>
                                      theme.palette.primary.contrastText,
                                  borderLeft: (theme) =>
                                      `0.375rem solid ${theme.palette.secondary.main}`,
                              },
                          }
                        : {}),
                    ...(style || {}),
                }}
            >
                {children}
            </Card>
        </Tooltip>
    );
};
