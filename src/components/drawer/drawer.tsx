import { Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

interface DrawerProps {
  open: boolean;
  anchor?: 'left' | 'right';
  sx?: SxProps<Theme>;
  children: React.ReactNode;
}

const Drawer = ({ open, anchor = 'left', sx, children }: DrawerProps) => {
  return (
    <Stack
      sx={{
        background: (theme) => theme.palette.background.default,
        borderRight: anchor === 'left' ? (theme) => `1px solid ${theme.palette.divider}` : undefined,
        borderLeft: anchor === 'right' ? (theme) => `1px solid ${theme.palette.divider}` : undefined,
        overflow: 'hidden',
        position: 'relative',
        transform: open ? 'translateX(0)'
                        : anchor === 'left'
                            ? 'translateX(-100%)'
                            : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        width: 450,
        zIndex: 1,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
};

export default Drawer;
