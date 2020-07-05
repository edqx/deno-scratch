import "https://deno.land/x/dotenv/load.ts";

import { ScratchClient } from "../mod.ts"

const sleep = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

const env = Deno.env.toObject();

function decode(str: string) : string {
    str = str.toLowerCase();

    var out = "";

    for (let i = 0; i < str.length; i+=5) {
        out += String.fromCharCode(parseInt(str.substr(i, 5)));
    }

    return out;
}

function encode(str: string) : string{
    str = str.toLowerCase();

    var out = "";

    for (let i = 0; i < str.length; i++) {
        let n = str.charCodeAt(i).toString();
        out += n.length === 1 ? "0" + n : n;
    }

    return out;
}

let ids: any = {};

const client: ScratchClient = new ScratchClient();
try {
    if (await client.login(env.user_name, env.password)) {
        console.log("Logged in!");

        if (client.session) {
            const project = await client.getProject(400065722);

            const cloud = new client.CloudSession();

            await cloud.connect(project);

            console.log("Connected to cloud!");

            cloud.attach(evt => {
                if (evt.name === "☁ io.socket.out") {
                    const json = JSON.parse(decode(evt.value));

                    if (json.e === "1") {
                        const enc = new TextEncoder();
                        console.log(ids[json.i]);
                        Deno.writeFileSync(json.i + ".txt", enc.encode(JSON.parse(ids[json.i]).message));
                        delete ids[json.i];
                    } else {
                        if (!ids[json.i]) {
                            ids[json.i] = json.p;
                        } else {
                            ids[json.i] += json.p;
                        }
                    }
                }
            });
        }
    }
} catch (e) {
    console.log(e);
}