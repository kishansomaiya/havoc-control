const env = { ...process.env, ...window.env } as ImportMetaEnv;

export const apiUrl = env.VITE_API_URL.replace(/\/+$/, '');
export const ioApiUrl = env.VITE_IO_API_URL.replace(/\/+$/, '');
export const adminApiUrl = env.VITE_ADMIN_API_URL.replace(/\/+$/, '');

export const auth0Domain = env.VITE_AUTH0_DOMAIN;
export const auth0ClientId = env.VITE_AUTH0_CLIENT_ID;
export const auth0ApiAudience = env.VITE_AUTH0_API_AUDIENCE;
export const auth0CallbackUrl = env.VITE_AUTH0_CALLBACK_URL;
export const mapboxAccessToken = env.VITE_MAPBOX_ACCESS_TOKEN;
export const heapAnalyticsId = env.VITE_HEAP_ANALYTICS_ID.trim();
export const ddEnv = env.VITE_DD_ENVIRONMENT;
export const environment = env.VITE_ENVIRONMENT;
export const flagsmithEnvID = env.VITE_FLAGSMITH_ENV_ID;
