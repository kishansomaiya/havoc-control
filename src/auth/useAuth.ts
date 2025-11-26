import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserManager, User as OidcUser } from 'oidc-client-ts';

const OIDC_STORAGE_KEY = 'oidc.user';

// Mock token for development - TODO: Remove when using real auth flow
const MOCK_TOKEN_DATA = {
  id_token:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM0MjkyODcyMjI4MzcyNzU0NyIsInR5cCI6IkpXVCJ9.eyJhbXIiOlsicHdkIl0sImF0X2hhc2giOiJNVTIyVWhGaXp3bnZxVnJKZmpiUm9nIiwiYXVkIjpbIjI4NjY3Mjk3NjI4MjE5MDkyOSIsIjMwODg2Nzg1NzczNzkxMDIyOCIsIjMxNzEyMjI5OTI4MTA4MjMyNCIsIjI4NjY2MjU0OTk0NzA5MDAwMSIsIjI4NjY2MjI4NzI4MjkzMjM5MyJdLCJhdXRoX3RpbWUiOjE3NjMxMzIwNTQsImF6cCI6IjI4NjY2MjU0OTk0NzA5MDAwMSIsImNsaWVudF9pZCI6IjI4NjY2MjU0OTk0NzA5MDAwMSIsImVtYWlsIjoicnlhbi5oYWxsQGhhdm9jYWkuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV4cCI6MTc2MzE3NTc0NywiZmFtaWx5X25hbWUiOiJIYWxsIiwiZ2VuZGVyIjoibWFsZSIsImdpdmVuX25hbWUiOiJSeWFuIiwiaWF0IjoxNzYzMTMyNTQ3LCJpc3MiOiJodHRwczovL2lkcC5oYXZvY2FpLm5ldCIsImxvY2FsZSI6ImVuIiwibmFtZSI6IlJIIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicnlhbi5oYWxsQGhhdm9jYWkuY29tIiwic2lkIjoiVjFfMzQ0NjgzMzg4OTEwNjk5NjM3Iiwic3ViIjoiMzQ0MjI2ODQ4NzM0OTcwOTk3IiwidXBkYXRlZF9hdCI6MTc2MTk0MzM2OCwidXJuOmhhdm9jOmlhbTpjb21tYW5kX21vZGUiOiJESVNBQkxFRCIsInVybjpoYXZvYzppYW06ZmVhdHVyZXMiOnsiYWxsb3ciOlsiKiJdfSwidXJuOmhhdm9jOmlhbTpwbGF5cyI6eyJhbGxvdyI6WyIqIl0sImRlbnkiOlsiUExBWV9LRVlfQ0hBUklPVF9SQU1QX0NPTlRST0wiLCJQTEFZX0tFWV9DSEFSSU9UX1JFU1VQUExZIl19fQ.vWqjGzUW8xAgbkc2ySG_lqIfBmKbf3hSON_MmkVObcgzQq60A6yEPcGQB5qxETb_7wT4IWstfihWkd0FILK1Zwx19939yN07BIfTxm1aLvj0336CTGN6sX5MTmQex9MaqbuTaAHDNK3HLkw4SGkgYeY95Y9hz5Zjgx9HY9Vvhkm1xFzEEphWAi5bRF3XXv3eOJcStd7_S5UgNGFd8--XDMcYvPsTBUs0fx09dkdZ1q44QfawCoIBqPAFnkah3j3IJK5kOZPCs4HPexH3JERsOi8sBrHeSh-Mn64OO4Q2PDJDt8iwhQl_2sbWdJvQ0S-V_ZSBYSP2OzK0-6EShIbTpA",
  session_state: null as string | null,
  access_token:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM0MjkyODcyMjI4MzcyNzU0NyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkcC5oYXZvY2FpLm5ldCIsInN1YiI6IjM0NDIyNjg0ODczNDk3MDk5NyIsImF1ZCI6WyIyODY2NzI5NzYyODIxOTA5MjkiLCIzMDg4Njc4NTc3Mzc5MTAyMjgiLCIzMTcxMjIyOTkyODEwODIzMjQiLCIyODY2NjI1NDk5NDcwOTAwMDEiLCIyODY2NjIyODcyODI5MzIzOTMiXSwiZXhwIjoxNzYzMTc1NzQ3LCJpYXQiOjE3NjMxMzI1NDcsIm5iZiI6MTc2MzEzMjU0NywiY2xpZW50X2lkIjoiMjg2NjYyNTQ5OTQ3MDkwMDAxIiwianRpIjoiVjJfMzQ2Njc4NTk5ODQ1MTU1NTQ3LWF0XzM0NjY3ODU5OTg0NTIyMTA4MyJ9.GrmsyQ_fPhvxMjH1FIRhSy9_ZIT3gFcv-UOrfCl08c-fGBZC1j08EY99uLK0PbOSqzgAaKxQ8se-XGXTKo6Z2mHtqIxJx5Fvxax-qfvywjA7brbviL0d_KSfuAOOqCZBr19F73VEh0cUkbN_ELwjIB7joht4XiWqK0ByUQR3r99RhpqVuekVgJo3xoCJF5h9Pcy9QM4Np0W-ss634AQ_hVN41zmYBJ734lK1-UZ5Xd53mqwSQXyLuwvhQKBldgiVDEwzN5iJ5_YH3YDfp1W3U-b_7J725OlWykph_HhklIZRfcqJys9XILnF5hbioDtwJayU1DuvohR2Ap7Wxz3q9g",
  token_type: "Bearer",
  scope: "openid profile email ",
  profile: {
    aud: [
      "286672976282190929",
      "308867857737910228",
      "317122299281082324",
      "286662549947090001",
      "286662287282932393",
    ],
    client_id: "286662549947090001",
    email: "ryan.hall@havocai.com",
    email_verified: true,
    exp: 1763175747,
    family_name: "Hall",
    gender: "male",
    given_name: "Ryan",
    iat: 1763132547,
    iss: "https://idp.havocai.net",
    locale: "en",
    name: "RH",
    preferred_username: "ryan.hall@havocai.com",
    sid: "V1_344683388910699637",
    sub: "344226848734970997",
    updated_at: 1761943368,
    "urn:havoc:iam:command_mode": "DISABLED",
    "urn:havoc:iam:features": [
      {
        allow: ["*"],
      },
      {
        allow: ["*"],
      },
    ],
    "urn:havoc:iam:plays": [
      {
        allow: ["*"],
        deny: ["PLAY_KEY_CHARIOT_RAMP_CONTROL", "PLAY_KEY_CHARIOT_RESUPPLY"],
      },
      {
        allow: ["*"],
        deny: ["PLAY_KEY_CHARIOT_RAMP_CONTROL", "PLAY_KEY_CHARIOT_RESUPPLY"],
      },
    ],
  },
  expires_at: 1763175746,
};

interface User {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_at: number;
  authenticated: boolean;
}

interface OAuthConfig {
  oauthClientId: string;
  oauthAuthorityUrl: string;
}

let userManager: UserManager | null = null;
let authInitialized = false;
let isRedirecting = false;
let oauthConfig: OAuthConfig | null = null;

const getFrontendConfig = async (): Promise<OAuthConfig | null> => {
  if (oauthConfig) return oauthConfig;
  
  try {
    const response = await fetch('/.frontend/context');
    const data = await response.json();
    
    oauthConfig = {
      oauthClientId: data.oauthClientId || '',
      oauthAuthorityUrl: data.oauthAuthorityUrl || '',
    };
    
    return oauthConfig;
  } catch (error) {
    console.error('Failed to fetch frontend config:', error);
    return null;
  }
};

const initializeUserManager = async (): Promise<UserManager | null> => {
  if (userManager) return userManager;
  
  const config = await getFrontendConfig();
  if (!config) {
    console.error('Cannot initialize UserManager: no config');
    return null;
  }

  try {
    console.log('initializeUserManager: Creating new UserManager with authority:', config.oauthAuthorityUrl);
    userManager = new UserManager({
      authority: config.oauthAuthorityUrl,
      client_id: config.oauthClientId,
      redirect_uri: `${window.location.origin}/callback`,
      response_type: 'code',
      scope: 'openid profile email',
      post_logout_redirect_uri: `${window.location.origin}/`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${window.location.origin}/silent-refresh.html`,
      monitorSession: true,
    });

    // Log localStorage to debug
    console.log('initializeUserManager: localStorage keys:', Object.keys(localStorage));
    
    return userManager;
  } catch (error) {
    console.error('Failed to initialize UserManager:', error);
    return null;
  }
};

export const initiateLogin = async () => {
  if (isRedirecting) {
    console.log('initiateLogin: Already redirecting, skipping');
    return;
  }
  
  console.log('initiateLogin: Starting login redirect');
  isRedirecting = true;
  const manager = await initializeUserManager();
  if (!manager) {
    console.error('Cannot initiate login: UserManager not initialized');
    isRedirecting = false;
    return;
  }

  try {
    console.log('initiateLogin: Calling signinRedirect');
    await manager.signinRedirect();
  } catch (error) {
    console.error('Login initiation failed:', error);
    isRedirecting = false;
  }
};

export const handleCallback = async (): Promise<boolean> => {
  try {
    console.log('handleCallback: Starting callback processing');
    const manager = await initializeUserManager();
    if (!manager) {
      console.error('Cannot handle callback: UserManager not initialized');
      return false;
    }

    console.log('handleCallback: UserManager initialized, calling signinRedirectCallback');
    const user = await manager.signinRedirectCallback();
    console.log('handleCallback: signinRedirectCallback returned:', user ? 'user object' : 'null');
    
    if (user) {
      console.log('handleCallback: User received, storing locally');
      storeUser(user);
      
      // Verify user is stored in UserManager
      const storedUser = await manager.getUser();
      console.log('handleCallback: Verified user stored in UserManager:', storedUser ? 'yes' : 'no');
      
      return true;
    }
    console.log('handleCallback: No user returned from callback');
    return false;
  } catch (error) {
    console.error('Callback handling failed:', error);
    return false;
  }
};

const storeUser = (oidcUser: OidcUser) => {
  const user: User = {
    access_token: oidcUser.access_token,
    id_token: (oidcUser.id_token as string) || '',
    token_type: oidcUser.token_type || 'Bearer',
    expires_at: (oidcUser.expires_at || 0) * 1000,
    authenticated: true,
  };
  
  localStorage.setItem(OIDC_STORAGE_KEY, JSON.stringify(user));
  axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('useAuth: checkAuth starting');
        
        // Use mock token for development
        console.log('useAuth: Using mock token for development');
        const mockUser: User = {
          access_token: MOCK_TOKEN_DATA.access_token,
          id_token: MOCK_TOKEN_DATA.id_token,
          token_type: MOCK_TOKEN_DATA.token_type,
          expires_at: MOCK_TOKEN_DATA.expires_at * 1000,
          authenticated: true,
        };
        
        // Store the full legacy-style payload in localStorage, like the old app
        localStorage.setItem(OIDC_STORAGE_KEY, JSON.stringify(MOCK_TOKEN_DATA));
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockUser.access_token}`;
        setUser(mockUser);
        
        if (!authInitialized) {
          setupAxiosInterceptors();
          authInitialized = true;
        }
        isRedirecting = false;
        console.log('useAuth: User authenticated successfully with mock token');
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const manager = await initializeUserManager();
      if (manager) {
        await manager.signoutRedirect();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem(OIDC_STORAGE_KEY);
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      window.location.href = '/';
    }
  };

  return { user, isLoading, logout };
};

const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized - logging out');
        localStorage.removeItem(OIDC_STORAGE_KEY);
        delete axios.defaults.headers.common['Authorization'];
        
        const manager = await initializeUserManager();
        if (manager) {
          await manager.signoutRedirect();
        } else {
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
  );
};
