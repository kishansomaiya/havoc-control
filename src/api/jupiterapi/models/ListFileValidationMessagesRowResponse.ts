/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import type { FileValidationMessageRowResponse } from './FileValidationMessageRowResponse';
import {
    FileValidationMessageRowResponseFromJSON
} from './FileValidationMessageRowResponse';

/**
 * 
 * @export
 * @interface ListFileValidationMessagesRowResponse
 */
export interface ListFileValidationMessagesRowResponse {
    /**
     * 
     * @type {boolean}
     * @memberof ListFileValidationMessagesRowResponse
     */
    hasMore: boolean;
    /**
     * 
     * @type {Array<FileValidationMessageRowResponse>}
     * @memberof ListFileValidationMessagesRowResponse
     */
    data: Array<FileValidationMessageRowResponse>;
}

export function ListFileValidationMessagesRowResponseFromJSON(json: any): ListFileValidationMessagesRowResponse {
    return ListFileValidationMessagesRowResponseFromJSONTyped(json, false);
}

export function ListFileValidationMessagesRowResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListFileValidationMessagesRowResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'hasMore': json['has_more'],
        'data': ((json['data'] as Array<any>).map(FileValidationMessageRowResponseFromJSON)),
    };
}
