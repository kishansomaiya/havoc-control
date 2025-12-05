/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import * as runtime from '../../openapi/auto-generated/runtime';
import type {
  ClientResponse,
  ListClientResponse,
} from '../models/index';
import { ClientResponseFromJSON, ListClientResponseFromJSON } from '../models/index';

export interface CreateClientClientsPostRequest {
    userId: string;
}

export interface DeleteClientClientsClientIdDeleteRequest {
    userId: string;
    clientId: string;
}

export interface ListClientClientsGetRequest {
    userId: string;
}

/**
 * 
 */
export class ClientsApi extends runtime.BaseAPI {

    /**
     * Create Client
     */
    async createClientClientsPostRaw(requestParameters: CreateClientClientsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClientResponse>> {
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
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/users/{user_id}/clients`.replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters['userId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClientResponseFromJSON(jsonValue));
    }

    /**
     * Create Client
     */
    async createClientClientsPost(requestParameters: CreateClientClientsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClientResponse> {
        const response = await this.createClientClientsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete Client
     */
    async deleteClientClientsClientIdDeleteRaw(requestParameters: DeleteClientClientsClientIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['userId'] == null) {
            throw new runtime.RequiredError(
                'userId',
                'Required parameter "userId" was null or undefined when calling deleteClientClientsClientIdDelete().'
            );
        }
        if (requestParameters['clientId'] == null) {
            throw new runtime.RequiredError(
                'clientId',
                'Required parameter "clientId" was null or undefined when calling deleteClientClientsClientIdDelete().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/users/{user_id}/clients/{client_id}`.replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters['userId']))).replace(`{${"client_id"}}`, encodeURIComponent(String(requestParameters['clientId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete Client
     */
    async deleteClientClientsClientIdDelete(requestParameters: DeleteClientClientsClientIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteClientClientsClientIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * List Clients
     */
    async listClientClientsGetRaw(requestParameters: ListClientClientsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListClientResponse>> {
        if (requestParameters['userId'] == null) {
            throw new runtime.RequiredError(
                'userId',
                'Required parameter "userId" was null or undefined when calling listClientClientsGet().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/users/{user_id}/clients`.replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters['userId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListClientResponseFromJSON(jsonValue));
    }

    /**
     * List Clients
     */
    async listClientClientsGet(requestParameters: ListClientClientsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListClientResponse> {
        const response = await this.listClientClientsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
