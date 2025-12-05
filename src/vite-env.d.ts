/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_IO_API_URL: string;
    readonly VITE_ADMIN_API_URL: string;
    readonly VITE_AUTH0_DOMAIN: string;
    readonly VITE_AUTH0_CLIENT_ID: string;
    readonly VITE_AUTH0_API_AUDIENCE: string;
    readonly VITE_AUTH0_CALLBACK_URL: string;
    readonly VITE_MAPBOX_ACCESS_TOKEN: string;
    readonly VITE_HEAP_ANALYTICS_ID: string;
    readonly VITE_DD_ENVIRONMENT: 'dev' | 'staging' | 'prod';
    readonly VITE_ENVIRONMENT: 'local' | 'dev' | 'stage' | 'prod';
    readonly VITE_FLAGSMITH_ENV_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
