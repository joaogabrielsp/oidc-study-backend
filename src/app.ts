import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { healthModule } from "./health/health.module.js";
import { authModule } from "./auth/auth.module.js";
import { notesModule } from "./notes/notes.module.js";

export async function buildApp() {
  const app = fastify();

  await app.register(healthModule);
  await app.register(authModule);
  await app.register(notesModule);

  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });
  await app.register(cookie);

  return app;
}
