import type { FastifyReply, FastifyRequest } from "fastify";
import { permifyCheck } from "../permify/permify.client.js";

export function authorize(permission: string) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req.user as any)?.sub;

    if (!userId) {
      return reply.status(401).send({ error: "Unauthenticated" });
    }

    const result = await permifyCheck({
      userId,
      permission,
      entity: {
        type: "app",
        id: "global",
      },
    });

    if (result.can !== "CHECK_RESULT_ALLOWED") {
      return reply.status(403).send({ error: "Forbidden" });
    }
  };
}