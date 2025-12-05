/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import { mapValues } from '../../openapi/auto-generated/runtime';
/**
 * 
 * @export
 * @interface Client
 */
export interface Client {
    /**
     * 
     * @type {string}
     * @memberof Client
     */
    clientId: string;
    /**
     * 
     * @type {string}
     * @memberof Client
     */
    clientSecret: string;
}

/**
 * Check if a given object implements the Client interface.
 */
export function instanceOfClient(value: object): value is Client {
    if (!('clientId' in value) || value['clientId'] === undefined) return false;
    if (!('clientSecret' in value) || value['clientSecret'] === undefined) return false;
    return true;
}

export function ClientFromJSON(json: any): Client {
    return ClientFromJSONTyped(json, false);
}

export function ClientFromJSONTyped(json: any, ignoreDiscriminator: boolean): Client {
    if (json == null) {
        return json;
    }
    return {
        'clientId': json['client_id'],
        'clientSecret': json['client_secret'],
    };
}

export function ClientToJSON(value?: Client | null): any {
    if (value == null) {
        return value;
    }
    return {
        'client_id': value['clientId'],
        'client_secret': value['clientSecret'],
    };
}
