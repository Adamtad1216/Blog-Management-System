import assert from 'node:assert/strict';
import { buildUploadOptions } from '../src/services/cloudinaryService.js';

const options = buildUploadOptions({ originalname: 'avatar.png' }, 'blog-images');

assert.equal(options.folder, 'blog-images');
assert.equal(options.resource_type, 'auto');
assert.match(options.public_id, /^blog-images/);
assert.match(options.public_id, /avatar$/);

console.log('uploadFlow test passed');
