import "dotenv/config";
import { buildApp } from "./app.js";
import { initPermifySchema } from "./permify/init.js";

const app = await buildApp()

await initPermifySchema();

await app.listen({
    port:3000
})

console.log('HTTP Server Running')