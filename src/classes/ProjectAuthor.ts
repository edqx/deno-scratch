import { ScratchClient } from "../Client.ts"
import { Project } from "./Project.ts"

import { User } from "./User.ts"

/**
 * Represents the author of a project on Scratch.
 * @extends {User}
 */
export class ProjectAuthor extends User {
    /**
     * The project that the author made.
     * @type {Project}
     * @protected
     */
    protected _project: Project;

    /**
     * Instantiate a ProjectAuthor object on Scratch.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, project: Project, data: any) {
        super(client, data);

        this._project = project;
    }
}