import { SessionUser } from "../classes/SessionUser.ts"

import { SessionFlags } from "./SessionFlags.ts"
import { SessionPermissions } from "./SessionPermissions.ts"

/**
 * Represents session information for the client.
 */
export interface ClientSession {
    /**
     * The flags for the user's session.
     * @type {SessionFlags}
     */
    flags: SessionFlags;

    /**
     * Which permissions the user has across scratch.
     * @type {UserPermissions}
     */
    permissions: SessionPermissions;

    /**
     * Session user information.
     * @type {SessionUser}
     */
    user: SessionUser;
}