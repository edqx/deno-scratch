import { ScratchClient } from "../Client.ts";

import { Project } from "./Project.ts"

/**
 * Represents a love status on Scratch.
 */
export class ProjectLoveStatus {
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
     * Whether or not the project is loved.
     * @type {boolean}
     */
    loved: boolean;

    /**
     * Instantiate a ProjectLoveStatus object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, project: Project, data: any) {
        this._client = client;
        this._project = project;
 
        this.loved  = data.userLove;
    }

    /**
     * Set the project as loved or unloved.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async setLoved(loved: boolean) : Promise<ProjectLoveStatus> {
        this.loved = loved;

        return await this._project.setLoved(loved);
    }

    /**
     * Toggle whether the project is loved or unloved.
     * @returns {Promise<ProjectLoveStatus>}
     */
    async toggle() : Promise<ProjectLoveStatus> {
        return await this.setLoved(!this.loved);
    }
}