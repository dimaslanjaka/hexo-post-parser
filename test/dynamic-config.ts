process.cwd = () => __dirname;

import fs from 'fs-extra';
import path from 'path';
import { getConfig, setConfig } from '../src/types/_config';
import { startParse } from './startParse';

fs.emptyDirSync(__dirname + '/tmp');

console.log('first config', getConfig().permalink);

[':title.html', ':year/:title'].forEach((pattern) => {
  setConfig({ permalink: pattern });
  console.log('permalink modified', getConfig().permalink);

  startParse(
    path.join(__dirname, 'src-posts/with-permalink.md'),
    getConfig(),
    pattern
  );
  startParse(
    path.join(__dirname, 'src-posts/without-permalink.md'),
    getConfig(),
    pattern
  );
  startParse(
    path.join(__dirname, 'source/_posts/auto-generated-post.md'),
    getConfig(),
    pattern
  );
});
