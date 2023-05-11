process.cwd = () => __dirname;

import { join } from 'upath';
import { buildPost, getConfig, parsePost } from '../src';
import { simplifyDump } from '../src/markdown/transformPosts/postMapper';
import color from '../src/node/color';
import debug from '../src/node/debug';
import { write } from '../src/node/filemanager';
import slugify from '../src/node/slugify';

/**
 * start parse post
 * @param file
 * @param config  overriden config
 * @returns
 */
export async function startParse(
  file: string,
  config?: Record<string, any>,
  outputPrefix?: string
) {
  const parse = await parsePost(file, {
    formatDate: true,
    shortcodes: {
      youtube: true,
      include: true,
      css: true,
      script: true,
      link: true,
      text: true,
      now: true,
      codeblock: true
    },
    cache: false,
    fix: true,
    sourceFile: file,
    config: <any>config || getConfig()
  });
  if (parse && parse.metadata) {
    const filename = parse.metadata.title;
    const folder = join(__dirname, 'tmp/test/parsePost', config.root);
    const mdFile = await write(
      join(folder, slugify(outputPrefix || '' + filename) + '.md'),
      buildPost(parse)
    );

    const jsonFile = await write(
      join(folder, slugify(outputPrefix || '' + filename) + '.json'),
      simplifyDump(parse)
    );

    debug('test')(String(jsonFile).replace(join(__dirname, '..') + '/', ''));
    debug('test')(String(mdFile).replace(join(__dirname, '..') + '/', ''));
  } else {
    debug('test')(color.redBright('fail parse'), file);
  }
  return parse;
}
