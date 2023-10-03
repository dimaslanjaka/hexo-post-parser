import fm from 'front-matter';
import fs from 'fs';

/**
 * parse post using front-matter
 * @param source markdown post string or path
 * @returns
 */
export function parsePostFM<T>(source: string) {
  let content = '';
  if (fs.existsSync(source)) {
    content = fs.readFileSync(source).toString();
  }
  return fm<T>(content, { allowUnsafe: true });
}
