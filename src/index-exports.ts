/// special exports
import fs from 'fs-extra';
import path from 'path';

// [task] generate empty config if not exists
[
  path.join(__dirname, 'types/_config_project.json'),
  path.join(__dirname, 'types/_config_theme.json'),
  path.join(__dirname, 'types/_config_hashes.json')
].forEach((fpath) => {
  if (!fs.existsSync(fpath)) {
    if (!fs.existsSync(path.dirname(fpath)))
      fs.mkdirSync(path.dirname(fpath), { recursive: true });
    fs.writeFileSync(fpath, '{}');
  }
});

// declare require types
export declare function require<T>(name: string): T;
///

/// exports
export * from './buildPost';
export * from './generatePostId';
export { default as renderBodyMarkdown } from './markdown/renderBodyMarkdown';
export { renderMarkdownIt as renderMarkdown } from './markdown/toHtml';
export * as color from './node/color';
export * from './parsePermalink';
export * from './parsePost';
export * from './parsePost-front-matter';
export * from './types';
export { getConfig, setConfig } from './types/_config';

////
