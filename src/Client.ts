import { assert } from "https://deno.land/std@0.53.0/testing/asserts.ts"

import * as request from "./request.ts"

import { parseCookie } from "./utils/parseCookie.ts"

import { ClientOptions } from "./interfaces/ClientOptions.ts"
import { RequestOptions } from "./interfaces/RequestOptions.ts"

import { ClientAuthorisation } from "./interfaces/ClientAuthorisation.ts"
import { ClientSession } from "./interfaces/ClientSession.ts"

import { News } from "./classes/News.ts"
import { Project } from "./classes/Project.ts"
import { SessionUser } from "./classes/SessionUser.ts"
import { User } from "./classes/User.ts"

import { CloudSession } from "./CloudSession.ts"

type Class = { new(): CloudSession; };

/**
 * Represents a Client to connect to scratch servers.
 */
export class ScratchClient {
    /**
     * The options for initialisation.
     * @type {ClientOptions}
     * @private
     */
    private _options: ClientOptions;

    /**
     * Authorisation information for authorised requests.
     * @type {ClientAuthorisation}
     * @privvate
     */
    private _authorisation?: ClientAuthorisation;

    /**
     * Session information for the client.
     * @type {ClientSession}
     */
    session?: ClientSession;

    /**
     * A cloud session constructor.
     * @type {Function}
     */
    CloudSession: Class;

    /**
     * Initialise a ScratchClient object.
     * @param {ClientOptions} options The options for initialisation.
     */
    constructor(options: ClientOptions = {}) {
        this._options = options;

        const _this = this;

        this.CloudSession = class extends CloudSession {
            constructor() {
                super(_this);
            }
        }
    }

    /**
     * Get the private authorisation object.
     * @returns {ClientAuthorisation|undefined}
     */
    getAuthorisation() : ClientAuthorisation|undefined {
        return this._authorisation;
    }
    
    /**
     * Make an authorised HTTPs request to scratch API servers.
     * @param {string} method The method to use for the request.
     * @param {string} path The path to append onto the base URL.
     * @param {string} options The options for the request.
     * @returns {Promise<Response>}
     */
    async make(method: string, path: string, options: RequestOptions = {}) : Promise<Response> {
        if (!options.cookie) {
            options.cookie = {};
        }

        if (!options.headers) {
            options.headers = {};
        }

        if (this._authorisation) {
            if (this._authorisation.csrf_token) {
                options.cookie.scratchcsrftoken = this._authorisation.csrf_token;
                options.headers["x-csrftoken"] = this._authorisation.csrf_token;
            }

            if (this._authorisation.session_id) {
                options.cookie.scratchsessionsid = this._authorisation.session_id;
            }

            if (this._authorisation.token) {
                options.headers["x-token"] = this._authorisation.token;
            }
        }

        if (this.session) {
            options.cookie.permissions = JSON.stringify(this.session.permissions);
        } else {
            options.cookie.permissions = "{}";
        }

        return request.make(method, path, options);
    }

    /**
     * Get a Cross-Site Request Forgery token from Scratch.
     * @returns {Promise<string>}
     * @private
     */
    private async fetchCSRF() : Promise<string> {
        const csrftkn = await request.make("GET", "/csrf_token", {
            base: "scratch.mit.edu",
            cookie: {
                permissions: "{}",
            }
        });

        const cookie_header = csrftkn.headers.get("set-cookie");

        return parseCookie(cookie_header).scratchcsrftoken;
    }

    /**
     * Get session information for the client.
     * @returns {Promise<ClientSession>}
     * @private
     */
    private async fetchSession() : Promise<ClientSession> {
        const session = await this.make("GET", "/session", {
            cookie: {
                permissions: "{}",
            },
            base: "scratch.mit.edu",
        });
        
        const json = await session.json();

        return {
            flags: json.flags,
            permissions: json.permissions,
            user: new SessionUser(this, json.user)
        } as ClientSession;
    }

    /**
     * Log in to a Scratch user account and make authorised requests.
     * @param {String} username The username of the user to log in to.
     * @param {String} password The password of the user to log in to.
     * @returns {Promise<Boolean>}
     */
    async login(username: string, password: string) : Promise<boolean> {
        // Get Cross-Site Request Forgery token.
        const csrf_token = await this.fetchCSRF();

        if (!csrf_token) {
            throw new Error("Failed to create a CSRF token");
        }

        // Get an authorised request token with credentials provided.
        const login = await request.make("POST", "/accounts/login", {
            base: "scratch.mit.edu",
            body: {
                useMessages: true,
                username,
                password
            },
            cookie: {
                permissions: "{}",
                scratchcsrftoken: csrf_token
            },
            headers: {
                "x-csrftoken": csrf_token
            }
        });

        const json = (await login.json())[0];

        if (!json.success) {
            throw new Error("Could not login. Reason: " + json.msg);
        }

        const session_id = parseCookie(login.headers.get("set-cookie")).scratchsessionsid;

        this._authorisation = {
            session_id,
            csrf_token,
            token: json.token,
            user_id: json.id,
            user_name: json.username
        }

        this.session = await this.fetchSession();

        return true;
    }

    /**
     * Get Scratch news articles.
     * @param {number} limit The limit of news articles to retrieve.
     * @returns {Promise<Array<News>>}
     */
    async getNews(limit: number = 3) : Promise<Array<News>> {
        const news = await this.make("GET", "/news", {
            query: {
                limit: limit.toString()
            }
        });

        const json = await news.json();

        return json.map((news: any) => new News(this, news));
    }

    /**
     * Get a User on scratch by their username.
     * @param {string} username The username of the user to retrieve.
     * @returns {Promise<User>}
     */
    async getUser(username?: string) : Promise<User> {
        if (!username) {
            if (this.session) {
                return this.getUser(this.session.user.username);
            } else {
                throw new Error("No user provided");
            }
        }

        const user = await this.make("GET", "/users/" + username);
        const json = await user.json();

        return new User(this, json);
    }

    /**
     * Get a project on Scratch by it's ID.
     * @param {number} id The ID of the project to retrieve.
     * @returns {Promise<Project>}
     */
    async getProject(id: number) : Promise<Project> {
        const project = await this.make("GET", "/projects/" + id);
        const json = await project.json();

        return new Project(this, json);
    }

    /**
     * Create a cloud session.
     * @returns {CloudSession}
     */
    createCloudSession() {
        return new CloudSession(this);
    }
}