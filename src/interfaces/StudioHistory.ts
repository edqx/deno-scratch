/**
 * Represents timestamps in a studio's history.
 */
export interface StudioHistory {
    /**
     * When the studio was first created.
     * @type {number}
     */
    created_timestamp: number;

    /**
     * When the studio was last modified.
     * @type {number}
     */
    modified_timestamp: number;
}