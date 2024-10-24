import { parseDateMapper } from '../parseDateMapper';
import { DeepPartial } from '../types';
import { postMap } from '../types/postMap';

/**
 * mapped type
 */
export type mergedPostMap = DeepPartial<postMap & postMap['metadata']>;
export interface archiveMap extends mergedPostMap {
  [key: string]: any;
  /**
   * previous page items
   */
  prev?: mergedPostMap[] | null;
  /**
   * next page items
   */
  next?: mergedPostMap[] | null;
  /**
   * current page number
   */
  page_now?: number;
  /**
   * next page number
   */
  page_next?: number;
  /**
   * next page url (only visible on archive generator)
   */
  page_next_url?: string;
  /**
   * previous page url (only visible on archive generator)
   */
  page_prev_url?: string;
  /**
   * previous page number
   */
  page_prev?: number;
  /**
   * page total
   */
  total?: number;
}

/**
 * Transform post object
 * * merge post metadata property ({@link postMap.metadata}) to root property
 * @returns
 */
export default function postMapper(post: postMap): archiveMap {
  if (post.metadata) {
    post.metadata.date = new parseDateMapper(<string>post.metadata.date);
    return Object.assign(post, post.metadata);
  }
  return post;
}

/**
 * transform array into an mapped chunks
 * @param chunks
 * @returns
 */
export function postChunksMapper<T extends any[][]>(chunks: T): T {
  const defaultMap: archiveMap = {
    page_next: null,
    page_now: null,
    page_next_url: null,
    page_prev: null,
    page_prev_url: null
  };
  chunks.map((arr_chunk, i) => {
    if (Array.isArray(arr_chunk)) {
      const ret = arr_chunk.map((post: archiveMap) => {
        post.page_now = i;
        post.page_next = i + 1;
        post.page_prev = i - 1;
        if (post.page_prev === -1) post.page_prev = null;
        post.total = chunks.length;
        if (Array.isArray(chunks[post.page_prev])) {
          post.prev = chunks[post.page_prev];
        }
        if (Array.isArray(chunks[post.page_next])) {
          post.next = chunks[post.page_next];
        }
        return Object.assign(defaultMap, post);
      });
      return ret;
    }
    return arr_chunk;
  });
  return chunks;
}

export function array_wrap<T extends any[]>(arr: T): T {
  (arr as any)['each'] = arr.forEach;
  return arr;
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export interface DumperType extends Object {
  [key: string]: any;
  next: any;
  prev: any;
  posts: any[];
  content: string;
}

export function simplifyDump<T>(post: T, except?: string[] | string): T;
export function simplifyDump<T extends any[]>(
  post: T,
  except?: string[] | string
): T;
/**
 * simplified dump
 * @param post
 * @returns
 */
export function simplifyDump<T extends DumperType>(
  post: T,
  except: string[] | string = []
) {
  if (Array.isArray(post)) return post.map((o) => simplifyDump(o, except));
  if (typeof post == 'object' && post !== null) {
    if ('posts' in post) {
      const archivePosts = post['posts'] as postMap[];
      if (Array.isArray(archivePosts)) {
        post['posts'] = archivePosts.map((o) => simplifyDump(o, except));
      }
    }

    const keyToRemove = [
      'config',
      'body',
      'prev',
      'next',
      'content',
      'body',
      'sitedata',
      'author'
    ].filter(function (el) {
      if (Array.isArray(except)) {
        return except.indexOf(el) < 0;
      } else {
        return el === except;
      }
    });
    for (const key in post) {
      if (Object.prototype.hasOwnProperty.call(post, key)) {
        if (keyToRemove.includes(key)) {
          if (post[key]) post[key] = <any>`[${typeof post[key]}]`;
        }
      }
    }
    for (const key in post['metadata']) {
      if (Object.prototype.hasOwnProperty.call(post['metadata'], key)) {
        if (keyToRemove.includes(key)) {
          if (post['metadata'][key])
            post['metadata'][key] =
              '[' + <any>typeof post['metadata'][key] + ']';
        }
      }
    }
  }
  return post;
}
