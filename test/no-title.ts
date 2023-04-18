process.cwd = () => __dirname;

import { join } from 'path';
import { findConfig, getConfig } from '../src/types/_config';
import { startParse } from './startParse';

findConfig(__dirname + '/_config.yml');

const post = join(__dirname, 'src-posts/no-title.md');
startParse(post, getConfig());
