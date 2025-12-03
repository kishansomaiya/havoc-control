import { createTheme } from '@mui/material';

/**
 * Module declaration to extend MUI components with custom variants
 */
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    link: true;
  }
}

export const havocTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    background: {
      default: '#1C1D24',
    },
    action: {
      selected: '#0F4ED7',
    },
    divider: '#43474E',
  },
  typography: {
    fontFamily: ['"JetBrains Mono"', 'monospace'].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        root: {
          '--color-gray': '#9B9DA1',

          // Helper classes
          '.truncate': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          },
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true, // Have Stack spacing use gap instead of margin
      },
      styleOverrides: {
        root: {
          '&.multi-button-container > button': {
            border: 'var(--border-basic)',
            justifyContent: 'flex-start',
            flexGrow: 1,
            maxHeight: '72px',
            minHeight: '44px',
            '& > .MuiButton-icon': {
              margin: '0 16px 0 8px',
            },
            '&.active': {
              border: '1px solid var(--color-primary)',
              background: 'rgba(var(--rgb-primary), 0.08)',
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: { palette } }) => ({
          backgroundColor: palette.background.default,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.button-text-variant': {
            color: 'var(--color-primary)',
            opacity: 0.8,
            height: 40,
            padding: 2,
            mt: 1,
            display: 'flex',
            justifySelf: 'flex-end',
          }
        }
      },
      variants: [
        {
          props: { variant: 'text', color: 'primary' },
          style: {
            color: '#fff',
          },
        },
        {
          props: { variant: 'link' },
          style: {
            color: 'var(--color-primary)',
            opacity: 0.8,
            width: 44,
            height: 40, // Used in `buttonTheme.test.tsx`, be sure to update test if changed
            textDecoration: 'underline',
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background: '#2B2C30',
          '&:hover': {
            background: '#3E3F43',
          },
          '&.tool-button': {
            height: '32px', // Used in `buttonTheme.test.tsx`, be sure to update test if changed
            width: '32px',
            margin: '6px',
            background: 'rgba(var(--rgb-secondary), 0.6)',
            border: 'var(--border-basic)',
            boxShadow: '0px 1px 3px 1px rgba(var(--rgb-secondary), 0.15), 0px 1px 2px 0px rgba(var(--rgb-secondary), 0.3)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(var(--rgb-secondary), 0.8)',
            },
            'img': {
              "-webkit-touch-callout": 'none',
            }
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          "&.havoc-toggle-button-group > .MuiToggleButtonGroup-grouped": {
            textTransform: "none",
            height: "40px", // Used in `buttonTheme.test.tsx`, be sure to update test if changed
            backgroundColor: "var(--color-button-secondary)",
            border: "var(--border-basic)",
            "& > .Mui-selected": {
              borderColor: "var(--color-button-primary)",
              backgroundColor: "var(--color-button-primary)",

              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
              }
            }
          }
        }

      }
    }
  },
});