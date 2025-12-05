import { useEffect, useState } from 'react';
import { kebabCase } from 'lodash';
import { setActiveEntity, setAppOpenDrawers } from '../../store/features/appSlice';
import { Box, Button, List, ListItemButton, styled, Tooltip } from '@mui/material';
import SectorsIcon from '../../assets/icons/sectors-icon.svg?react';
import TeamsIcon from '../../assets/icons/teams-icon.svg?react';
import VehiclesIcon from '../../assets/icons/boats-list-icon.svg?react';
import TracksIcon from '../../assets/icons/tracks-icon.svg?react';
import MarkersIcon from '../../assets/icons/markers-icon.svg?react';
import ZonesIcon from '../../assets/icons/zones-icon.svg?react';
import TerminalsIcon from '../../assets/icons/terminals-icon.svg?react';
import CollapseMenu from '../../assets/icons/double-arrow-icon.svg?react';
import type { SxProps } from '@mui/material';
import type { Theme } from '@emotion/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const EntityMenuWrapper = styled(Box)<{ open: boolean }>(({ theme: { palette }, open }) => ({
  backgroundColor: palette.background.default,
  borderRight: `1px solid ${palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '4px',
  minWidth: '36px',
  width: open ? '80px' : '36px',
  transition: 'width 0.3s ease',
  'svg': {
    width: '24px',
    height: '24px',
  }
}));

const EntityMenuItemButton = styled(ListItemButton)<{ open: boolean }>(({ theme: { palette }, open }) => ({
  fontSize: '10px',
  fontWeight: 500,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '4px',
  borderRadius: '4px',
  height: open ? '47px' : '32px',
  transition: 'height 0.3s ease, background-color 0.3s ease',
  '&.Mui-selected': {
    backgroundColor: palette.action.selected,
  },
}));

const EntityMenuItemName = styled(Box)<{ open: boolean }>(({ open }) => ({
  overflow: 'hidden',
  opacity: open ? 1 : 0,
  height: open ? 'auto' : 0,
  transition: 'opacity 0.3s ease, height 0.3s ease',
  transitionDelay: open ? '0.3s' : '0s',
}));

const EntityMenuCollapseButton = styled(Button)<{ open: boolean }>(({ open }) => ({
  'svg': {
    transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: 'transform 0.3s ease'
  }
}));

/**
 * id: Used for the API call
 * key: Used for React key, identifying active menu item, and parsing data in EntityManager
 * name: Display name in the menu
 */
const EntityMenuItems = [
  {
    apiKey: 'sector',
    key: 'sector',
    name: 'Sectors',
    icon: <SectorsIcon />,
  },
  {
    apiKey: 'team',
    key: 'team',
    name: 'Teams',
    icon: <TeamsIcon />,
  },
  {
    apiKey: 'boat',
    key: 'vehicle',
    name: 'Vehicles',
    icon: <VehiclesIcon />,
  },
  {
    apiKey: 'track',
    key: 'track',
    name: 'Tracks',
    icon: <TracksIcon />,
  },
  {
    apiKey: 'sector',
    key: 'marker',
    name: 'Markers',
    icon: <MarkersIcon />,
  },
  {
    apiKey: 'sector',
    key: 'area',
    name: 'Zones',
    icon: <ZonesIcon />,
  },
  {
    apiKey: 'zone',
    key: 'terminal',
    name: 'Terminals',
    icon: <TerminalsIcon />,
  },
];

const EntityMenu = ({ sx }: { sx: SxProps<Theme> }) => {
  const dispatch = useAppDispatch();
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<{ apiKey: string; key: string; name: string } | null>(null);
  const { left } = useAppSelector((state: any) => state.app.appOpenDrawers);

  const onMenuClick = (item: { apiKey: string; key: string; name: string }) => {
    // Clicking the active menu item closes it
    if (activeMenuItem?.name === item.name) {
      setActiveMenuItem(null);
      dispatch(setAppOpenDrawers({ left: false }));
      return;
    }

    // Locally track the active menu item
    setActiveMenuItem(item);
    // Track the active entity API key for fetching data
    dispatch(setActiveEntity(item.apiKey));
    // Open up the left drawer
    dispatch(setAppOpenDrawers({ left: true }));
  }

  useEffect(() => {
    // If the left drawer is closed, clear the activeMenuItem locally to remove the selected state
    if (!left) {
      setActiveMenuItem(null);
    }
  }, [left]);

  const toggleEntityMenuWidth = () => {
    setMenuExpanded(!menuExpanded);
  }

  return (
    <EntityMenuWrapper
      className='entity-menu'
      open={menuExpanded}
      sx={sx}
    >
      <List dense disablePadding>
        {EntityMenuItems.map((entityMenuItem) => {
          return (
            <Tooltip
              title={entityMenuItem.name}
              placement="right"
              key={kebabCase(entityMenuItem.name.toLowerCase())}
            >
              <EntityMenuItemButton
                className='entity-menu__item'
                data-testid={`entity-menu__item-${kebabCase(entityMenuItem.name.toLowerCase())}`}
                dense
                disableGutters
                key={kebabCase(entityMenuItem.name.toLowerCase())}
                onClick={() => onMenuClick(entityMenuItem)}
                open={menuExpanded}
                selected={activeMenuItem?.name === entityMenuItem.name}
              >
                {entityMenuItem.icon}
                <EntityMenuItemName className={`entity-menu__item-name`} open={menuExpanded}>
                  {entityMenuItem.name}
                </EntityMenuItemName>
              </EntityMenuItemButton>
            </Tooltip>
          )
        })}
      </List>
      <EntityMenuCollapseButton
        color='primary'
        data-testid='entity-menu__collapse-button'
        onClick={toggleEntityMenuWidth}
        sx={{ minWidth: 'auto', padding: '0px' }}
        variant='text'
        open={menuExpanded}
      >
        <CollapseMenu />
      </EntityMenuCollapseButton>
    </EntityMenuWrapper>
  );
};

export default EntityMenu;
