import prisma from '../../../../config/database.js';

export const createPost = async (data) => {
  return prisma.post.create({ data });
};

export const getPosts = async () => {
  return prisma.post.findMany({
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
};

export const getPostById = async (id) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
};

export const updatePost = async (id, data) => {
  return prisma.post.update({ where: { id }, data });
};

export const deletePost = async (id) => {
  return prisma.post.delete({ where: { id } });
};
