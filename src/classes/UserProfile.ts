import { ScratchClient } from "../Client.ts";
import { User } from "./User.ts"

import { ProfilePictureSizes } from "../interfaces/ProfilePictureSizes.ts"

/**
 * Represents a user's profile on Scratch.
 */
export class UserProfile {
    /**
     * The client that instantiated this object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;
    
    /**
     * The user of the user profile.
     * @type {User}
     * @protected
     */
    protected _user: User;

    /**
     * The "about me" section of the user's profile.
     * @type {string}
     */
    bio: string;

    /**
     * The country of the user.
     * @type {string}
     */
    country: string;

    /**
     * The ID of the user's profile.
     * @type {number}
     */
    id: number;
    
    /**
     * The user's avatar images in different sizes.
     * @type {ProfilePictureSizes}
     */
    avatars: ProfilePictureSizes;

    /**
     * The "What I'm working on" section of the user's profile.
     * @type {string}
     */
    status: string;

    /**
     * Instantiate a UserProfile object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, user: User, data: any) {
        this._client = client;
        this._user = user;

        this.bio = data.bio;
        this.country = data.country;
        this.id = data.id;
        this.avatars = data.images as ProfilePictureSizes;
        this.status = data.status;
    }

    /**
     * Toggle comments on the user profile. Old v2.0 API code, Scratch devs are slow.
     * @param {boolean} comments_allowed Whether or not comments should allowed on the user's profile.
     * @returns {Promise<void>}
     */
    async setCommentsAllowed(comments_allowed: boolean) : Promise<void> {
        if (this._client.session) {
            if (this._client.session.user.username === this._user.username) {
                const commenting = await this._client.make("PUT", 
                    "/site-api/comments/users/all" + this._user.username, {
                        base: "scratch.mit.edu",
                        body: {
                            comments_allowed: comments_allowed
                        }
                    });
            } else {
                throw new Error("Invalid permissions.");
            }
        } else {
            throw new Error("Invalid permissions.");
        }
    }

    /**
     * Toggle comments on the user profile. Old v2.0 API code, Scratch devs are slow.
     * @returns {Promise<void>}
     */
    async toggleComments() : Promise<void> {
        if (this._client.session) {
            if (this._client.session.user.username === this._user.username) {
                const commenting = await this._client.make("POST", 
                    "/site-api/comments/user/" + this._user.username + "/toggle-comments", {
                        base: "scratch.mit.edu"
                    });
            } else {
                throw new Error("Invalid permissions.");
            }
        } else {
            throw new Error("Invalid permissions.");
        }
    }

    /**
     * Post a comment on the user profile.
     * @param {string} content The content of the comment.
     * @param {string} parent_id The id of the comment to reply to.
     * @returns {Promise<void>}
     */
    async postComment(content: string, parent_id?: number) : Promise<void>  {
        const comment = await this._client.make("POST", 
            "/site-api/comments/user/" + this._user.username + "/add", {
                base: "scratch.mit.edu",
                body: {
                    content: content,
                    parent_id: parent_id ?? "",
                    commentee_id: ""
                },
                headers: {
                    "referer": "https://scratch.mit.edu/users/" + this._user.username
                }
            });

        const text = await comment.text();
    }

    /**
     * Set the bio or "About me" section of the user's profile.
     * @param {string} content The content of the bio.
     * @returns {Promise<void>}
     */
    async setBio(content: string) : Promise<void> {
        const update = await this._client.make("PUT", "/site-api/users/all/" + this._user.username, {
            base: "scratch.mit.edu",
            body: {
                bio: content
            }
        });
    }

    /**
     * Set the status or "What I'm working on" section of the user's profile.
     * @param {string} content The content of the status.
     * @returns {Promise<void>}
     */
    async setStatus(content: string) : Promise<void> {
        const update = await this._client.make("PUT", "/site-api/users/all/" + this._user.username, {
            base: "scratch.mit.edu",
            body: {
                status: content
            }
        });
    }
}