import { ScratchClient } from "../Client.ts";

import { Project } from "./Project.ts"

/**
 * Represents a favourite status on Scratch.
 */
export class ProjectFavouriteStatus {
    /**
     * The client that instantiated this object.
     * @type {ScratchClient}
     */
    private _client: ScratchClient;

    /**
     * The project that this object refers to.
     * @type {Project}
     */
    private _project: Project;

    /**
     * Whether or not the project is favourited.
     * @type {boolean}
     */
    favourited: boolean;
    
    /**
     * Whether or not the project is favorited.
     * @type {boolean}
     */
    favorited: boolean;

    /**
     * Instantiate a ProjectFavouriteStatus object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, project: Project, data: any) {
        this._client = client;
        this._project = project;

        this.favourited  = data.userFavorite;
        this.favorited  = data.userFavorite;
    }

    /**
     * Set the project as favourited or unfavourited.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async setFavourited(favourited: boolean) : Promise<ProjectFavouriteStatus> {
        this.favourited = favourited;

        return await this._project.setFavourited(favourited);
    }

    async setFavorited(favorited: boolean) : Promise<ProjectFavouriteStatus> {
        return await this.setFavorited(favorited);
    }

    /**
     * Toggle whether the project is favourited or unfavourited.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async toggle() : Promise<ProjectFavouriteStatus> {
        return await this.setFavourited(!this.favourited);
    }
}