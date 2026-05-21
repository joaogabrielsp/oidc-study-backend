import { FastifyInstance } from 'fastify'
import { healthController } from './health.controller.js'

export async function healthModule(app: FastifyInstance) {
  app.get('/', healthController)
}