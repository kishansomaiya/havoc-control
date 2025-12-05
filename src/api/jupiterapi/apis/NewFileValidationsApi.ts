/* tslint:disable */
/* eslint-disable */ // @ts-nocheck


import * as runtime from '../../openapi/auto-generated/runtime';
import type { FileValidationResponse } from '../models/index';
import { FileValidationResponseFromJSON } from '../models/index';
import type { FileValidationInput } from '../../openapi/auto-generated';
import { FileValidationInputToJSON } from '../../openapi/auto-generated';

export interface CreateFileValidationFileValidationsPostRequest {
    fileValidationInput: FileValidationInput;
}

export interface RetrieveFileValidationFileValidationsFileValidationIdGetRequest {
    fileValidationId: string;
}

/**
 * 
 */
export class NewFileValidationsApi extends runtime.BaseAPI {

    /**
     * Create File Validation
     */
    async createFileValidationFileValidationsPostRaw(requestParameters: CreateFileValidationFileValidationsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FileValidationResponse>> {
        if (requestParameters['fileValidationInput'] == null) {
            throw new runtime.RequiredError(
                'fileValidationInput',
                'Required parameter "fileValidationInput" was null or undefined when calling createFileValidationFileValidationsPost().'
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
            path: `/file_validations`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FileValidationInputToJSON(requestParameters['fileValidationInput']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FileValidationResponseFromJSON(jsonValue));
    }

    /**
     * Create File Validation
     */
    async createFileValidationFileValidationsPost(requestParameters: CreateFileValidationFileValidationsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FileValidationResponse> {
        const response = await this.createFileValidationFileValidationsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve File Validation
     */
    async retrieveFileValidationFileValidationsFileValidationIdGetRaw(requestParameters: RetrieveFileValidationFileValidationsFileValidationIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FileValidationResponse>> {
        if (requestParameters['fileValidationId'] == null) {
            throw new runtime.RequiredError(
                'fileValidationId',
                'Required parameter "fileValidationId" was null or undefined when calling retrieveFileValidationFileValidationsFileValidationIdGet().'
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
            path: `/file_validations/{file_validation_id}`.replace(`{${"file_validation_id"}}`, encodeURIComponent(String(requestParameters['fileValidationId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FileValidationResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve File Validation
     */
    async retrieveFileValidationFileValidationsFileValidationIdGet(requestParameters: RetrieveFileValidationFileValidationsFileValidationIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FileValidationResponse> {
        const response = await this.retrieveFileValidationFileValidationsFileValidationIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
