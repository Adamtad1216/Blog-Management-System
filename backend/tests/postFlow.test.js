import assert from 'node:assert/strict';
import { buildPostPayload } from '../src/features/posts/services/postService.js';

const payload = buildPostPayload({
  title: 'My First Post',
  content: 'Hello world',
  categoryName: 'Tech',
  tagNames: ['node', 'prisma'],
});

assert.equal(payload.title, 'My First Post');
assert.equal(payload.slug, 'my-first-post');
assert.equal(payload.category.connectOrCreate.create.name, 'Tech');
assert.deepEqual(payload.tags.create, [
  {
    tag: {
      connectOrCreate: {
        where: { name: 'node' },
        create: { name: 'node', slug: 'node' },
      },
    },
  },
  {
    tag: {
      connectOrCreate: {
        where: { name: 'prisma' },
        create: { name: 'prisma', slug: 'prisma' },
      },
    },
  },
]);

console.log('postFlow test passed');
