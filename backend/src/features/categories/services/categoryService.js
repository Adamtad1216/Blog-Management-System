import prisma from '../../../../config/database.js';

export const createCategory = async (data) => {
  return prisma.category.create({ data });
};

export const getCategories = async () => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id) => {
  return prisma.category.findUnique({ where: { id } });
};

export const updateCategory = async (id, data) => {
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id) => {
  return prisma.category.delete({ where: { id } });
};
