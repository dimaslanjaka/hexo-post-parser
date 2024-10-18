import { renderBodyMarkdown } from '../src/markdown/toHtml';
import { parsePost } from '../src/markdown/transformPosts';
import { join } from '../src/node/filemanager';

const postPath = join(
  __dirname,
  'src-posts',
  '/2022/05/fully-lazy-loaded-adsense.md'
);
const parse = parsePost(postPath, postPath, false);
const render = renderBodyMarkdown(parse, true);
export { parse, postPath, render };
