import "fastify";
import type { AuthUser } from "../auth/types/auth-user.js";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }
}