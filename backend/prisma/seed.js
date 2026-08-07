import 'dotenv/config';
import { getPrismaClient, disconnectDatabase } from '../config/database.js';

const admin = {
  fullName: process.env.ADMIN_FULL_NAME || 'System Administrator',
  username: process.env.ADMIN_USERNAME || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@12345',
};

const samplePosts = [
  {
    title: 'Getting Started with Node.js and Express',
    slug: 'getting-started-with-nodejs-and-express',
    excerpt: 'Learn how to build modern, scalable web APIs using Node.js and Express.',
    content: 'Node.js is an open-source, cross-platform JavaScript runtime environment. Combined with Express, developers can rapidly build modern REST APIs with robust routing and middleware support.',
    status: 'PUBLISHED',
  },
  {
    title: 'Mastering Database Relations with Prisma ORM',
    slug: 'mastering-database-relations-with-prisma-orm',
    excerpt: 'A deep dive into model relations, foreign keys, and migrations in Prisma.',
    content: 'Prisma ORM simplifies database management with type-safe queries, automatic migration generation, and clear relational data modeling across PostgreSQL and SQL databases.',
    status: 'PUBLISHED',
  },
  {
    title: 'Building Secure REST APIs with JWT Authentication',
    slug: 'building-secure-rest-apis-with-jwt-authentication',
    excerpt: 'Best practices for implementing access tokens, refresh tokens, and RBAC.',
    content: 'Authentication is a crucial security layer in modern web applications. Using JSON Web Tokens (JWT) with refresh token rotation ensures secure, seamless user sessions.',
    status: 'PUBLISHED',
  },
  {
    title: 'Designing Scalable Web Systems',
    slug: 'designing-scalable-web-systems',
    excerpt: 'Key strategies for building microservices, load balancing, and database caching.',
    content: 'Scalability is essential for growing web platforms. By decoupling backend services, indexing database queries, and utilizing Redis caching, platforms can easily handle millions of users.',
    status: 'PUBLISHED',
  },
  {
    title: 'Modern Frontend and Backend Integration',
    slug: 'modern-frontend-and-backend-integration',
    excerpt: 'How to cleanly connect React or Next.js frontends with Express REST APIs.',
    content: 'Clean API contract design between frontend and backend developers enables rapid feature development, seamless integration testing, and excellent developer experience.',
    status: 'PUBLISHED',
  },
];

async function main() {
  const prisma = getPrismaClient();

  console.log('🌱 Seeding database...');

  // 1. Create or retrieve Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: admin.email },
    update: {
      fullName: admin.fullName,
      username: admin.username,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      fullName: admin.fullName,
      username: admin.username,
      email: admin.email,
      password: admin.password,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user ready:', {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
  });

  // 2. Create or retrieve Author user
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {
      fullName: 'John Author',
      username: 'john_author',
      role: 'AUTHOR',
      isActive: true,
    },
    create: {
      fullName: 'John Author',
      username: 'john_author',
      email: 'author@example.com',
      password: 'hashedpassword123',
      bio: 'Technical writer & blogger',
      avatar: 'https://example.com/avatars/john.jpg',
      role: 'AUTHOR',
      isActive: true,
    },
  });

  console.log('✅ Author user ready:', {
    id: authorUser.id,
    email: authorUser.email,
    role: authorUser.role,
  });

  // 3. Create default Category
  let category = await prisma.category.findUnique({
    where: { slug: 'technology' },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Articles and tutorials about software development and tech.',
      },
    });
    console.log('✅ Category created:', category.name);
  }

  // 4. Insert 5 Sample Posts
  console.log('🌱 Seeding sample posts...');
  for (const postData of samplePosts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        status: postData.status,
        authorId: authorUser.id,
        categoryId: category.id,
      },
      create: {
        ...postData,
        authorId: authorUser.id,
        categoryId: category.id,
      },
    });
  }

  console.log('🎉 Successfully seeded database!');
  await disconnectDatabase();
}

main().catch(async (error) => {
  console.error('❌ Seed failed:', error);
  await disconnectDatabase();
  process.exit(1);
});
