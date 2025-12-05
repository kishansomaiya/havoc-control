import {
    alpha,
    buttonClasses,
    inputBaseClasses,
    inputLabelClasses,
} from '@mui/material';

export const darkThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#8D8D8D',
            contrastText: '#313131',
        },
        secondary: {
            main: '#046BA5',
        },
        text: {
            primary: '#F7F7F7',
            secondary: '#8D9498',
            highlighted: '#CBD2D5',
            accent: '#FFFFFF',
        },
        error: {
            main: '#AD3D3D',
            light: '#FF4E4E',
            dark: '#2E2828',
        },
        success: {
            main: '#0AB490',
        },
        warning: {
            main: '#FF9900',
            light: '#FFD699',
            dark: '#ED5A07',
        },
        background: {
            default: '#242424',
            header: '#121212',
            elevated: '#313131',
            transparent_85: 'rgba(0, 0, 0, 0.85)',
            transparent_90: 'rgba(33, 33, 33, 0.9)',
        },
        grey: {
            '300': '#CBD2D5',
            '400': '#646464',
            '500': '#5B6368',
            '600': '#3F464B',
            '700': '#3A3A3C',
        },
    },
    components: {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    background: '#242424',
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    [`& .MuiSelect-select`]: {
                        fontSize: '0.75rem',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    borderRight: '0.0625rem solid #5B6368',
                    color: '#8D9498',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    padding: '1rem 2rem',
                    '&.Mui-selected': {
                        color: '#F7F7F7',
                    },
                    '&.MuiTab-sizeLarge': {
                        padding: '1.5rem 2rem',
                        minWidth: '15rem',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    display: 'none',
                },
            },
        },
        MuiButtonGroup: {
            styleOverrides: {
                root: {
                    [`&.MuiButtonGroup-fullWidth > span`]: {
                        flexGrow: 1,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    height: '2.25rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    [`&.${buttonClasses.sizeSmall}`]: {
                        height: '2rem',
                        padding: '0.25rem 0.5rem',
                    },
                    [`&.${buttonClasses.sizeLarge}`]: {
                        height: '2.625rem',
                        fontSize: '0.875rem',
                        padding: '0.5rem 1.5rem',
                    },
                    [`&.${buttonClasses.contained}`]: {
                        background: '#3F464B',
                        [`&.${buttonClasses.colorSecondary}`]: {
                            background: '#046BA5',
                        },
                    },
                    [`&.${buttonClasses.disabled}&.${buttonClasses.colorPrimary}`]:
                        {
                            color: '#8D9498',
                        },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '0.6875rem',
                    color: 'text.primary',
                    backgroundColor: '#3F464B',
                    padding: '0.5rem',
                },
                arrow: {
                    color: '#3F464B',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    [`&.MuiLink-secondary`]: {
                        color: '#2EAEE2',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: '#8D9498',
                    border: 'none',
                },
                head: {
                    color: '#FFFFFF',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    [`:not(&.Mui-focused)`]: {
                        [`:not(&.MuiInputLabel-shrink)`]: {
                            transform: `translate(0.75rem, 0.75rem) scale(1)`,
                        },
                    },
                    [`&.${inputLabelClasses.sizeSmall}`]: {
                        fontSize: '0.75rem',
                        [`:not(&.Mui-focused)`]: {
                            [`:not(&.MuiInputLabel-shrink)`]: {
                                transform: `translate(0.625rem 0.5rem) scale(1)`,
                            },
                        },
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    [`&.${inputBaseClasses.adornedStart}`]: {
                        paddingLeft: '0.5rem',
                    },
                    [`&.${inputBaseClasses.sizeSmall}`]: {
                        padding: '0.625rem 0.5rem',
                        fontSize: '0.75rem',
                        input: {
                            fontSize: '0.75rem',
                        },
                        [`& .MuiSelect-select`]: {
                            paddingLeft: '0.25rem',
                        },
                    },
                    input: {
                        padding: '0',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: '#FFFFFF',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    padding: 0,
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        paddingTop: '0.25rem',
                        paddingBottom: '0.25rem',
                    },
                },
                inputRoot: {
                    padding: 0,
                    input: {
                        '&.MuiAutocomplete-input': {
                            padding: '0.5rem',
                            fontSize: '0.6875rem',
                            fontWeight: 400,
                            lineHeight: 1.1,
                        },
                    },
                },
                paper: {
                    backgroundColor: '#313131',
                },
                listbox: {
                    '& .MuiAutocomplete-option[aria-selected="true"]': {
                        backgroundColor: '#3F464B',
                    },
                    '& .MuiAutocomplete-option[aria-selected="true"].Mui-focused':
                        {
                            backgroundColor: alpha('#3F464B', 0.8),
                        },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: '#4980C1',
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4980C1',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #5B6368',
                    background: '#242424',
                    boxShadow: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    height: '26px',
                    padding: '0.125rem 0',
                    borderRadius: '0.25rem',
                    [`&.MuiChip-colorDefault`]: {
                        background: '#3F464B',
                    },
                },
                label: {
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    padding: '0 0.5rem',
                    color: '#EEEFF0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: '#3F464B',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    lineHeight: '1.43',
                    color: '#FFFFFF',
                    margin: '0',
                    padding: '0.75rem 1.5rem',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#5B6368',
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    '&.Mui-error': {
                        color: '#FF4E4E',
                    },
                },
            },
        },
    },
};
