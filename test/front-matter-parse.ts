process.cwd = () => __dirname;

import { join } from 'path';
import { parsePostFM } from '../src';

const post = join(__dirname, 'src-posts/without-description.md');
const result = parsePostFM(post);
console.log(result);
