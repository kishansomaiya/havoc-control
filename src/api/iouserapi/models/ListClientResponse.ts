/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

import { mapValues } from '../runtime';
import type { Client } from './Client';
import { ClientFromJSON, ClientToJSON } from './Client';

/**
 * 
 * @export
 * @interface ListClientResponse
 */
export interface ListClientResponse {
    /**
     * 
     * @type {Array<Client>}
     * @memberof ListClientResponse
     */
    clients: Array<Client>;
}

/**
 * Check if a given object implements the ListClientResponse interface.
 */
export function instanceOfListClientResponse(value: object): value is ListClientResponse {
    if (!('clients' in value) || value['clients'] === undefined) return false;
    return true;
}

export function ListClientResponseFromJSON(json: any): ListClientResponse {
    return ListClientResponseFromJSONTyped(json, false);
}

export function ListClientResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListClientResponse {
    if (json == null) {
        return json;
    }
    return {
        'clients': ((json['clients'] as Array<any>).map(ClientFromJSON)),
    };
}

export function ListClientResponseToJSON(value?: ListClientResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        'clients': ((value['clients'] as Array<any>).map(ClientToJSON)),
    };
}

