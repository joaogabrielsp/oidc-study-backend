import "dotenv/config";
import { buildApp } from "./app.js";

const app = await buildApp()

await app.listen({
    port:3000
})

console.log('HTTP Server Running')