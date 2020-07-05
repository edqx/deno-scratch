import { QueryObject } from "../interfaces/QueryObject.ts"

/**
 * Stringify a query object for use in requests.
 * @param {QueryObject} query The query object to stringify.
 * @returns {string}
 */
export function stringifyQuery(query: QueryObject) : string {
    const out : Array<string> = [];
    
    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            for (let i: number = 0; i < value.length; i++) {
                out.push(encodeURIComponent(key + "[]") + "=" + encodeURIComponent(value[i]));
            }
        } else {
            out.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    });

    return out.join("&");
}