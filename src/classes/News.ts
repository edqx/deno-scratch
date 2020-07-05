import { ScratchClient } from "../Client.ts";

/**
 * Represents a news article on Scratch.
 */
export class News {
    /**
     * The client that instantiated the object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;
    
    /**
     * The body text of the news.
     * @type {boolean}
     */
    body: string;

    /**
     * When the news was created.
     * @type {number}
     */
    created_timestamp: number;

    /**
     * The headline of the news.
     * @type {string}
     */
    headline: string;

    /**
     * The ID of the news.
     * @type {number}
     */
    id: number;
    
    /**
     * The URL of the news' thumbnail.
     * @type {number}
     */
    thumbnail_url: string;

    /**
     * The URL of the news article.
     * @type {string}
     */
    url: string;

    /**
     * Instantiate a News object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, data: any) {
        this._client = client;

        this.body = data.copy;
        this.headline = data.headline;
        this.id = data.id;
        this.thumbnail_url = data.image;
        this.created_timestamp = data.stamp;
        this.url = data.url;
    }
}