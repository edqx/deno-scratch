/**
 * Represents query parameters for a request.
 */
export interface QueryObject {
    /**
     * A key-value pair.
     */
    [key: string]: string|Array<string>;
}
