import {
    Configuration,
    ConfigurationParameters,
} from '../openapi/auto-generated';
import {
    Configuration as AdminConfiguration,
    ConfigurationParameters as AdminConfigurationParameters,
} from '../openapi/auto-generated-admin';
import { getUserAccessToken, trimTrailingSlash } from '../../utils';

export function apiConfig(
    basePath?: string,
    refreshToken?: () => Promise<void>
): Configuration {
    const parameters: ConfigurationParameters = {
        basePath: trimTrailingSlash(basePath ?? 'http://localhost:8080'),
        fetchApi: async (
            input: RequestInfo,
            init?: RequestInit
        ): Promise<Response> => {
            const fetchWithToken = async () => {
                const headers = new Headers(init?.headers);

                const accessToken = getUserAccessToken();
                if (accessToken) {
                    headers.set('Authorization', `Bearer ${accessToken}`);
                }

                return await fetch(input, { ...init, headers });
            };

            let response = await fetchWithToken();

            if (response.status === 401) {
                if (refreshToken) {
                    await refreshToken();
                    response = await fetchWithToken();
                }
            }

            return response;
        },
    };

    return new Configuration(parameters);
}

export function adminApiConfig(
    basePath?: string,
    refreshToken?: () => Promise<void>
): AdminConfiguration {
    const parameters: AdminConfigurationParameters = {
        basePath: trimTrailingSlash(basePath ?? 'http://localhost:8080'),
        fetchApi: async (
            input: RequestInfo,
            init?: RequestInit
        ): Promise<Response> => {
            const fetchWithToken = async () => {
                const headers = new Headers(init?.headers);

                const accessToken = getUserAccessToken();
                if (accessToken) {
                    headers.set('Authorization', `Bearer ${accessToken}`);
                }

                return await fetch(input, { ...init, headers });
            };

            let response = await fetchWithToken();

            if (response.status === 401) {
                if (refreshToken) {
                    await refreshToken();
                    response = await fetchWithToken();
                }
            }

            return response;
        },
    };

    return new AdminConfiguration(parameters);
}