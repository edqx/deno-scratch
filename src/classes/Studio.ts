import { ScratchClient } from "../Client.ts"

import { StudioHistory } from "../interfaces/StudioHistory.ts"
import { StudioStats } from "../interfaces/StudioStats.ts"

/**
 * Represents a studio  on Scratch.
 */
export class Studio {
    /**
     * The client that instantiated this object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;

    /**
     * The description of the studio.
     * @type {string}
     */
    description: string;

    /**
     * An object of timestamps from the studio's history
     * @type {StudioHistory}
     */
    history: StudioHistory;

    /**
     * The ID of the studio
     * @type {number}
     */
    id: number;

    /**
     * The URL of studio's thumbnail.
     * @type {string}
     */
    thumbnail: string;

    /**
     * Whether or not the studio is open for everyone to add projects to.
     * @type {boolean}
     */
    open_to_all: boolean;

    /**
     * The ID of the studio owner.
     * @type {number}
     */
    owner_id: number;

    /**
     * The stats for the studio.
     * @type {StudioStats}
     */
    stats: StudioStats;

    /**
     * The title of the studio.
     * @type {string}
     */
    title: string;

    /**
     * The visibility of the studio.
     * @type {string}
     */
    visibility: "visible"|"hidden";

    /**
     * Instantiate a Project object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        this._client = client;

        this.description = data.description;
        this.history = {
            created_timestamp: new Date(data.history.created).getTime(),
            modified_timestamp: new Date(data.history.modified).getTime()
        } as StudioHistory;
        this.id = data.id;
        this.thumbnail = data.image;
        this.open_to_all = data.open_to_all;
        this.owner_id = data.owner;
        this.stats = data.stats as StudioStats;
        this.title = data.title;
        this.visibility = data.visibility;
    }
}