/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import { ResultSetDataQueryParamsToJSON } from '../../openapi/auto-generated';
import * as runtime from '../../openapi/auto-generated/runtime';

export class NewResultSetsApi extends runtime.BaseAPI {

    /**
     * Retrieve Result Value
     */
    async retrieveResultDataResultSetsResultSetIdValuePostRaw(requestParameters: RetrieveResultDataResultSetsResultSetIdDataPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{values?: any | null}>> {
        if (requestParameters['resultSetId'] == null) {
            throw new runtime.RequiredError(
                'resultSetId',
                'Required parameter "resultSetId" was null or undefined when calling retrieveResultDataResultSetsResultSetIdDataPost().'
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
            path: `/result_sets/{result_set_id}/values`.replace(`{${"result_set_id"}}`, encodeURIComponent(String(requestParameters['resultSetId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ResultSetDataQueryParamsToJSON(requestParameters['resultSetDataQueryParams']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue);
    }

    /**
     * Retrieve Result Value
     */
    async retrieveResultDataResultSetsResultSetIdValuePost(requestParameters: RetrieveResultDataResultSetsResultSetIdDataPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{values?: any | null}> {
        const response = await this.retrieveResultDataResultSetsResultSetIdValuePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}