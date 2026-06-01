process.env.DEBUG = '*';

const path = require('path');
const { normalizePathUnix, writefile } = require('sbg-utility');
const { parsePost, getConfig, buildPost } = require('../../dist/index.cjs');

// resolve paths relative to test/ (parent of dist-test/)
const testDir = path.resolve(__dirname, '..');
const config = getConfig();

const parse = (file) =>
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

const doTest = (file, minimumBodyLength = 100) => {
  const relative = normalizePathUnix(file).replace(
    normalizePathUnix(testDir),
    ''
  );
  it(relative, async () => {
    const result = await parse(file);
    writefile(
      path.join(testDir, 'tmp/dist-test/parsePost/', path.basename(file)),
      buildPost(result)
    );
    expect(typeof result.metadata).toBe('object');
    expect(typeof result.metadata.title).toBe('string');
    expect(result.body.length).toBeGreaterThan(minimumBodyLength);
    expect(result.metadata.tags).toBeInstanceOf(Array);
    expect(result.metadata.categories).toBeInstanceOf(Array);
    expect(result.metadata.photos).toBeInstanceOf(Array);
  });
};

const files = [
  [path.join(testDir, 'src-posts/post-assets-folder/asset-folder.md'), 100],
  [path.join(testDir, 'src-posts/with-custom-permalink.md'), 10],
  [path.join(testDir, 'src-posts/markdown-it.md'), 100]
];

describe('parsePost() from dist', () => {
  files.map(([file, minimumBodyLength]) => doTest(file, minimumBodyLength));
});
