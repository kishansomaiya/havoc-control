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
 * @interface FileValidationMessageRowResponse
 */
export interface FileValidationMessageRowResponse {
    /**
     * 
     * @type {Array<FileValidationMessage>}
     * @memberof FileValidationMessageRowResponse
     */
    messages: Array<FileValidationMessage>;
    /**
     * 
     * @type {string}
     * @memberof FileValidationMessageRowResponse
     */
    rowIndex: number;
    /**
     * 
     * @type {FileValidationMessageStatus}
     * @memberof FileValidationMessageRowResponse
     */
    validationStatus: FileValidationMessageStatus;
}

export function FileValidationMessageRowResponseFromJSON(json: any): FileValidationMessageRowResponse {
    return FileValidationMessageRowResponseFromJSONTyped(json, false);
}

export function FileValidationMessageRowResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FileValidationMessageRowResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'messages': ((json['messages'] as Array<any>).map(FileValidationMessageFromJSON)),
        'rowIndex': json['row_index'],
        'validationStatus': FileValidationMessageStatusFromJSON(json['validation_status']),
    };
}
