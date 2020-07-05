/**
 * Represents session information for a client.
 */
export interface ClientAuthorisation {
    /**
     * The ID of the session.
     * @type {string}
     */
    session_id: string;

    /**
     * The Cross-Site request forgery token for the session.
     * @type {string}
     */
    csrf_token: string;
    
    /**
     * The authorisation token to make API requests.
     * @type {string}
     */
    token: string;

    /**
     * The ID of the authorised user.
     * @type {string}
     */
    user_id: string;

    /**
     * The username of the authorised user.
     * @type {string}
     */
    user_name: string;
}