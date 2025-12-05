import {
    Box,
    BoxProps,
    Button,
    ClickAwayListener,
    Grow,
    MenuList,
    Paper,
    Popper,
} from '@mui/material';
import { ChevronUp, ChevronDown } from 'react-feather';
import { FC, useCallback, useState, useRef, ReactNode } from 'react';

export interface ButtonDropDown extends BoxProps {
    closeOnSelect?: boolean;
    buttonStyle?: 'contained' | 'outlined' | 'text';
    buttonLabel: string;
    icon?: React.ReactNode;
    openIcon?: ReactNode;
    closeIcon?: ReactNode;
}

export const ButtonDropDown: FC<ButtonDropDown> = ({
    children,
    buttonStyle,
    buttonLabel,
    icon,
    openIcon = <ChevronUp size="1rem" />,
    closeIcon = <ChevronDown size="1rem" />,
    closeOnSelect = false,
    ...props
}) => {
    const menuAnchorRef = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleToggleMenu = useCallback(() => {
        setIsMenuOpen((isMenuOpen) => !isMenuOpen);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleCloseMenuOnSelection = useCallback(() => {
        if (closeOnSelect) {
            handleCloseMenu();
        }
    }, [closeOnSelect, handleCloseMenu]);

    const endIcon = icon
        ? icon
        : openIcon && closeIcon && isMenuOpen
          ? openIcon
          : closeIcon;

    return (
        <Box
            display="flex"
            alignItems="center"
            ref={menuAnchorRef}
            {...props}
        >
            <Box
                display="flex"
                alignItems="center"
            >
                <Button
                    variant={buttonStyle}
                    onClick={handleToggleMenu}
                    endIcon={endIcon}
                >
                    {buttonLabel}
                </Button>
            </Box>

            <Popper
                open={isMenuOpen}
                anchorEl={menuAnchorRef.current}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 1, width: '100%' }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start'
                                    ? 'left top'
                                    : 'left bottom',
                        }}
                    >
                        <Paper
                            sx={{ marginTop: '1rem', width: '100%' }}
                            onClick={handleCloseMenuOnSelection}
                        >
                            <ClickAwayListener onClickAway={handleCloseMenu}>
                                <MenuList
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    data-testid="menu-drop-down-list"
                                >
                                    {children}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    );
};
