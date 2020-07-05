/**
 * Represents session user permissions across Scratch.
 */
export interface SessionPermissions {
    /**
     * Whether or not the user has Scratch admin permissions.
     * @type {boolean}
     */
    admin: boolean;

    /**
     * Whether or not the user has Scratch educator permissions.
     * @type {boolean}
     */
    educator: boolean;

    /**
     * @type {boolean}
     */
    educator_invitee: boolean;

    /**
     * Whether or not the user is a new Scratcher.
     * @type {boolean}
     */
    new_scratcher: boolean;

    /**
     * Whether or not the user has Scratcher permissions.
     * @type {boolean}
     */
    scratcher: boolean;

    /**
     * @type {boolean}
     */
    social: boolean;

    /**
     * Whether or not the user has student permissions.
     * @type {boolean}
     */
    student: boolean;
}