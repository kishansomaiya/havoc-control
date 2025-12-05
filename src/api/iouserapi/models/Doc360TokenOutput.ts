/* tslint:disable */
/* eslint-disable */ // @ts-nocheck

/**
 *
 * @export
 * @interface Doc360TokenOutput
 */
export interface Doc360TokenOutput {
    /**
     *
     * @type {string}
     * @memberof Doc360TokenOutput
     */
    $schema: string;
    /**
     *
     * @type {string}
     * @memberof Doc360TokenOutput
     */
    token: string;
}

export function Doc360TokenOutputFromJSON(json: any): Doc360TokenOutput {
    return Doc360TokenOutputFromJSONTyped(json, false);
}

export function Doc360TokenOutputFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean
): Doc360TokenOutput {
    if (json == null) {
        return json;
    }
    return {
        $schema: json['$schema'],
        token: json['token'],
    };
}
