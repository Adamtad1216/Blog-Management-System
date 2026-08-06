import { getPrismaClient } from '../../../../config/database.js';
import { generateSlug } from '../../../utils/slugGenerator.js';

export const createTag = async (data) => {
  const prisma = getPrismaClient();
  const payload = {
    name: data.name,
    slug: data.slug || generateSlug(data.name),
  };

  return prisma.tag.create({ data: payload });
};

export const getTags = async () => {
  const prisma = getPrismaClient();
  return prisma.tag.findMany();
};

export const getTagById = async (id) => {
  const prisma = getPrismaClient();
  return prisma.tag.findUnique({ where: { id } });
};

export const updateTag = async (id, data) => {
  const prisma = getPrismaClient();
  const payload = { ...data };

  if (payload.name) {
    payload.slug = payload.slug || generateSlug(payload.name);
  }

  return prisma.tag.update({ where: { id }, data: payload });
};

export const deleteTag = async (id) => {
  const prisma = getPrismaClient();
  return prisma.tag.delete({ where: { id } });
};
