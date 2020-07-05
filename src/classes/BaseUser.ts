import { ScratchClient } from "../Client.ts";

import { Project } from "./Project.ts"

import { User } from "./User.ts"

/**
 * Represents a User's id and username on Scratch.
 */
export class BaseUser {
    /**
     * The client that instantiated the object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;

    /**
     * The ID of the user.
     * @type {number}
     */
    id: number;

    /**
     * The username of the user.
     * @type {string}
     */
    username: string;

    /**
     * Instantiate a BaseUser object.
     * @param client The client that is instantiating this object.
     * @param data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        this._client = client;

        this.id = data.id;
        this.username = data.username;
    }

    /**
     * Get the user's public information and profile.
     * @returns {Promise<User>}
     */
    getUser() : Promise<User> {
        return this._client.getUser(this.username);
    }

    /**
     * Get the amount of message that the user has.
     * @returns {Promise<number>}
     */
    async messageCount() : Promise<number> {
        const count = await this._client.make("GET", "/users/" + this.username + "/messages/count");
        const json = await count.json();

        return json.count;
    }

    /**
     * Follow the user on behalf of the client user. Old Site 2.0 API.
     * @returns {Promise<void>}
     */
    async follow() : Promise<void> {
        if (this._client.session) {
            const follow = await this._client.make("PUT", "/site-api/users/followers/" + this.username + "/add", {
                base: "scratch.mit.edu",
                query: {
                    usernames: this._client.session.user.username
                }
            });
        }
    }

    /**
     * Unfollow the user on behalf of the client user. Old Site 2.0 API.
     * @returns {Promise<void>}
     */
    async unfollow() : Promise<void> {
        if (this._client.session) {
            const unfollow = await this._client.make("PUT", "/site-api/users/followers/" + this.username + "/remove", {
                base: "scratch.mit.edu",
                query: {
                    usernames: this._client.session.user.username
                }
            });
        }
    }

    /**
     * Get projects made by the user.
     * @returns {Promise<Array<Project>>}
     */
    async getProjects() : Promise<Array<Project>> {
        const projects = await this._client.make("GET", "/users/" + this.username + "/projects");

        const json = await projects.json();

        return json.map((project: any) => new Project(this._client, project));
    }

    /**
     * Get a specific project made by the user.
     * @param {number} id The ID of the project to retrieve.
     * @returns {Promise<Project>>}
     */
    async getProject(id: number) : Promise<Project> {
        const projects = await this._client.make("GET", "/users/" + this.username + "/projects/" + id);

        const json = await projects.json();

        return json.map(new Project(this._client, json));
    }
}