import fastify from "fastify";
import cookie from "@fastify/cookie";
import { healthModule } from "./health/health.module.js";

export async function buildApp() {
  const app = fastify();

  await app.register(healthModule);

  await app.register(cookie);

  return app;
}
