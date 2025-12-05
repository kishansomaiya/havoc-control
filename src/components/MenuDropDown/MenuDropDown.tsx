import { FC, useCallback, useState, useRef } from 'react';
import {
    Box,
    ClickAwayListener,
    Grow,
    MenuList,
    Paper,
    Popper,
    BoxProps,
} from '@mui/material';
import * as Icon from 'react-feather';

export interface MenuDropDownProps extends BoxProps {
    closeOnSelect?: boolean;
}

export const MenuDropDown: FC<MenuDropDownProps> = ({
    children,
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

    return (
        <Box
            display="flex"
            alignItems="center"
            ref={menuAnchorRef}
            {...props}
        >
            {isMenuOpen ? (
                <Icon.ChevronUp
                    size="1rem"
                    cursor="pointer"
                    onClick={handleToggleMenu}
                />
            ) : (
                <Icon.ChevronDown
                    size="1rem"
                    cursor="pointer"
                    onClick={handleToggleMenu}
                />
            )}

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
