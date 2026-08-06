import prisma from '../../../../config/database.js';

export const createTag = async (data) => {
  return prisma.tag.create({ data });
};

export const getTags = async () => {
  return prisma.tag.findMany();
};

export const getTagById = async (id) => {
  return prisma.tag.findUnique({ where: { id } });
};

export const updateTag = async (id, data) => {
  return prisma.tag.update({ where: { id }, data });
};

export const deleteTag = async (id) => {
  return prisma.tag.delete({ where: { id } });
};
