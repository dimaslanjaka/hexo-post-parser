/// special imports
import './a_index';
///

/// imports

import { buildPost } from './buildPost';
import { generatePostId } from './generatePostId';
import { renderMarkdownIt as renderMarkdown } from './markdown/toHtml';
import { parsePermalink } from './parsePermalink';
import { parsePost } from './parsePost';
import { getConfig, setConfig } from './types/_config';

/// exports
export { generatePostId } from './generatePostId';
export { DeepPartial, Nullable } from './globals';
export { renderMarkdownIt as renderMarkdown } from './markdown/toHtml';
export * as color from './node/color';
export { parsePermalink } from './parsePermalink';
export { ParseOptions, postAuthor, postMap, postMeta } from './types';
export { getConfig, setConfig } from './types/_config';
export { parsePost, buildPost };

/// object oriented export

const hexoPostParser = {
  parsePost,
  buildPost,
  generatePostId,
  renderMarkdown,
  parsePermalink,
  setConfig,
  getConfig
};

export default hexoPostParser;
