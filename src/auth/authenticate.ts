import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "./jwt.service.js";

export async function authenticate(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const token = req.cookies.access_token;

  if (!token) {
    return reply.status(401).send({
      error: "Missing access token",
    });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return reply.status(401).send({
      error: "Invalid or expired token",
    });
  }

  req.user = {
    sub: payload.sub!,
    email: payload.email,
    username: payload.preferred_username,
    name: payload.name,
  };
}