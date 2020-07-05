import "https://deno.land/x/dotenv/load.ts";

import { ScratchClient } from "../mod.ts"

const cl = new ScratchClient;

await cl.login("suretide", Deno.env.get("password") || "");
console.log("Logged in.");

const project = await cl.getProject(320862475);
console.log("Got project " + project.title);

await project.view();

const cloud = new cl.CloudSession();

await cloud.connect(project.id);
console.log("Connected to cloud");

await cloud.set("☁ cloud variable", "192");