process.env.DEBUG = '*';
process.cwd = () => __dirname;
import './config';

import { writefile } from 'sbg-utility';
import { buildPost, getConfig, parsePost } from '../src';
import { renderMarked } from '../src/markdown/markdownRenderers';
import { join } from '../src/node/filemanager';

const file = join(__dirname, 'src-posts/markdown-it.md');

async function main() {
  const result = await parsePost(file, {
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
    config: getConfig()
  });
  if (result) {
    const { body } = result;
    const bodyHtml = renderMarked(body);
    writefile(join(__dirname, 'tmp/test/heap-test.md'), buildPost(result));
    writefile(join(__dirname, 'tmp/test/heap-test.html'), bodyHtml);
  }
}

main();
