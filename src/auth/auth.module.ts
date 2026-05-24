import { FastifyPluginAsync } from "fastify"
import { authController } from "./auth.controller.js"

export const authModule: FastifyPluginAsync = async (app) => {
    await app.register(authController)
}