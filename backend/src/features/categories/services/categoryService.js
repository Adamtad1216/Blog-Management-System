import { getPrismaClient } from '../../../../config/database.js';
import { generateSlug } from '../../../utils/slugGenerator.js';

export const createCategory = async (data) => {
  const prisma = getPrismaClient();
  const payload = {
    name: data.name,
    slug: data.slug || generateSlug(data.name),
    description: data.description,
  };

  return prisma.category.create({ data: payload });
};

export const getCategories = async () => {
  const prisma = getPrismaClient();
  return prisma.category.findMany();
};

export const getCategoryById = async (id) => {
  const prisma = getPrismaClient();
  return prisma.category.findUnique({ where: { id } });
};

export const updateCategory = async (id, data) => {
  const prisma = getPrismaClient();
  const payload = { ...data };

  if (payload.name) {
    payload.slug = payload.slug || generateSlug(payload.name);
  }

  return prisma.category.update({ where: { id }, data: payload });
};

export const deleteCategory = async (id) => {
  const prisma = getPrismaClient();
  return prisma.category.delete({ where: { id } });
};
