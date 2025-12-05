/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import { mapValues } from '../../openapi/auto-generated/runtime';
import type { Client } from './Client';
import { ClientFromJSON, ClientToJSON } from './Client';

/**
 * 
 * @export
 * @interface ClientResponse
 */
export interface ClientResponse {
    /**
     * 
     * @type {string}
     * @memberof ClientResponse
     */
    client: Client;
}

/**
 * Check if a given object implements the ClientResponse interface.
 */
export function instanceOfClientResponse(value: object): value is ClientResponse {
    if (!('client' in value) || value['client'] === undefined) return false;
    return true;
}

export function ClientResponseFromJSON(json: any): ClientResponse {
    return ClientResponseFromJSONTyped(json, false);
}

export function ClientResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClientResponse {
    if (json == null) {
        return json;
    }
    return {
        'client': ClientFromJSON(json['client']),
    };
}

export function ClientResponseToJSON(value?: ClientResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        'client': ClientToJSON(value['client']),
    };
}

