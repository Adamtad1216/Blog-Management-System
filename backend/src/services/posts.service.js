import { getPrismaClient } from '../../config/database.js';
import { generateSlug } from '../utils/slugGenerator.js';

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

const normalizeStatus = (status = 'DRAFT') => {
  const upper = String(status || '').toUpperCase();
  return ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(upper) ? upper : 'DRAFT';
};

export const buildPostPayload = ({
  authorId,
  title,
  content,
  excerpt,
  featuredImage,
  status = 'DRAFT',
  publishedAt,
  categoryId,
  categoryName,
  tagNames = [],
}) => {
  const slug = generateSlug(title);
  const uniqueTagNames = [...new Set(cleanTagNames(tagNames))];

  const effectiveStatus = normalizeStatus(status);
  const effectivePublishedAt =
    publishedAt !== undefined
      ? publishedAt
      : effectiveStatus === 'PUBLISHED'
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
  } else if (categoryName && String(categoryName).trim()) {
    const trimmedCat = String(categoryName).trim();
    payload.category = {
      connectOrCreate: {
        where: { name: trimmedCat },
        create: {
          name: trimmedCat,
          slug: generateSlug(trimmedCat),
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

  // Validate or fallback authorId
  let authorId = data.authorId;
  if (authorId) {
    const userExists = await prisma.user.findUnique({ where: { id: authorId } });
    if (!userExists) {
      authorId = null;
    }
  }

  if (!authorId) {
    const fallbackUser =
      (await prisma.user.findFirst({ where: { role: { in: ['AUTHOR', 'ADMIN'] } } })) ||
      (await prisma.user.findFirst());
    if (!fallbackUser) {
      throw new Error('No user found in database to assign as author');
    }
    authorId = fallbackUser.id;
  }

  const postData = buildPostPayload({ ...data, authorId });

  // Ensure a category is assigned
  if (!postData.category) {
    let defaultCat = await prisma.category.findFirst();
    if (!defaultCat) {
      defaultCat = await prisma.category.create({
        data: {
          name: 'General',
          slug: 'general',
          description: 'General articles',
        },
      });
    }
    postData.category = { connect: { id: defaultCat.id } };
  }

  return prisma.post.create({
    data: postData,
    include: {
      author: { select: AUTHOR_SELECT },
      category: true,
      tags: { include: { tag: true } },
      _count: {
        select: {
          likes: true,
          comments: { where: { parentCommentId: null } },
          bookmarks: true,
        },
      },
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
    query = options.search || options.q || '';
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

  if (status) {
    const upper = String(status).toUpperCase();
    if (['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(upper)) {
      where.status = upper;
    }
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
      _count: {
        select: {
          likes: true,
          comments: { where: { parentCommentId: null } },
          bookmarks: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPostById = async (id, incrementViews = false) => {
  const prisma = getPrismaClient();

  if (incrementViews) {
    try {
      return await prisma.post.update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
        include: {
          author: { select: AUTHOR_SELECT },
          category: true,
          tags: { include: { tag: true } },
          _count: {
            select: {
              likes: true,
              comments: { where: { parentCommentId: null } },
              bookmarks: true,
            },
          },
        },
      });
    } catch (e) {
      return null;
    }
  }

  return prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: AUTHOR_SELECT },
      category: true,
      tags: { include: { tag: true } },
      _count: {
        select: {
          likes: true,
          comments: { where: { parentCommentId: null } },
          bookmarks: true,
        },
      },
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
    const userExists = await prisma.user.findUnique({ where: { id: authorId } });
    if (userExists) {
      updateData.author = { connect: { id: authorId } };
    }
  }

  if (typeof title === 'string' && title.trim()) {
    updateData.title = title.trim();
    updateData.slug = generateSlug(title.trim());
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

  if (status !== undefined) {
    const upper = String(status).toUpperCase();
    if (['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(upper)) {
      updateData.status = upper;
      if (upper === 'PUBLISHED' && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
  }

  if (publishedAt !== undefined) {
    updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
  }

  if (categoryId) {
    updateData.category = { connect: { id: categoryId } };
  } else if (categoryName && String(categoryName).trim()) {
    const trimmedCat = String(categoryName).trim();
    updateData.category = {
      connectOrCreate: {
        where: { name: trimmedCat },
        create: {
          name: trimmedCat,
          slug: generateSlug(trimmedCat),
        },
      },
    };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.post.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Post not found');
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
        _count: {
          select: {
            likes: true,
            comments: { where: { parentCommentId: null } },
            bookmarks: true,
          },
        },
      },
    });
  });
};

export const deletePost = async (id) => {
  const prisma = getPrismaClient();
  return prisma.post.delete({ where: { id } });
};
