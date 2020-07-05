/**
 * Represents timestamps in a project's history.
 */
export interface ProjectHistory {
    /**
     * When the project was first created.
     * @type {number}
     */
    created_timestamp: number;

    /**
     * When the project was last modified.
     * @type {number}
     */
    modified_timestamp: number;

    /**
     * When the project was last shared.
     * @type {number}
     */
    shared_timestamp: number;
}