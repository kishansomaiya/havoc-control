

import MapPage from './pages/map/MapPage'
import { useEffect } from 'react'
import { setFrontendAccessToken } from './store/features/appSlice'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Callback from './components/callback'
import { useAuth, withAuthenticationRequired } from 'react-oidc-context';
import { useAppDispatch, useAppSelector } from './store/hooks';

// We should handle routing and auth here
function App() {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const {frontendAccessToken} = useAppSelector(state => state.app);
  const ProtectedMapPage = withAuthenticationRequired(MapPage, {
    onBeforeSignin: () => {
      console.log('Redirecting to sign-in page...');
    },
  });

  useEffect(() => {
    if (auth && auth?.user?.access_token) {
      dispatch(setFrontendAccessToken(auth?.user?.access_token));
    }
  }, [auth, dispatch]);

  if (auth.isLoading && frontendAccessToken !== auth?.user?.access_token) {
    return <div>Loading authentication...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ProtectedMapPage />}
        />
        <Route
          path="/callback"
          element={
            <Callback />
          }
        />
        <Route
          path="*"
          element={<>Page not found</>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
