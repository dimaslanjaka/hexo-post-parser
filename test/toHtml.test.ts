import { describe, expect, it } from '@jest/globals';
import path from 'path';
import { normalizePath } from 'sbg-utility';
import { fileURLToPath } from 'url';
import { parsePost, renderBodyMarkdown } from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postPath = normalizePath(__dirname, 'src-posts', 'markdown-it.md');

describe('Test Render', () => {
  // the tests container
  it('checking render markdown result', async () => {
    const parse = await parsePost(postPath);
    expect(typeof parse).toBe('object');

    const render = renderBodyMarkdown(parse as any);
    expect(typeof render).toBe('string');
  });
});
