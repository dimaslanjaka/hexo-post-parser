process.cwd = () => __dirname;

import fs from 'fs-extra';
import path from 'path';
import { getConfig, setConfig } from '../src/types/_config';
import { startParse } from './startParse';

fs.emptyDirSync(__dirname + '/tmp');

console.log(getConfig().permalink);
setConfig({ permalink: ':title.html' });
console.log(getConfig().permalink);

startParse(path.join(__dirname, 'src-posts/with-permalink.md'), getConfig());
startParse(path.join(__dirname, 'src-posts/without-permalink.md'), getConfig());
