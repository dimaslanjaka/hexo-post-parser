process.env.DEBUG = '*';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { describe, expect, it } from '@jest/globals';
import { normalizePathUnix, writefile } from 'sbg-utility';
import { buildPost, getConfig, parsePost } from '../src';

const config = getConfig();

const parse = (file: string) =>
  parsePost(file, {
    formatDate: true,
    shortcodes: {
      youtube: true,
      include: true,
      css: true,
      script: true,
      link: true,
      text: true,
      now: true,
      codeblock: true
    },
    cache: false,
    fix: true,
    sourceFile: file,
    config: config
  });

const doTest = (file: string) => {
  const relative = normalizePathUnix(file).replace(
    normalizePathUnix(__dirname),
    ''
  );
  it(relative, async () => {
    const result = await parse(file);
    writefile(
      path.join(__dirname, 'tmp/test/parsePost/', path.basename(file)),
      buildPost(result)
    );
    expect(typeof result.metadata).toBe('object');
    expect(typeof result.metadata.title).toBe('string');
    expect(result.body.length).toBeGreaterThan(100);
    expect(result.metadata.tags).toBeInstanceOf(Array);
    expect(result.metadata.categories).toBeInstanceOf(Array);
    expect(result.metadata.photos).toBeInstanceOf(Array);
  });
};

const files = [
  path.join(__dirname, 'src-posts/post-assets-folder/asset-folder.md'),
  path.join(__dirname, 'src-posts/with-custom-permalink.md'),
  path.join(__dirname, 'src-posts/markdown-it.md')
];

describe('parsePost()', () => {
  files.map(doTest);
});
