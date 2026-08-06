import prisma from '../../../../config/database.js';
import { generateSlug } from '../../../utils/slugGenerator.js';

const normalizeTagNames = (tagNames = []) => {
  if (Array.isArray(tagNames)) {
    return tagNames;
  }

  if (typeof tagNames === 'string') {
    return tagNames.split(',');
  }

  return [];
};

const cleanTagNames = (tagNames = []) => {
  return normalizeTagNames(tagNames)
    .filter(Boolean)
    .map((name) => String(name).trim())
    .filter((name) => name.length > 0);
};

export const buildPostPayload = ({ title, content, categoryName, tagNames = [], published = false }) => {
  const slug = generateSlug(title);
  const uniqueTagNames = [...new Set(cleanTagNames(tagNames))];
  const payload = {
    title,
    slug,
    content,
    published,
  };

  if (categoryName) {
    payload.category = {
      connectOrCreate: {
        where: { name: categoryName },
        create: {
          name: categoryName,
          slug: generateSlug(categoryName),
        },
      },
    };
  }

  if (uniqueTagNames.length > 0) {
    payload.tags = {
      create: uniqueTagNames.map((name) => ({
        tag: {
          connectOrCreate: {
            where: { name },
            create: {
              name,
              slug: generateSlug(name),
            },
          },
        },
      })),
    };
  }

  return payload;
};

export const createPost = async (data) => {
  const postData = buildPostPayload(data);

  return prisma.post.create({
    data: postData,
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
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
  const { title, content, published, categoryName, tagNames } = data;
  const updateData = {};

  if (typeof title === 'string' && title.trim()) {
    updateData.title = title;
    updateData.slug = generateSlug(title);
  }

  if (typeof content === 'string') {
    updateData.content = content;
  }

  if (typeof published === 'boolean') {
    updateData.published = published;
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.post.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Post not found');
    }

    if (categoryName !== undefined) {
      updateData.category = {
        connectOrCreate: {
          where: { name: categoryName },
          create: {
            name: categoryName,
            slug: generateSlug(categoryName),
          },
        },
      };
    }

    const updatedPost = await tx.post.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (tagNames !== undefined) {
      await tx.postTag.deleteMany({ where: { postId: id } });

      const uniqueTagNames = [...new Set(cleanTagNames(tagNames))];
      if (uniqueTagNames.length > 0) {
        await tx.post.update({
          where: { id },
          data: {
            tags: {
              create: uniqueTagNames.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: {
                      name,
                      slug: generateSlug(name),
                    },
                  },
                },
              })),
            },
          },
        });
      }
    }

    return tx.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });
  });
};

export const deletePost = async (id) => {
  return prisma.post.delete({ where: { id } });
};
