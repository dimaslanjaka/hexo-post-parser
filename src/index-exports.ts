/// special exports
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

// [task] generate empty config if not exists
[
  join(__dirname, 'types/_config_project.json'),
  join(__dirname, 'types/_config_theme.json'),
  join(__dirname, 'types/_config_hashes.json')
].forEach((path) => {
  if (!existsSync(path)) {
    if (!existsSync(dirname(path)))
      mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, '{}');
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
