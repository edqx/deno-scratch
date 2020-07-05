import { ScratchClient } from "../Client.ts"

import { ProjectHistory } from "../interfaces/ProjectHistory.ts"
import { ProjectThumbnailSizes } from "../interfaces/ProjectThumbnailSizes.ts"
import { ProjectRemixNode } from "../interfaces/ProjectRemixNode.ts"
import { ProjectStats } from "../interfaces/ProjectStats.ts"

import { ProjectAuthor } from "./ProjectAuthor.ts"
import { ProjectLoveStatus } from "./ProjectLoveStatus.ts"
import { ProjectFavouriteStatus } from "./ProjectFavouriteStatus.ts"

import { ProjectComment } from "./ProjectComment.ts"

import { ProjectData } from "./ProjectData.ts"

import { Studio } from "./Studio.ts"

/**
 * Represents a project on Scratch.
 */
export class Project {
    /**
     * The client that instantiated this object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;

    /**
     * The author of the project.
     * @type {ProjectAuthor}
     */
    author: ProjectAuthor;
    
    /**
     * Whether or not comments are enabled on the project.
     * @type {boolean}
     */
    comments_allowed: boolean;

    /**
     * The "Notes and Credits" section of the project.
     * @type {string}
     */
    description: string;

    /**
     * The timestamps of certain events in the project's history.
     * @type {ProjectHistory}
     */
    history: ProjectHistory;

    /**
     * The ID of the project.
     * @type {number}
     */
    id: number;

    /**
     * The URL of the thumbnail for the project.
     * @type {string}
     */
    thumbnail: string;

    /**
     * An object of URLs for different thumbnail sizes.
     * @type {ProjectThumbnailSizes}
     */
    thumbnails: ProjectThumbnailSizes;

    /**
     * The "Instructions" section on the project.
     * @type {string}
     */
    instructions: string;

    /**
     * Whether or not the project has been published.
     * @type {boolean}
     */
    published: boolean;

    /**
     * Whether or not the project is public.
     * @type {boolean}
     */
    public: boolean;

    /**
     * The remix node information for the project.
     * @type {ProjectRemixNode}
     */
    node: ProjectRemixNode;

    /**
     * The stats for the project.
     * @type {ProjectStats}
     */
    stats: ProjectStats;

    /**
     * The title of the project.
     * @type {string}
     */
    title: string;

    /**
     * The visibility of the project.
     * @type {("visible"|"hidden")}
     */
    visibility: "visible" | "hidden";

    /**
     * Instantiate a Project object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        this._client = client;

        this.author = new ProjectAuthor(client, this, data.author);
        this.comments_allowed = data.comments_allowed;
        this.description = data.description;
        this.history = {
            created_timestamp: new Date(data.history.created).getTime(),
            modified_timestamp: new Date(data.history.modified).getTime(),
            shared_timestamp: new Date(data.history.shared).getTime()
        } as ProjectHistory;
        this.id = data.id;
        this.thumbnail = data.image;
        this.thumbnails = data.images as ProjectThumbnailSizes;
        this.instructions = data.instructions;
        this.published = data.published;
        this.public = data.public;
        this.node = data.remix;
        this.stats = data.stats as ProjectStats;
        this.title = data.title;
        this.visibility = data.visibility;
    }

    /**
     * Get the project's script and sprite data.
     * @returns {Promise<ProjectData>}
     */
    async getData() : Promise<ProjectData> {
        const project = await this._client.make("GET", "/406817907", {
            base: "projects.scratch.mit.edu"
        });

        const json = await project.json();

        return new ProjectData(this._client, json);
    }

    /**
     * Check if the client user has loved the project or not.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async getLoveStatus() : Promise<ProjectLoveStatus> {
        if (this._client.session) {
            const loved = await this._client.make("GET", "/projects/" + this.id + "/loves/user/" + this._client.session.user.username);
            const json = await loved.json();

            return new ProjectLoveStatus(this._client, this, json);
        } else {
            throw new Error("Not logged in.");
        }
    }

    /**
     * Set the project as loved or unloved.
     * @param {boolean} loved Whether or not to mark as loved or unloved.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async setLoved(loved: boolean) : Promise<ProjectLoveStatus> {
        if (this._client.session) {
            const love = await this._client.make(loved ? "POST" : "DELETE", "/proxy/projects/" + this.id + "/loves/user/" + this._client.session.user.username);
            const json = await love.json();

            return new ProjectLoveStatus(this._client, this, json);
        } else {
            throw new Error("Not logged in.");
        }
    }

    /**
     * Check if the client user has favourited the project or not.
     * @returns {Promise<ProjectFavouriteStatus>}
     */
    async getFavouriteStatus() : Promise<ProjectFavouriteStatus> {
        if (this._client.session) {
            const loved = await this._client.make("GET", "/projects/" + this.id + "/favorites/user/" + this._client.session.user.username);
            const json = await loved.json();

            return new ProjectFavouriteStatus(this._client, this, json);
        } else {
            throw new Error("Not logged in.");
        }
    }

    /**
     * Check if the client user has favorited the project or not.
     * @returns {Promise<ProjectFavouriteStatus>}
     */
    async getFavoriteStatus() : Promise<ProjectFavouriteStatus> {
        return this.getFavouriteStatus();
    }

    /**
     * Set the project as favourited or unfavourited
     * @param {boolean} favourited Whether or not to mark as unfavourited or unfavourited.
     * @returns {Promise<ProjectFavouriteStatus>}
     */
    async setFavourited(favourited: boolean) : Promise<ProjectFavouriteStatus> {
        if (this._client.session) {
            const favourite = await this._client.make(favourited ? "POST" : "DELETE", "/proxy/projects/" + this.id + "/favorites/user/" + this._client.session.user.username);
            const json = await favourite.json();

            return new ProjectFavouriteStatus(this._client, this, json);
        } else {
            throw new Error("Not logged in.");
        }
    }

    /**
     * Set the project as favorited or unfavorited
     * @param {boolean} favorited Whether or not to mark as unfavorited or unfavorited.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async setFavorited(favorited: boolean) : Promise<ProjectFavouriteStatus> {
        return this.setFavourited(favorited);
    }

    /**
     * Set comments on the project to be enabled or disabled.
     * @param comments_allowed Whether or not comments should be allowed.
     * @returns {Promise<Project>}
     */
    async setCommentsAllowed(comments_allowed: boolean) : Promise<Project> {
        const project = await this._client.make("GET", "/projects/" + this.id, {
            body: {
                comments_allowed
            }
        });

        const json = await project.json();
        
        this.comments_allowed = json.comments_allowed;

        return new Project(this._client, json);
    }

    /**
     * Get an array of project remixes.
     * @param {number} limit The limit of project remixes to retrieve.
     * @returns {Promise<Array<Project>>}
     */
    async getRemixes(limit: number = 20) : Promise<Array<Project>> {
        const remixes = await this._client.make("GET", "/projects/" + this.id + "/remixes", {
            query: {
                limit: limit.toString()
            }
        });

        const json = await remixes.json();

        return json.map((project: any) => new Project(this._client, project));
    }

    /**
     * Get an array of comments posted on the project.
     * @param {number} offset? The offset to apply to the request.
     * @param {number} limit? The limit of comments to retrieve.
     * @returns {Promise<Array<ProjectComment>>}
     */
    async getComments(offset: number = 0, limit: number = 20) : Promise<Array<ProjectComment>> {
        const comments = await this._client.make("GET", 
            "/users/" + this.author.username + 
            "/projects/" + this.id +
            "/comments", {
                query: {
                    offset: offset.toString(),
                    limit: limit.toString()
                }
            });

        const json = await comments.json();

        return json.map((comment: any) => new ProjectComment(this._client, this, comment));
    }

    /**
     * Get studios that in the project is in.
     * @returns {Promise<Array<Studio>>}
     */
    async getStudios() : Promise<Array<Studio>> {
        const studios = await this._client.make("GET",
            "/users/" + this.author.username +
            "/projects/" + this.id +
            "/studios");

        const json = await studios.json();

        return json.map((studio: any) => new Studio(this._client, studio));
    }

    /**
     * Mark the project as viewed.
     * @returns {Promise<void>}
     */
    async view() : Promise<void> {
        await this._client.make("POST",
            "/users/" + this.author.username +
            "/projects/" + this.id +
            "/views");
    }

    /**
     * Remix the project as your own.
     * @returns {Promise<Project>}
     */
    async remix() : Promise<void> {

    }
}