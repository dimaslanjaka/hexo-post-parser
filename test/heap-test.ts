process.env.DEBUG = '*';
process.cwd = () => __dirname;
import './config';

import { join } from 'path';
import { getConfig, parsePostFM } from '../src';
import { renderMarked } from '../src/markdown/toHtml';
import { startParse } from './startParse';

const post = join(__dirname, 'src-posts/table.md');
const fm = () => parsePostFM(post);
const hpp = () => startParse(post, getConfig());

async function main() {
  const result = fm();
  const { body } = result;
  const bodyHtml = renderMarked(body);
  console.log(bodyHtml);
}

main();
