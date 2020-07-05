import { ScratchClient } from "../Client.ts";

import { BaseUser } from "./BaseUser.ts"

/**
 * Represents a comment author on Scratch.
 * @extends {BaseUser}
 */
export class CommentAuthor extends BaseUser {
    /**
     * The URL of the user's avatar.
     * @type {string}
     */
    avatar: string;

    /**
     * Whether or not the user is a scratch team member.
     * @type {boolean}
     */
    scratchteam: boolean;

    /**
     * Instantiate a comment author object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        super(client, data);

        this.avatar  = data.image;
        this.scratchteam = data.scratchteam;
    }
}