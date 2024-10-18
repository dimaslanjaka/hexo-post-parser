import fm from 'front-matter';
import fs from 'fs-extra';
import { postMeta } from './types';

/**
 * parse post using front-matter
 * @param source markdown post string or path
 * @returns
 */
export function parsePostFM(source: string) {
  let content = '';
  if (fs.existsSync(source)) {
    content = fs.readFileSync(source).toString();
  }
  return fm<postMeta>(content, {
    allowUnsafe: true
  });
}
