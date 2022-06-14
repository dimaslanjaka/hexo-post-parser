import uuidv4 from './node/uuid';
import { postMeta } from './types/postMeta';

/**
 * generate post id using uuid v4
 * @param meta
 * @returns
 */
export function generatePostId(meta: postMeta) {
  let id: string;
  if ('title' in meta && 'webtitle' in meta) {
    id = meta.title + meta.webtitle;
  } else if ('description' in meta) {
    id = meta.description;
  } else if ('subtitle' in meta) {
    id = meta.subtitle;
  } else if ('excerpt' in meta) {
    id = meta.excerpt;
  } else if ('title' in meta) {
    id = meta.title;
  }

  return uuidv4(id);
}
