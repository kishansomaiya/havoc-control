
import { useEffect, useState } from 'react'
import { havocai } from './types/messages/v0/bundle'
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';
import App from './App';
import { useAppDispatch } from './store/hooks';

// We should handle routing and auth here
function Authenticate() {
  const dispatch = useAppDispatch();

  const [ frontendContext, setFrontendContext ] = useState<AuthProviderProps | null>(null);

  // First fetch the FrontendContext from the backend
  useEffect(() => {
    const getFrontendContext = async () => {
      try {
        return fetch('http://localhost:8080/.frontend/context', {
          method: 'GET',
          headers: {
            Accept: 'application/protobuf',
            Content: 'application/json',
          }
        })
          .then((res) => res.arrayBuffer())
          .then((buffer) => havocai.messages.v0.FrontendContext.decode(new Uint8Array(buffer)))
          .catch((error) => {
            console.error('Error fetching or decoding FrontendContext:', error)
          })
      }
      catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    getFrontendContext().then((data) => {
      const { oauthClientId, oauthAuthorityUrl } = data
      const config: AuthProviderProps = {
        authority: oauthAuthorityUrl,
        client_id: oauthClientId,
        redirect_uri: `${window.location.protocol}//${window.location.host}/callback`,
        post_logout_redirect_uri: `${window.location.protocol}//${window.location.host}/`,
        response_type: 'code',
        scope: 'openid profile email',
        onSigninCallback: () => console.log('Signed in'),
      };

      setFrontendContext(config);
    })

  }, [dispatch]);

  if (!frontendContext) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider {...frontendContext}>
      <App />
    </AuthProvider>
  )
}

export default Authenticate;
