import './a_index';
import { buildPost } from './buildPost';
import { generatePostId } from './generatePostId';
import { renderMarkdownIt as renderMarkdown } from './markdown/toHtml';
import { parsePermalink } from './parsePermalink';
import { parsePost } from './parsePost';

const hexoPostParser = {
  parsePost,
  buildPost,
  generatePostId,
  renderMarkdown,
  parsePermalink
};

export default hexoPostParser;

export { generatePostId } from './generatePostId';
export { DeepPartial, Nullable } from './globals';
export { renderMarkdownIt as renderMarkdown } from './markdown/toHtml';
export { parsePermalink } from './parsePermalink';
export { ParseOptions, postAuthor, postMap, postMeta } from './types';
export { parsePost, buildPost };

//
