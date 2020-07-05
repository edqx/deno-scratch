import { ScratchClient } from "../Client.ts";

import { UserProfile } from "./UserProfile.ts"

import { BaseUser } from "./BaseUser.ts"

/**
 * Represents a user on Scratch.
 * @extends {BaseUser}
 */
export class User extends BaseUser {
    /**
     * When the user joined Scratch.
     * @type {number}
     */
    joined_timestamp: number;

    /**
     * The profile of the user.
     * @type {UserProfile}
     */
    profile: UserProfile;

    /**
     * Whether or not the user is a scratch team member.
     * @type {boolean}
     */
    scratchteam: boolean;

    /**
     * Instantiate a User object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        super(client, data);

        // (TODO) data.history.login
        this.joined_timestamp = new Date(data.history.joined).getTime();
        this.profile  = new UserProfile(client, this, data.profile);
        this.scratchteam = data.scratchteam;
    }

    /**
     * Get the user's followers.
     * @param {number} offset The offset to apply to the request.
     * @param {number} limit The limit of users to retrieve.
     * @returns {Promise<Array<User>>}
     */
    async getFollowers(offset: number = 0, limit: number = 20) : Promise<Array<User>> {
        const followers = await this._client.make("GET", "/users/" + this.username + "/followers", {
            query: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        });

        const json = await followers.json();

        return json.map((user: any) => new User(this._client, user));
    }

    /**
     * Get users that the user is following.
     * @param {number} offset The offset to apply to the request.
     * @param {number} limit The limit of users to retrieve.
     * @returns {Promise<Array<User>>}
     */
    async getFollowing(offset: number = 0, limit: number = 20) : Promise<Array<User>> {
        const following = await this._client.make("GET", "/users/" + this.username + "/following", {
            query: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        });

        const json = await following.json();

        return json.map((user: any) => new User(this._client, user));
    }
}