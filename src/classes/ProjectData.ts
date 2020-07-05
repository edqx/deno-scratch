import { ScratchClient } from "../Client.ts"

import { ProjectMetadata } from "../interfaces/ProjectMetadata.ts"

/**
 * Represents project scene data on Scratch.
 */
export class ProjectData {
    /**
     * The client that instantiated this object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;

    /**
     * The extensions in the project.
     * @type {Array<string>}
     */
    extensions: Array<string>;

    /**
     * The project metadata.
     * @type {ProjectMetadata}
     */
    meta: ProjectMetadata;

    /**
     * Instantiate a Project object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        this._client = client;

        this.extensions = data.extensions;
        this.meta = data.meta;
    }
}