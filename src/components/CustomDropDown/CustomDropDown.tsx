import { LoadingButton } from '@mui/lab';
import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    Menu,
    MenuItem,
    Typography,
    useTheme,
} from '@mui/material';
import { isEqual } from 'lodash';
import {
    ChangeEvent,
    FC,
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import * as Icon from 'react-feather';

export interface CustomDropDownOption {
    name: string;
    value: string;
    disabled?: boolean;
    selected?: boolean;
    onClick?: (
        event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
        value: string
    ) => void;
    onSelectionChange?: (
        event: ChangeEvent<HTMLInputElement>,
        value: string
    ) => void;
}

interface CustomDropDownProps {
    label: string;
    options: CustomDropDownOption[];
    checkable?: boolean;
    applyLabel?: string;
    clearLabel?: string;
    loading?: boolean;
    emptyDataLabel?: string;
    showCountBadge?: boolean;
    onSelectOption?: (option: CustomDropDownOption) => void;
    onApplySelectionChange?: (options: CustomDropDownOption[]) => void;
    onClearSelectionChange?: () => void;
}

export const CustomDropDown: FC<CustomDropDownProps> = ({
    label,
    options,
    checkable = false,
    applyLabel = 'Apply',
    clearLabel = 'Clear',
    loading = false,
    emptyDataLabel = 'No options available',
    showCountBadge = false,
    onSelectOption,
    onApplySelectionChange,
    onClearSelectionChange,
}) => {
    const theme = useTheme();
    const ddHandleRef = useRef<HTMLDivElement | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLDivElement>(
        null
    );
    const [menuOptions, setMenuOptions] =
        useState<CustomDropDownOption[]>(options);
    const [selectedCount, setSelectedCount] = useState<number>(0);

    const isMenuOpen = useMemo(() => Boolean(menuAnchorEl), [menuAnchorEl]);
    const { showApplyButton, showResetButton } = useMemo(
        () => ({
            showApplyButton: Boolean(onApplySelectionChange),
            showResetButton: Boolean(onClearSelectionChange),
        }),
        [onApplySelectionChange, onClearSelectionChange]
    );
    const showActions = useMemo(
        () => (showApplyButton || showResetButton) && menuOptions.length > 0,
        [showApplyButton, showResetButton, menuOptions]
    );
    const isApplyDisabled = useMemo(
        () => loading || !showApplyButton || isEqual(menuOptions, options),
        [loading, menuOptions, options, showApplyButton]
    );
    const isClearDisabled = useMemo(
        () =>
            loading ||
            !showResetButton ||
            menuOptions.filter((item) => item.selected && !item.disabled)
                .length === 0,
        [loading, menuOptions, showResetButton]
    );

    const handleOpenMenu = useCallback(() => {
        setMenuAnchorEl(ddHandleRef.current);
    }, []);

    const handleCloseMenu = useCallback(() => {
        if (loading) {
            return;
        }
        setMenuAnchorEl(null);
    }, [loading]);

    const handleMenuOptionSelectionChange = useCallback(
        (newValue: boolean, option: CustomDropDownOption) => {
            setMenuOptions((pre) =>
                pre.map((item) =>
                    item === option ? { ...item, selected: newValue } : item
                )
            );
        },
        []
    );

    const handleApplySelectionChange = useCallback(() => {
        onApplySelectionChange?.(menuOptions);
    }, [menuOptions, onApplySelectionChange]);

    useEffect(() => {
        setMenuOptions(options);
    }, [options, /* effect dep */ menuAnchorEl]);

    useEffect(() => {
        setSelectedCount(options.filter((item) => item.selected).length);
    }, [options]);

    return (
        <>
            <ButtonGroup
                ref={ddHandleRef}
                variant="outlined"
            >
                <Button
                    variant="outlined"
                    sx={{
                        paddingLeft: theme.spacing(2.5),
                        paddingRight: theme.spacing(2.5),
                    }}
                    onClick={handleOpenMenu}
                >
                    <Badge
                        badgeContent={selectedCount}
                        invisible={!showCountBadge}
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: theme.palette.warning.dark,
                                right: theme.spacing(-1.25),
                                top: theme.spacing(0.25),
                                paddingLeft: theme.spacing(0.5),
                                paddingRight: theme.spacing(0.5),
                                height: theme.spacing(2),
                                minWidth: theme.spacing(2),
                            },
                        }}
                    >
                        <Box
                            display="flex"
                            gap={1}
                            data-testid="portfolio-details-export-button"
                        >
                            {label}
                        </Box>
                    </Badge>
                </Button>
                <Box>
                    <Divider orientation="vertical" />
                </Box>
                <Button
                    variant="outlined"
                    onClick={handleOpenMenu}
                    sx={{
                        padding: '0.375rem 0.5rem',
                    }}
                    data-testid="portfolio-details-export-arrow"
                >
                    <Icon.ChevronDown size="1rem" />
                </Button>
            </ButtonGroup>

            <Menu
                id="dropdown-menu"
                data-testid="custom-dropdown-menu"
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={handleCloseMenu}
                sx={{
                    maxHeight: theme.spacing(50),
                }}
                MenuListProps={{
                    sx: {
                        background: (theme) =>
                            theme.palette.primary.contrastText,
                        minWidth: theme.spacing(30),
                        paddingBottom: theme.spacing(showActions ? 0 : 1),
                        // maxHeight: theme.spacing(50),
                    },
                }}
            >
                {menuOptions.map((option) => {
                    const {
                        name,
                        value,
                        disabled,
                        selected,
                        onClick,
                        onSelectionChange,
                    } = option;
                    return (
                        <MenuItem
                            key={value}
                            disabled={disabled}
                            onClick={(event) => {
                                onClick?.(event, value);
                                onSelectOption?.(option);
                                if (checkable) {
                                    handleMenuOptionSelectionChange(
                                        !selected,
                                        option
                                    );
                                }
                            }}
                            data-testid="dd-option"
                        >
                            {checkable && (
                                <Checkbox
                                    color="secondary"
                                    checked={selected}
                                    sx={{
                                        padding: 0,
                                        paddingRight: theme.spacing(1),
                                    }}
                                    onChange={(event) => {
                                        onSelectionChange?.(event, value);
                                    }}
                                    data-testid="list-item-checkbox"
                                />
                            )}
                            <Typography variant="body1">{name}</Typography>
                        </MenuItem>
                    );
                })}
                {!menuOptions.length && (
                    <MenuItem
                        disabled
                        data-testid="dd-no-data-option"
                    >
                        {emptyDataLabel}
                    </MenuItem>
                )}

                {/* Sticky Footer */}
                {showActions && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: theme.spacing(1.5),
                            justifyContent: 'flex-end',
                            position: 'sticky',
                            bottom: 0,
                            px: theme.spacing(3),
                            py: theme.spacing(1.5),
                            backgroundColor: 'inherit',
                        }}
                    >
                        <Button
                            variant="outlined"
                            disabled={isClearDisabled}
                            onClick={onClearSelectionChange}
                            data-testid="dd-clear-button"
                        >
                            {clearLabel}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            onClick={handleApplySelectionChange}
                            color="secondary"
                            disabled={isApplyDisabled}
                            loading={loading}
                            data-testid="dd-apply-button"
                        >
                            {applyLabel}
                        </LoadingButton>
                    </Box>
                )}
            </Menu>
        </>
    );
};
