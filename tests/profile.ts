import "https://deno.land/x/dotenv/load.ts";

import { ScratchClient } from "../mod.ts"

const cl = new ScratchClient;

await cl.login("suretide", Deno.env.get("password") || "");
console.log("Logged in.");

await cl.session?.user.deleteUser(Deno.env.get("password") || "", false);
console.log("Deleted user!");