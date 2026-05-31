import { buildApp } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const app = await buildApp()

await app.listen({
    port:3000
})

console.log('HTTP Server Running')