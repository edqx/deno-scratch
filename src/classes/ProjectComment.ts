import { ScratchClient } from "../Client.ts";
import { Project } from "./Project.ts"

import { CommentAuthor } from "./CommentAuthor.ts"

/**
 * Represents a comment on Scratch.
 */
export class ProjectComment {
    /**
     * The client that instantiated the object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;

    /**
     * The project that the comment belongs to.
     * @type {Project}
     * @protected
     */
    protected _project: Project;

    /**
     * The author of the comment.
     * @type {CommentAuthor}
     */
    author: CommentAuthor;
    
    /**
     * @type {number}
     */
    commentee_id: number;

    /**
     * The content of the comment.
     * @type {string}
     */
    content: string;
    
    /**
     * When the comment was created.
     * @type {number}
     */
    created_timestamp: number;

    /**
     * When the comment was last modified.
     * @type {number}
     */
    modified_timestamp: number;

    /**
     * The ID of the comment.
     * @type {number}
     */
    id: number;

    /**
     * The ID of the comment's parent.
     * @type {number}
     */
    parent_id: number;

    /**
     * The amount of replies to the comment.
     * @type {number}
     */
    reply_count: number;

    /**
     * The visibility of the comment.
     * @type {("visible" | "hidden")}
     */
    visibility: "visible"|"hidden";

    /**
     * Instantiate a Comment object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {any} data The data for the object.
     */
    constructor(client: ScratchClient, project: Project, data: any) {
        this._client = client;
        this._project = project;

        this.author = new CommentAuthor(client, data.author);
        this.commentee_id = data.commentee_id;
        this.content = data.content;
        this.created_timestamp = new Date(data.datetime_created).getTime();
        this.modified_timestamp = new Date(data.datetime_modified).getTime();
        this.id = data.id;
        this.parent_id = data.parent_id;
        this.reply_count = data.reply_count;
        this.visibility = data.visibility;
    }

    /**
     * Get an array of replies to the comment.
     * @param {number} offset The offset to apply to the request.
     * @param {number} limit The max number of replies to retrieve.
     * @returns {Promise<Array<ProjectComment>>}
     */
    async getReplies(offset: number = 0, limit: number = 20) : Promise<Array<ProjectComment>> {
        const replies = await this._client.make("GET", 
            "/users/" + this._project.author.username + 
            "/projects/" + this._project.id +
            "/comments/" + this.id +
            "/replies", {
                query: {
                    offset: offset.toString(),
                    limit: limit.toString()
                }
            });

        const json = await replies.json();

        return json.map((comment: any) => new ProjectComment(this._client, this._project, comment));
    }
}