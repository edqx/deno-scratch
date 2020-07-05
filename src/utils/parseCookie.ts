import { CookieObject } from "../interfaces/CookieObject.ts"

/**
 * Parse a cookie string.
 * @param {string} cookie The cookie string to parse.
 * @returns {CookieObject}
 * @author Andres Pirela#8281
 */
export function parseCookie(cookie: string|null): CookieObject {
    if (cookie != null) {
        const out: CookieObject = {};
        const c = cookie.split(/;|,/);

        for (const kv of c) {
            const [cookieKey, ...cookieVal] = kv.split("=");
            const key = cookieKey.trim();
            out[key] = cookieVal.join("=");
        }

        return out;
    }

    return {};
}