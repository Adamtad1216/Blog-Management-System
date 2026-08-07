import assert from 'node:assert/strict';
import { buildPostSearchFilter } from '../src/features/posts/services/postService.js';

const filter = buildPostSearchFilter('prisma');

assert.deepEqual(filter, {
  OR: [
    { title: { contains: 'prisma', mode: 'insensitive' } },
    { content: { contains: 'prisma', mode: 'insensitive' } },
    { slug: { contains: 'prisma', mode: 'insensitive' } },
  ],
});

console.log('searchFlow test passed');
