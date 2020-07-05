import * as ws from "https://deno.land/std/ws/mod.ts"
import { Evt } from "https://deno.land/x/evt/mod.ts";

import { ScratchClient } from "./Client.ts"

import { Project } from "./classes/Project.ts"

/**
 * Represents a cloud session websocket event.
 */
interface CloudSessionEvent {
    /**
     * The method of the event being Set.
     * @type {string}
     */
    method: string;

    /**
     * The project ID that the event was emitted from.
     * @type {string}
     */
    project_id: string;
}

/**
 * Represents a cloud variable being changed.
 */
interface CloudSessionSetEvent {
    /**
     * The method of the event being Set.
     * @type {"set"}
     */
    method: "set";
    
    /**
     * The name of the variable that was set.
     * @type {string}
     */
    name: string;

    /**
     * The project ID that the event was emitted from.
     * @type {string}
     */
    project_id: string;
    
    /**
     * The value that the variable was changed to.
     * @type {string}
     */
    value: string;
}

/**
 * Represents a set of cloud variables.
 */
interface CloudVariables {
    /**
     * A key-value pair.
     */
    [key: string]: string;
}

/**
 * Represents a cloud server connection session on Scratch.
 * @extends <AsyncIterable<CloudSessionSetEvent>
 */
export class CloudSession extends Evt<CloudSessionSetEvent> {
    /**
     * The client that instantiated this object.
     * @type {ScratchClient}
     * @protected
     */
    protected _client: ScratchClient;

    /**
     * The cloud session socket connection.
     * @type {ws.WebSocket}
     * @private
     */
    private s?: ws.WebSocket; // socket

    /**
     * Cached variables and their values.
     * @type {CloudVariable}
     */
    variables: CloudVariables;

    /**
     * The ID of the project that the socket is connected to.
     * @type {number}
     */
    project_id?: number;

    /**
     * Instantiate a CloudSession object.
     * @param {ScratchClient} client The client that is instantiating this object.
     * @param {ScratchClient} project The project to connect to.
     */
    constructor(client: ScratchClient) {
        super();

        this._client = client;
        this.variables = {};
    }

    /**
     * Instantiate the connection.
     * @param {Project|number} project The ID of the project to connect to.
     * @returns {Promise<void>}
     */
    async connect(project: Project|number) : Promise<void> {
        const project_id = typeof project === "number" ? project : project.id;

        const authorisation = this._client.getAuthorisation();

         if (authorisation) {
            const headers = new Headers();
            headers.append("Cookie", "scratchsessionsid=" + authorisation.session_id + ";");
            headers.append("Origin", "https://scratch.mit.edu");

            this.s = await ws.connectWebSocket("wss://clouddata.scratch.mit.edu", headers);
            this.project_id = project_id;

            await this.s.send(JSON.stringify({
                method: "handshake",
                project_id: this.project_id.toString(),
                user: this._client.session?.user.username
            }) + "\n");

            const variable_set = (await this.s[Symbol.asyncIterator]().next()).value;

            if (typeof variable_set === "string") {
                const variables = variable_set.trim().split("\n");

                variables.forEach(set => {
                    const event = JSON.parse(set) as CloudSessionEvent;

                    if (event.method === "set") {
                        const set_event = event as CloudSessionSetEvent;

                        this.variables[set_event.name] = set_event.value;
                    }
                });
            }

            (async () => {
                if (this.s) {
                    for await (let message of this.s) {
                        try {
                            if (ws.isWebSocketCloseEvent(message)) {
                                this.s.close();
                            } else if (ws.isWebSocketPingEvent(message)) {
                                
                            } else if (ws.isWebSocketPongEvent(message)) {
                                
                            } else {
                                if (typeof message === "string") {
                                    const event = JSON.parse(message) as CloudSessionEvent;

                                    if (event.method === "set") {
                                        const set_event = event as CloudSessionSetEvent;

                                        this.variables[set_event.name] = set_event.value;
                                        this.post(set_event);
                                    }
                                }
                            }
                        } catch (e) {
                            throw e;
                        }
                    }
                }
            })();
        }
    }

    /**
     * Set a cloud variable's value.
     * @param {string} variable The variable name to set.
     * @param {string} value The value of the variable to set.
     * @returns {Promise<void>}
     */
    async set(variable: string, value: string) : Promise<void> {
        if (this.s) {
            await this.s.send(JSON.stringify({
                method: "set",
                name: variable,
                project_id: this.project_id,
                user: this._client.session?.user.username,
                value: value
            }) + "\n")
        }
    }

    /**
     * Get a cloud variable's value.
     * @param {string} variable The variable name to get.
     * @returns {string}
     */
    get(variable: string) : string {
        return this.variables[variable];
    }
}