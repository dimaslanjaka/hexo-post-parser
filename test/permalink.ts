process.cwd = () => __dirname;
if (!process.env.DEBUG)
  process.env.DEBUG = 'hexo-post-parser:permalink,hexo-post-parser:parse:*';

import Bluebird from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, setConfig } from '../src';
import { startParse } from './startParse';

fs.emptyDirSync(__dirname + '/tmp');

Bluebird.all([
  getConfig().permalink,
  ':title/',
  ':title.html',
  ':year/:title',
  ':year/:day/:title.html',
  ':year/:month/:day/:title',
  'post/:title/'
]).each(async function (pattern) {
  setConfig({
    permalink: pattern,
    root: '/subfolder/',
    url: 'http://example.net/subfolder'
  });
  console.log('permalink modified', getConfig().permalink);

  await startParse(
    path.join(__dirname, 'src-posts/with-permalink.md'),
    getConfig(),
    pattern
  );
  await startParse(
    path.join(__dirname, 'src-posts/without-permalink.md'),
    getConfig(),
    pattern
  );
  await startParse(
    path.join(__dirname, 'source/_posts/auto-generated-post.md'),
    getConfig(),
    pattern
  );
});
