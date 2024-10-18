import { join } from 'upath';
import { write } from '../../src/node/filemanager';
import parsePost from '../../src/parsePost';
import { shortcodeCodeblock } from '../../src/shortcodes/codeblock';

(async () => {
  const file = join(__dirname, '/../src-posts/Tests/codeblock.md');
  const parse = await parsePost(file);
  const extract = await shortcodeCodeblock(parse.body);
  write(join(__dirname, 'tmp/codeblock.html'), extract);
})();
