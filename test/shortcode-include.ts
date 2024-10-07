process.cwd = () => __dirname;
import './config';

import { join } from 'path';
import { getConfig } from '../src';
import { startParse } from './startParse';

const post = join(__dirname, 'src-posts/shortcode-include.md');
startParse(post, getConfig()).then(console.log);
