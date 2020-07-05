/**
 * Represents remix nodes on a project.
 */
export interface ProjectRemixNode {
    /**
     * The parent project ID of the remix.
     * @type {number|null}
     */
    parent?: number|null;

    /**
     * The root remix project ID.
     * @type {number|null}
     */
    root?: number|null;
}