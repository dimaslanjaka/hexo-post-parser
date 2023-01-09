process.cwd = () => __dirname;
if (!process.env.DEBUG) {
  // process.env.DEBUG = 'hexo-post-parser:permalink,hexo-post-parser:parse:*';
  process.env.DEBUG = 'hexo-post-parser:permalink:result';
}

import Bluebird from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, setConfig } from '../src'; // change dist or src
import { startParse } from './startParse';

fs.emptyDirSync(__dirname + '/tmp');

Bluebird.all([
  getConfig().permalink,
  ':title/',
  ':title.html',
  ':year/:name',
  ':year/:day/:name.html',
  ':year/:month/:day/:name',
  'post/:name/'
]).each(async function (pattern) {
  setConfig({
    permalink: pattern,
    root: '/subfolder/',
    url: 'http://example.net/subfolder',
    generator: {
      cache: false
    }
  });
  console.log('permalink modified', getConfig().permalink);

  const dirs = (await deepReadDir(__dirname + '/src-posts'))
    .concat(...(await deepReadDir(__dirname + '/source/_posts')))
    .filter((str) => str.endsWith('.md') && !str.includes('/feeds/'))
    // Shuffle array
    .sort(() => 0.5 - Math.random())
    // get 5 post
    .slice(0, 5);

  for (let i = 0; i < dirs.length; i++) {
    const file = dirs[i];
    await startParse(file, getConfig(), pattern);
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
});

export async function deepReadDir(dirPath: fs.PathLike): Promise<string[]> {
  return (
    await Promise.all(
      (
        await fs.readdir(dirPath, { withFileTypes: true })
      ).map(async (dirent) => {
        const fpath = path.join(String(dirPath), dirent.name);
        return dirent.isDirectory() ? await deepReadDir(fpath) : fpath;
      })
    )
  )
    .flat(Number.POSITIVE_INFINITY)
    .map((f) => String(f));
}
