import { FastifyPluginAsync } from "fastify"
import { notesController } from "./notes.controller.js"

export const notesModule: FastifyPluginAsync = async (app) => {
    await app.register(notesController)
}