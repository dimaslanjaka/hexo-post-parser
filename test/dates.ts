process.cwd = () => __dirname;
if (!process.env.DEBUG) {
  process.env.DEBUG =
    'hexo-post-parser,hexo-post-parser:*,hexo-post-parser:*:*';
}

import { getConfig } from '../src';
import { join, readDirectoryRecursive } from '../src/node/filemanager';
import './config';
import { startParse } from './startParse';

const files = readDirectoryRecursive(join(__dirname, 'src-posts/date'));
files.then((files) => {
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      startParse(file, getConfig());
    }
  }
});
