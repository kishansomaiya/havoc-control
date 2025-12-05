/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import type { FileValidationMessageStatus } from './FileValidationMessageStatus';
import {
    FileValidationMessageStatusFromJSON,
} from './FileValidationMessageStatus';
import type { FileValidationMessage } from './FileValidationMessage';
import { FileValidationMessageFromJSON } from './FileValidationMessage';

/**
 * 
 * @export
 * @interface FileValidationMessageLocationResponse
 */
export interface FileValidationMessageLocationResponse {
    /**
     * 
     * @type {Array<FileValidationMessage>}
     * @memberof FileValidationMessageLocationResponse
     */
    messages: Array<FileValidationMessage>;
    /**
     * 
     * @type {string}
     * @memberof FileValidationMessageLocationResponse
     */
    customerLocationId: number;
    /**
     * 
     * @type {FileValidationMessageStatus}
     * @memberof FileValidationMessageLocationResponse
     */
    validationStatus: FileValidationMessageStatus;
}

export function FileValidationMessageLocationResponseFromJSON(json: any): FileValidationMessageLocationResponse {
    return FileValidationMessageLocationResponseFromJSONTyped(json, false);
}

export function FileValidationMessageLocationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FileValidationMessageLocationResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'messages': ((json['messages'] as Array<any>).map(FileValidationMessageFromJSON)),
        'customerLocationId': json['customer_location_id'],
        'validationStatus': FileValidationMessageStatusFromJSON(json['validation_status']),
    };
}
