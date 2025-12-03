import { AppBar, Avatar, Box, Stack, Toolbar, Typography, styled } from '@mui/material';
import { useAppSelector } from "../../store/hooks"
import { useGetEntityQuery } from '../../store/havocAPI'
import Drawer from '../../components/drawer/drawer';
import Map from "../../components/map/Map";
import EntityManager from '../../components/entityManager/entityManager';
import EntityMenu from '../../components/entityMenu/entityMenu';

import SectorIcon from '../../assets/icons/sectors-icon.svg?react';
import BoatsIcon from '../../assets/icons/white-boats.svg?react';

const Page = styled(Stack)({
  height: '100dvh',
});

const PageContent = styled(Stack)({
  flexDirection: 'row',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
});

const Logo = styled('img')({
  display: 'block',
  flexShrink: 0,
  height: 30,
  maxWidth: '100%',
  objectFit: 'contain',
});

const Pipe = styled(Typography)({
  margin: '0 8px',
  color: 'var(--color-gray)',
});

const CenterData = styled(Stack)`
  @media (max-width: 580px) {
    display: none;
  }

  flex-direction: row;
  align-items: center;

  p {
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 500;
    }
`;

const MapPage = () => {
  const { left = false } = useAppSelector((state) => state.app.appOpenDrawers);
  const { activeSectorId } = useAppSelector((state) => state.app);
  // TODO TEMP: removes quotes around activeSectorId
  const sectorName = activeSectorId ? activeSectorId.replace(/^"|"$/g, '') : 'No Sector Selected';
  const {data: teams} = useGetEntityQuery('team');
  const {data: vehicles} = useGetEntityQuery('boat');
  const teamCount = teams?.values.length ?? 0;
  const vehicleCount = vehicles?.values.length ?? 0;
  const pluralize = (count: number, word: string) => `${count} ${word}${count !== 1 ? 's' : ''}`;

  return (
    <Page className='page'>
      <AppBar
        elevation={0}
        sx={{
          position: 'relative',
          alignItems: 'center',
          minHeight: 52,
          flexDirection: 'row',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        className='page__header'
      >
        <Toolbar
          variant='dense'
          sx={{
            width: '100%',
            px: {sm: '16px'},
            minHeight: 52,
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Logo src='/images/havocai-logo.png' alt='Havoc AI' className='page__header-logo' />
          </Box>
          <CenterData className='page__center-data'>
            <SectorIcon />
            <Typography className="truncate" sx={{ ml: 1, maxWidth: '180px' }}>
              {sectorName}
            </Typography>

            <Pipe>|</Pipe>

            <BoatsIcon />
            <Typography sx={{ ml: 1 }}>
              {pluralize(teamCount, 'team')}
            </Typography>

            <Pipe>|</Pipe>

            <Typography>
              {pluralize(vehicleCount, 'vehicle')}
            </Typography>
          </CenterData>
          <Box>
            <Avatar sx={{ width: 24, height: 24 }} />
          </Box>
        </Toolbar>
      </AppBar>
      <PageContent className='page__content'>
        <EntityMenu sx={{ zIndex: 2 }} />
        <Drawer open={left} anchor="left">
          <EntityManager />
        </Drawer>
        <Map />
      </PageContent>
    </Page>
  );
};

export default MapPage;
