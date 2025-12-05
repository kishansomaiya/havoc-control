import { createTheme } from '@mui/material';

export const havocTheme = createTheme({
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
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: { palette } }) => ({
          backgroundColor: palette.background.default,
        }),
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'text', color: 'primary' },
          style: {
            color: '#fff',
          },
        },
      ],
    },
  },
});
