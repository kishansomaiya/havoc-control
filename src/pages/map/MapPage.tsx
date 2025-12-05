import Map from "../../components/map/Map";
import { useGetEntityQuery, useGetWebsocketQuery, useUpdateWebsocketMutation } from '../../store/havocAPI';
import { setActiveSectorId } from '../../store/features/appSlice';
import EntityManager from '../../components/entityManager/entityManager';
import EntityMenu from '../../components/entityMenu/entityMenu';
import { AppBar, Avatar, Box, Toolbar, styled } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Websocket from '../../components/websocket/websocket';

const Page = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
});

const PageContent = styled(Box)({
  display: 'flex',
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

const EntityManagerDrawer = styled(Box)<{ open: boolean }>(({ theme: { palette }, open }) => ({
  background: palette.background.default,
  borderRight: `1px solid ${palette.divider}`,
  overflow: 'hidden',
  position: 'relative',
  transform: open ? 'translateX(0)' : 'translateX(-100%)',
  transition: 'transform 0.3s ease',
  width: 450,
  zIndex: 1,
}));

const MapPage = () => {
  const dispatch = useAppDispatch();
  const { left } = useAppSelector((state: any) => state.app.appOpenDrawers);
  const { activeSectorId } = useAppSelector((state: any) => state.app);
  const { data: sectorData, error: sectorError, isLoading: sectorLoading } = useGetEntityQuery('sector');

  // Get relevant app data on load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Use the sector from the URL if it exists, otherwise use the sector from localStorage, otherwise use the first sector in the list
    if (!searchParams.has('sector') && !activeSectorId && sectorData && sectorData.values.length > 0) {
      console.log('Setting active sector from API data');
      dispatch(setActiveSectorId(sectorData.values[0]?.meta.id));

      // update url bar with new lat/lng without reloading the page
      // window.history.replaceState({}, '', `?${newSearchParams.toString()}`)
    }
  }, [dispatch, activeSectorId, sectorData])

  if (sectorLoading) { return <div>Loading...</div>; }
  // if (sectorError) { return <div>Error loading sector data</div>; }

  return (
    <Page className='page'>
      <Websocket />
      <AppBar
        elevation={0}
        sx={{
          position: 'relative',
          alignItems: 'center',
          minHeight: 52,
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
          <Box>
            Data
          </Box>
          <Box>
            <Avatar sx={{ width: 24, height: 24 }} />
          </Box>
        </Toolbar>
      </AppBar>
      <PageContent className='page__content'>
        <EntityMenu sx={{ zIndex: 2 }} />
        <EntityManagerDrawer open={left}>
          <EntityManager />
        </EntityManagerDrawer>
        <Map />
      </PageContent>
    </Page>
  );
};

export default MapPage;
