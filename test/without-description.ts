process.cwd = () => __dirname;

import { join } from 'path';
import { getConfig } from '../src/types/_config';
import { startParse } from './startParse';

const post = join(__dirname, 'src-posts/without-description.md');
startParse(post, getConfig()).then(console.log);
