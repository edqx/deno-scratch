import { CookieObject } from "./CookieObject.ts"
import { QueryObject } from "./QueryObject.ts"

import { RequestHeaders } from "./RequestHeaders.ts"

/**
 * Represents options for a request to scratch servers.
 */
export interface RequestOptions {
    /**
     * The base URL of the request.
     * @type {string}
     */
    base?: string;

    /**
     * The query parameters for the request.
     * @type {QueryObject}
     */
    query?: QueryObject;

    /**
     * The client's cookie information for the request.
     * @type {CookieObject}
     */
    cookie?: CookieObject;
    
    /**
     * The headers for the request.
     * @type {RequestHeaders}
     */
    headers?: RequestHeaders;

    /**
     * The form data body of the request.
     * @type {boolean}
     */
    formdata?: boolean;

    /**
     * The JSON body of the request.
     * @type {object}
     */
    body?: object;
}