process.cwd = () => __dirname;
if (!process.env.DEBUG) {
  process.env.DEBUG =
    'hexo-post-parser,hexo-post-parser:*,hexo-post-parser:*:*';
}

import { getConfig } from '../src';
import { join, readDirectoryRecursive } from '../src/node/filemanager';
import './config';
import { startParse } from './startParse';

(async () => {
  const files = await readDirectoryRecursive(join(__dirname, 'src-posts/date'));
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const post = await startParse(file, getConfig());
      if (post) console.log(post);
    }
  }
})();
