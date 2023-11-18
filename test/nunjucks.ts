process.cwd = () => __dirname;
process.env.DEBUG = 'hexo-post-parser,hexo-post-parser:*,hexo-post-parser:*:*';

import './config';

import { join } from 'path';
import { writefile } from 'sbg-utility';
import { getConfig, parsePost } from '../src';
import renderCodeblock from '../src/markdown/renderCodeblock';

const file = join(__dirname, 'src-posts/nunjucks-in-markdown.md');
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
    codeblock: false
  },
  cache: false,
  fix: true,
  sourceFile: file,
  config: getConfig()
}).then(async (result) => {
  result.body = renderCodeblock(result.body);
  result.body = result.body.replace(
    '{{ page.date }}',
    String(result.metadata.date)
  );
  result.body = result.body.replace(
    '{{ page.updated }}',
    String(result.metadata.updated)
  );
  writefile(__dirname + '/tmp/nunjucks.md', result.body);
});
