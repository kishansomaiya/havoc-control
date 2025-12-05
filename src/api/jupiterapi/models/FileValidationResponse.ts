/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import type {
    CreatedAt,
    FileValidationStatus,
    UpdatedAt,
    ValidationErrorDetails,
} from '../../openapi/auto-generated';
import {
    CreatedAtToJSON,
    FileValidationStatusFromJSON,
    FileValidationStatusToJSON,
    UpdatedAtToJSON,
} from '../../openapi/auto-generated';
import type { FileValidationMessage } from './FileValidationMessage';
import { FileValidationMessageFromJSON } from './FileValidationMessage';

/**
 * 
 * @export
 * @interface FileValidationResponse
 */
export interface FileValidationResponse {
    /**
     * 
     * @type {string}
     * @memberof FileValidationResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof FileValidationResponse
     */
    file: string;
    /**
     * 
     * @type {FileValidationStatus}
     * @memberof FileValidationResponse
     */
    status: FileValidationStatus;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    failedCount?: number;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    warningCount?: number;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    succeededCount?: number;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    totalCount?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof FileValidationResponse
     */
    customColumns?: Array<string>;
    /**
     * 
     * @type {Array<ValidationErrorDetails>}
     * @memberof FileValidationResponse
     */
    errors?: Array<ValidationErrorDetails>;
    /**
     * 
     * @type {CreatedAt}
     * @memberof FileValidationResponse
     */
    createdAt: CreatedAt;
    /**
     * 
     * @type {UpdatedAt}
     * @memberof FileValidationResponse
     */
    updatedAt: UpdatedAt;
    /**
     * 
     * @type {string}
     * @memberof FileValidationResponse
     */
    createdBy: string;
    /**
     * 
     * @type {string}
     * @memberof FileValidationResponse
     */
    updatedBy: string;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    rowMessageCount?: number;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    locationMessageCount?: number;
    /**
     * 
     * @type {number}
     * @memberof FileValidationResponse
     */
    fileMessages?: Array<FileValidationMessage>;
}

/**
 * Check if a given object implements the FileValidationResponse interface.
 */
export function instanceOfFileValidationResponse(value: object): value is FileValidationResponse {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('file' in value) || value['file'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('createdBy' in value) || value['createdBy'] === undefined) return false;
    if (!('updatedBy' in value) || value['updatedBy'] === undefined) return false;
    return true;
}

export function FileValidationResponseFromJSON(json: any): FileValidationResponse {
    return FileValidationResponseFromJSONTyped(json, false);
}

export function FileValidationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FileValidationResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'file': json['file'],
        'status': FileValidationStatusFromJSON(json['status']),
        'failedCount': json['failed_count'] == null ? undefined : json['failed_count'],
        'warningCount': json['warning_count'] == null ? undefined : json['warning_count'],
        'succeededCount': json['succeeded_count'] == null ? undefined : json['succeeded_count'],
        'totalCount': json['total_count'] == null ? undefined : json['total_count'],
        'customColumns': json['custom_columns'] == null ? undefined : json['custom_columns'],
        'errors': [],
        'createdAt': isNaN(json['created_at']) ? (new Date(json['created_at'])) : (new Date(1000 * json['created_at'])),
        'updatedAt': isNaN(json['updated_at']) ? (new Date(json['updated_at'])) : (new Date(1000 * json['updated_at'])),
        'createdBy': json['created_by'],
        'updatedBy': json['updated_by'],
        'rowMessageCount': json['row_message_count'] == null ? undefined : json['row_message_count'],
        'locationMessageCount': json['location_message_count'] == null ? undefined : json['location_message_count'],
        'fileMessages': json['file_messages'] == null ? undefined : ((json['file_messages'] as Array<any>).map(FileValidationMessageFromJSON)),
    };
}

export function FileValidationResponseToJSON(value?: FileValidationResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'file': value['file'],
        'status': FileValidationStatusToJSON(value['status']),
        'failed_count': value['failedCount'],
        'warning_count': value['warningCount'],
        'succeeded_count': value['succeededCount'],
        'total_count': value['totalCount'],
        'custom_columns': value['customColumns'],
        'errors': [],
        'created_at': CreatedAtToJSON(value['createdAt']),
        'updated_at': UpdatedAtToJSON(value['updatedAt']),
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
        'row_message_count': json['rowMessageCount'],
        'location_message_count': json['locationMessageCount'],
        'file_messages': json['fileMessages'],
    };
}

