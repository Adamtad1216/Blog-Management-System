import { getPrismaClient } from '../../../../config/database.js';
import { generateSlug } from '../../../utils/slugGenerator.js';

const AUTHOR_SELECT = {
  id: true,
  fullName: true,
  username: true,
  email: true,
  avatar: true,
  role: true,
};

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

export const buildPostPayload = ({
  authorId,
  title,
  content,
  excerpt,
  featuredImage,
  status = 'draft',
  publishedAt,
  categoryId,
  categoryName,
  tagNames = [],
}) => {
  const slug = generateSlug(title);
  const uniqueTagNames = [...new Set(cleanTagNames(tagNames))];

  const effectiveStatus = ['draft', 'published', 'archived'].includes(status) ? status : 'draft';
  const effectivePublishedAt =
    publishedAt !== undefined
      ? publishedAt
      : effectiveStatus === 'published'
        ? new Date()
        : null;

  const payload = {
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    status: effectiveStatus,
    publishedAt: effectivePublishedAt ? new Date(effectivePublishedAt) : null,
  };

  if (authorId) {
    payload.author = {
      connect: { id: authorId },
    };
  }

  if (categoryId) {
    payload.category = {
      connect: { id: categoryId },
    };
  } else if (categoryName) {
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
  const prisma = getPrismaClient();
  const postData = buildPostPayload(data);

  return prisma.post.create({
    data: postData,
    include: {
      author: { select: AUTHOR_SELECT },
      category: true,
      tags: { include: { tag: true } },
    },
  });
};

export const buildPostSearchFilter = (options = {}) => {
  let query = '';
  let authorId;
  let categoryId;
  let status;

  if (typeof options === 'string') {
    query = options;
  } else if (options && typeof options === 'object') {
    query = options.query || options.search || options.q || '';
    authorId = options.authorId;
    categoryId = options.categoryId;
    status = options.status;
  }

  const where = {};
  const searchTerm = String(query || '').trim();

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
      { excerpt: { contains: searchTerm, mode: 'insensitive' } },
      { slug: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (authorId) {
    where.authorId = authorId;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status && ['draft', 'published', 'archived'].includes(status)) {
    where.status = status;
  }

  return where;
};

export const getPosts = async (options = {}) => {
  const prisma = getPrismaClient();
  const where = buildPostSearchFilter(options);

  return prisma.post.findMany({
    where,
    include: {
      author: { select: AUTHOR_SELECT },
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPostById = async (id, incrementViews = true) => {
  const prisma = getPrismaClient();

  if (incrementViews) {
    await prisma.post
      .update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch(() => null);
  }

  return prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: AUTHOR_SELECT },
      category: true,
      tags: { include: { tag: true } },
    },
  });
};

export const updatePost = async (id, data) => {
  const prisma = getPrismaClient();
  const {
    authorId,
    title,
    content,
    excerpt,
    featuredImage,
    status,
    publishedAt,
    categoryId,
    categoryName,
    tagNames,
  } = data;

  const updateData = {};

  if (authorId) {
    updateData.author = { connect: { id: authorId } };
  }

  if (typeof title === 'string' && title.trim()) {
    updateData.title = title;
    updateData.slug = generateSlug(title);
  }

  if (content !== undefined) {
    updateData.content = content;
  }

  if (excerpt !== undefined) {
    updateData.excerpt = excerpt;
  }

  if (featuredImage !== undefined) {
    updateData.featuredImage = featuredImage;
  }

  if (status !== undefined && ['draft', 'published', 'archived'].includes(status)) {
    updateData.status = status;
    if (status === 'published' && !publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  if (publishedAt !== undefined) {
    updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.post.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Post not found');
    }

    if (categoryId) {
      updateData.category = { connect: { id: categoryId } };
    } else if (categoryName !== undefined) {
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

    await tx.post.update({
      where: { id },
      data: updateData,
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
        author: { select: AUTHOR_SELECT },
        category: true,
        tags: { include: { tag: true } },
      },
    });
  });
};

export const deletePost = async (id) => {
  const prisma = getPrismaClient();
  return prisma.post.delete({ where: { id } });
};

