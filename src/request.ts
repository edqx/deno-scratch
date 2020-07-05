import { RequestOptions } from "./interfaces/RequestOptions.ts"
import { stringifyQuery } from "./utils/stringifyQuery.ts"
import { stringifyCookie } from "./utils/stringifyCookie.ts"

/**
 * Convert a standard JavaScript object to a FormData object for requests.
 * @param {any} obj The object to convert.
 */
function convertToFormData(obj: any) {
    const formdata = new FormData;

    for (let key in obj) {
        formdata.append(key, obj[key]);
    }

    return formdata;
}

/**
 * Make a HTTPs request to scratch API servers.
 * @param {String} method The method to use for the request.
 * @param {String} path The path to append onto the base URL.
 * @param {String} options The options for the request.
 * @returns {Promise<Response>}
 */
export async function make(method: string, path: string, options: RequestOptions = {}) : Promise<Response> {
    const base = "https://" + (options.base ?? "api.scratch.mit.edu");

    const url = base + path + (options.query !== undefined ? "?" + stringifyQuery(options.query) : "");

    if (!options.headers) {
        options.headers = {};
    }

    var body: FormData|string = options.formdata ? convertToFormData(options.body ?? {}) : JSON.stringify(options.body ?? {});

    if (options.body && !options.formdata) {
        options.headers["Content-Type"] = "application/json";
    }

    const request: Request = new Request(url, {
        method: method,
        credentials: "include",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "cookie": stringifyCookie(options.cookie ?? {}),
            "referer": "https://scratch.mit.edu",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
            
            ...options.headers
        },
        body: body
    });
    
    return await fetch(request);
}