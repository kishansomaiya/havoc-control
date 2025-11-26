import { useAuth } from './auth/useAuth';
import Map from './Views/Map';
import Callback from './auth/callback';

function App() {
  const isCallback = window.location.pathname === '/callback';

  if (isCallback) {
    return <Callback />;
  }

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return <Map />;
}

export default App;
