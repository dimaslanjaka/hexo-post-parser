import fm from 'front-matter';

/**
 * parse post using front-matter
 * @param content markdown post string
 * @returns
 */
export function parsePostFM<T>(content: string) {
  return fm<T>(content, { allowUnsafe: true });
}
