/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import * as runtime from '../../openapi/auto-generated/runtime';
import {
    Doc360TokenOutput,
    Doc360TokenOutputFromJSON,
} from '../models/Doc360TokenOutput.ts';

export interface RetrieveTokenDoc360UserIdGetRequest {
    userId: string;
}

/**
 *
 */
export class Doc360Api extends runtime.BaseAPI {
    /**
     * Retrieve token
     */
    async retrieveTokenDoc360UserIdGetRaw(
        requestParameters: RetrieveTokenDoc360UserIdGetRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<Doc360TokenOutput>> {
        if (requestParameters['userId'] == null) {
            throw new runtime.RequiredError(
                'userId',
                'Required parameter "userId" was null or undefined when calling createClientClientsPost().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token('HTTPBearer', []);

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request(
            {
                path: `/users/{user_id}/doc360_token`.replace(
                    `{${'user_id'}}`,
                    encodeURIComponent(String(requestParameters['userId']))
                ),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides
        );

        return new runtime.JSONApiResponse(response, (jsonValue) =>
            Doc360TokenOutputFromJSON(jsonValue)
        );
    }

    /**
     * Retrieve Token
     */
    async retrieveTokenDoc360UserIdGet(
        requestParameters: RetrieveTokenDoc360UserIdGetRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<Doc360TokenOutput> {
        const response = await this.retrieveTokenDoc360UserIdGetRaw(
            requestParameters,
            initOverrides
        );
        return await response.value();
    }
}
