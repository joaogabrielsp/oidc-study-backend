import { FastifyPluginAsync } from "fastify";
import { authenticate } from "../auth/authenticate.js";
import { notesService } from "./notes.service.js";

export const notesController: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/notes",
    {
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const { text } = req.body as {
        text?: string;
      };

      if (!text || text.trim() === "") {
        return reply.status(400).send({
          error: "Text is required",
        });
      }

      const note = await notesService.create(text);

      return reply.status(201).send(note);
    },
  );

  fastify.get(
    "/notes",
    {
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const notes = await notesService.findAll();

      return reply.status(200).send(notes);
    },
  );

  fastify.get(
    "/notes/:id",
    {
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const { id } = req.params as {
        id: string;
      };

      const note = await notesService.findById(id);

      if (!note) {
        return reply.status(404).send({
          error: "Note not found",
        });
      }

      return reply.status(200).send(note);
    },
  );

  fastify.put(
    "/notes/:id",
    {
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const { id } = req.params as {
        id: string;
      };

      const { text } = req.body as {
        text?: string;
      };

      if (!text || text.trim() === "") {
        return reply.status(400).send({
          error: "Text is required",
        });
      }

      const note = await notesService.findById(id);

      if (!note) {
        return reply.status(404).send({
            error: "Note not found"
        });
      }
      const updatedNote = await notesService.update(id, text);

      return reply.status(200).send(updatedNote);
    },
  );

  fastify.delete(
    "/notes/:id",
    {
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const { id } = req.params as {
        id: string;
      };

      const note = await notesService.findById(id);

      if (!note) {
        return reply.status(404).send({
          error: "Note not found",
        });
      }

      await notesService.delete(id);

      return reply.status(204).send();
    },
  );
};
