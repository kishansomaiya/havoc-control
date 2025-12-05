/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

/**
 * An enumeration.
 * @export
 */
export const FileValidationMessageStatus = {
    passed: 'passed',
    failed: 'failed',
} as const;
export type FileValidationMessageStatus = typeof FileValidationMessageStatus[keyof typeof FileValidationMessageStatus];

export function FileValidationMessageStatusFromJSON(json: any): FileValidationMessageStatus {
    return FileValidationMessageStatusFromJSONTyped(json, false);
}

export function FileValidationMessageStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): FileValidationMessageStatus {
    return json as FileValidationMessageStatus;
}
