/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

/**
 *
 * @export
 * @interface FileValidationMessage
 */
export interface FileValidationMessage {
    /**
     *
     * @type {string}
     * @memberof FileValidationMessage
     */
    code: string;
    /**
     *
     * @type {string}
     * @memberof FileValidationMessage
     */
    type: string;
    /**
     *
     * @type {string}
     * @memberof FileValidationMessage
     */
    message: string;
}

export function FileValidationMessageFromJSON(
    json: any
): FileValidationMessage {
    return FileValidationMessageFromJSONTyped(json, false);
}

export function FileValidationMessageFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean
): FileValidationMessage {
    if (json == null) {
        return json;
    }
    return {
        code: json['code'],
        type: json['type'],
        message: json['message'],
    };
}
