process.cwd = () => __dirname;
if (!process.env.DEBUG) {
  process.env.DEBUG =
    'hexo-post-parser,hexo-post-parser:*,hexo-post-parser:*:*';
}

import { momentHpp } from '../src/parseDateMapper';

const iso = momentHpp('2011-04-11T10:20:30Z');
console.log(iso.format('YYYY-MM-DDTHH:mm:ssZ'));
