import { postMeta } from './types';
/**
 * parse post using front-matter
 * @param source markdown post string or path
 * @returns
 */
export declare function parsePostFM(source: string): import("front-matter").FrontMatterResult<postMeta>;
