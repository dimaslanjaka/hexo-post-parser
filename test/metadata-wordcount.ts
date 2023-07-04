process.cwd = () => __dirname;
if (!process.env.DEBUG) {
  process.env.DEBUG =
    'hexo-post-parser,hexo-post-parser:*,hexo-post-parser:*:*';
}

import { join } from 'path';
import { getConfig } from '../src';
import './config';
import { startParse } from './startParse';

const post = join(__dirname, 'src-posts/Tests/codeblock.md');
startParse(post, getConfig());
