import { CookieObject } from "../interfaces/CookieObject.ts"

/**
 * Stringify a query object for use in requests.
 * @param {CookieObject} cookie The Cookie object to stringify.
 * @returns {string}
 */
export function stringifyCookie(cookie: CookieObject) : string {
    const out : Array<string> = [];
    
    Object.entries(cookie).forEach(([key, value]) => {
        if (value[0] === "\"") {
            out.push(encodeURIComponent(key) + "=" + value);
        } else {
            out.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    });

    return out.join("; ");
}