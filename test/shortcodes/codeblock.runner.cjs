process.env.DEBUG = '*';

const path = require('path');

process.cwd = () => path.join(__dirname, '../');

const {
  write,
  parsePost,
  shortcodeCodeblock
} = require('../../dist/index.cjs');

(async () => {
  const file = path.join(__dirname, '/../src-posts/Tests/codeblock.md');
  const parse = await parsePost(file);
  const extract = await shortcodeCodeblock(parse.body);
  write(path.join(__dirname, 'tmp/codeblock.html'), extract);
})();
