import { prisma } from "../lib/prisma.js";

export const notesService = {
  async create(text: string) {
    return prisma.note.create({
      data: {
        text,
      },
    });
  },

  async findAll() {
    return prisma.note.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.note.findUnique({
      where: {
        id,
      },
    });
  },

  async update(id: string, text: string) {
    return prisma.note.update({
      where: {
        id,
      },
      data: {
        text,
      },
    });
  },

  async delete(id: string) {
    return prisma.note.delete({
      where: {
        id,
      },
    });
  },
};