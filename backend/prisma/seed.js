import { getPrismaClient, disconnectDatabase } from '../config/database.js';

async function main() {
  const prisma = getPrismaClient();

  console.log('Seeding database...');

  // 1. Create or retrieve a test Author user
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      fullName: 'John Author',
      username: 'john_author',
      email: 'author@example.com',
      password: 'hashedpassword123', // Assumption for testing
      bio: 'Technical writer & blogger',
      avatar: 'https://example.com/avatars/john.jpg',
      role: 'author',
      isActive: true,
    },
  });

  console.log('Test Author user created/found:');
  console.log(`- ID: ${author.id}`);
  console.log(`- Name: ${author.fullName}`);
  console.log(`- Role: ${author.role}`);

  // 2. Create a Post linked to this author
  const post = await prisma.post.create({
    data: {
      authorId: author.id,
      title: 'First Post by John Author',
      slug: 'first-post-by-john-author',
      excerpt: 'This post is written by John Author to test author-post linkage.',
      content: 'Detailed blog content goes here...',
      featuredImage: 'https://example.com/images/post1.jpg',
      status: 'published',
      publishedAt: new Date(),
    },
    include: {
      author: {
        select: { id: true, fullName: true, username: true, email: true, role: true },
      },
    },
  });

  console.log('\nTest Post created with Author linkage:');
  console.log(`- Post ID: ${post.id}`);
  console.log(`- Title: ${post.title}`);
  console.log(`- Author: ${post.author.fullName} (${post.author.id})`);
  console.log(`- Status: ${post.status}`);

  await disconnectDatabase();
}

main().catch(async (e) => {
  console.error('Error seeding database:', e);
  await disconnectDatabase();
  process.exit(1);
});
