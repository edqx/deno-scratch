import { ScratchClient } from "../Client.ts";

import { BaseUser } from "./BaseUser.ts"
import { User } from "./User.ts"

/**
 * Represents a user class from the session endpoint.
 */
export class SessionUser extends BaseUser {
    /**
     * Whether or not the user is banned.
     * @type {boolean}
     */
    banned: boolean;

    /**
     * The email of the user.
     * @type {string}
     */
    email: string;
    
    /**
     * When the user joined Scratch.
     * @type {number}
     */
    joined_timestamp: number;

    /**
     * The URL of the user's profile picture.
     * @type {string}
     */
    thumbnail_url: string;

    /**
     * The access token for the user.
     * @type {string}
     */
    token: string;

    /**
     * Instantiate a SessionUser object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        super(client, data);

        this.banned = data.banned;
        this.email = data.email;
        this.joined_timestamp = new Date(data.dateJoined).getTime();
        this.thumbnail_url = data.thumbnailUrl;
        this.token = data.token;
    }

    /**
     * Set the location of the user.
     * @param {string} country The location of the user.
     * @returns {Promise<void>}
     */
    async setCountry(country: string) : Promise<void> {
        const settings = await this._client.make("POST", "/accounts/settings", {
            base: "scratch.mit.edu",
            body: {
                csrfmiddlewaretoken: this._client.getAuthorisation()?.csrf_token,
                country: country
            },
            formdata: true
        });
    }

    /**
     * Delete the user. You have 2 days to sign back in before it is properly deleted.
     * @param {string} password Your re-entered password.
     * @param {boolean} projects Whether or not to delete projects as well.
     * @returns {Promise<void>}
     */
    async deleteUser(password: string, projects: boolean) : Promise<void> {
        const del = await this._client.make("POST", "/accounts/settings/delete_account", {
            base: "scratch.mit.edu",
            body: {
                csrfmiddlewaretoken: this._client.getAuthorisation()?.csrf_token,
                password,
                delete_state: projects ? "delbyusrwproj" : "delbyusr"
            },
            formdata: true
        });

        const json = await del.json();

        console.log(json);

        if (!json.success) {
            throw new Error("Could not delete user.");
        }
    }

    /**
     * Request to reset your password.
     * @returns {Promise<void>}
     */
    async requestPasswordReset() {
        const reset = await this._client.make("POST", "/accounts/password_reset/", {
            base: "scratch.mit.edu",
            body: {
                username: this.username,
                email: this.email,
                csrfmiddlewaretoken: this._client.getAuthorisation()?.csrf_token
            },
            formdata: true
        });

        await fetch("https://scratch.mit.edu/accounts/password_reset/MjUzNjAyODE/5hx-f87966ae5e857f21b45c/", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1"
            },
            "referrer": "https://scratch.mit.edu/",
            "body": "csrfmiddlewaretoken=AtoUFUD4ZQM69sCDDSPP8wwXCOMw3GO3&new_password1=Ozone321&new_password2=Ozone321",
            "method": "POST",
            "mode": "cors"
        });
    }

    /**
     * Reset your account password.
     * @param {string} code The code you recieved via email.
     * @param {string} password The new password you wish to change it to.
     * @returns {Promise<void>}
     */
    async resetPassword(code: string, password: string) {
        const reset = await this._client.make("POST", "/accounts/password_reset/" + code, {
            base: "scratch.mit.edu",
            body: {
                new_password1: password,
                new_password2: password,
                csrfmiddlewaretoken: this._client.getAuthorisation()?.csrf_token
            },
            formdata: true
        });
    }
}