/* tslint:disable */
/* eslint-disable */ // @ts-nocheck


import * as runtime from '../../openapi/auto-generated/runtime';
import type {
    ListFileValidationMessagesLocationResponse,
} from '../models/index';
import {
    ListFileValidationMessagesLocationResponseFromJSON,
} from '../models/index';
import type {
    ListFileValidationMessagesRowResponse,
} from '../models/index';
import {
    ListFileValidationMessagesRowResponseFromJSON,
} from '../models/index';

export interface ListFileValidationFileValidationIdMessagesLocationGetRequest {
    fileValidationId: string;
    limit?: number;
    startingAfter?: string;
}

export interface ListFileValidationFileValidationIdMessagesRowGetRequest {
    fileValidationId: string;
    limit?: number;
    startingAfter?: string;
}

/**
 * 
 */
export class FileValidationMessagesApi extends runtime.BaseAPI {

    /**
     * List File Validations Location Messages
     */
    async listFileValidationFileValidationIdMessagesLocationGetRaw(requestParameters: ListFileValidationFileValidationIdMessagesLocationGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListFileValidationMessagesLocationResponse>> {
        if (requestParameters['fileValidationId'] == null) {
            throw new runtime.RequiredError(
                'fileValidationId',
                'Required parameter "fileValidationId" was null or undefined when calling listFileValidationFileValidationIdMessagesLocationGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['startingAfter'] != null) {
            queryParameters['starting_after'] = requestParameters['startingAfter'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/file_validations/{file_validation_id}/messages/location`.replace(`{${"file_validation_id"}}`, encodeURIComponent(String(requestParameters['fileValidationId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListFileValidationMessagesLocationResponseFromJSON(jsonValue));
    }

    /**
     * List File Validations Location Messages
     */
    async listFileValidationFileValidationIdMessagesLocationGet(requestParameters: ListFileValidationFileValidationIdMessagesLocationGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListFileValidationMessagesLocationResponse> {
        const response = await this.listFileValidationFileValidationIdMessagesLocationGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List File Validations Row Messages
     */
    async listFileValidationFileValidationIdMessagesRowGetRaw(requestParameters: ListFileValidationFileValidationIdMessagesRowGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListFileValidationMessagesRowResponse>> {
        if (requestParameters['fileValidationId'] == null) {
            throw new runtime.RequiredError(
                'fileValidationId',
                'Required parameter "fileValidationId" was null or undefined when calling listFileValidationFileValidationIdMessagesRowGet().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['startingAfter'] != null) {
            queryParameters['starting_after'] = requestParameters['startingAfter'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("HTTPBearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/file_validations/{file_validation_id}/messages/row`.replace(`{${"file_validation_id"}}`, encodeURIComponent(String(requestParameters['fileValidationId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListFileValidationMessagesRowResponseFromJSON(jsonValue));
    }

    /**
     * List File Validations Row Messages
     */
    async listFileValidationFileValidationIdMessagesRowGet(requestParameters: ListFileValidationFileValidationIdMessagesRowGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListFileValidationMessagesRowResponse> {
        const response = await this.listFileValidationFileValidationIdMessagesRowGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
