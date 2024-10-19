process.env.DEBUG = '*';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.cwd = () => path.join(__dirname, '../');

import { write } from '../../src/node/filemanager';
import parsePost from '../../src/parsePost';
import { shortcodeCodeblock } from '../../src/shortcodes/codeblock';

(async () => {
  const file = path.join(__dirname, '/../src-posts/Tests/codeblock.md');
  const parse = await parsePost(file);
  const extract = await shortcodeCodeblock(parse.body);
  write(path.join(__dirname, 'tmp/codeblock.html'), extract);
})();
