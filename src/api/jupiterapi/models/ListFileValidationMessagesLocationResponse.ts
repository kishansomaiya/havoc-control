/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import type { FileValidationMessageLocationResponse } from './FileValidationMessageLocationResponse';
import {
    FileValidationMessageLocationResponseFromJSON
} from './FileValidationMessageLocationResponse';

/**
 * 
 * @export
 * @interface ListFileValidationMessagesLocationResponse
 */
export interface ListFileValidationMessagesLocationResponse {
    /**
     * 
     * @type {boolean}
     * @memberof ListFileValidationMessagesLocationResponse
     */
    hasMore: boolean;
    /**
     * 
     * @type {Array<FileValidationMessageLocationResponse>}
     * @memberof ListFileValidationMessagesLocationResponse
     */
    data: Array<FileValidationMessageLocationResponse>;
}

export function ListFileValidationMessagesLocationResponseFromJSON(json: any): ListFileValidationMessagesLocationResponse {
    return ListFileValidationMessagesLocationResponseFromJSONTyped(json, false);
}

export function ListFileValidationMessagesLocationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListFileValidationMessagesLocationResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'hasMore': json['has_more'],
        'data': ((json['data'] as Array<any>).map(FileValidationMessageLocationResponseFromJSON)),
    };
}
