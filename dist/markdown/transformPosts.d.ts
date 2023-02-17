import { postMap } from './transformPosts/parsePost';
export { parsePost } from './transformPosts/parsePost';
/**
 * Save Parsed Hexo markdown post
 * @param parsed return {@link parsePost}
 * @param file file path to save
 */
export declare function saveParsedPost(parsed: postMap, file: string): void;
/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
export declare function buildPost(parsed: postMap): string;
/**
 * validate {@link parsePost}
 * @param parse
 * @returns
 */
export declare const validateParsed: (parse: postMap) => boolean;
